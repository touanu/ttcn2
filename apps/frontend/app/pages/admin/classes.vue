<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Class, Course, User } from '@shared/types'
import type { Row } from '@tanstack/table-core'
import { getPaginationRowModel } from '@tanstack/table-core'

definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef('table')
const addModalOpen = ref(false)
const deleteModalOpen = ref(false)
const viewModalOpen = ref(false)
const editModalOpen = ref(false)
const classesToDelete = ref<Class[]>([])
const selectedClass = ref<Class | null>(null)

const columnFilters = ref([{
  id: 'name',
  value: '',
}])
const columnVisibility = ref()
const rowSelection = ref({})

function openDeleteModal() {
  const selectedRows = table.value?.tableApi?.getFilteredSelectedRowModel().rows || []
  classesToDelete.value = selectedRows.map((row: Row<Class>) => row.original)

  if (classesToDelete.value.length > 0) {
    deleteModalOpen.value = true
  }
}

function openViewModal(classItem: Class) {
  selectedClass.value = classItem
  viewModalOpen.value = true
}

function openEditModal(classItem: Class) {
  selectedClass.value = classItem
  editModalOpen.value = true
}

function handleViewEdit(classItem: Class) {
  selectedClass.value = classItem
  editModalOpen.value = true
}

function handleViewDelete(classItem: Class) {
  classesToDelete.value = [classItem]
  deleteModalOpen.value = true
}

const { data: classes, status, refresh: refreshClasses } = await useFetch<Class[]>('/api/admin/classes', {
  lazy: true,
  server: false,
  default: () => [],
  key: 'admin-classes',
})

const { data: courses } = await useFetch<Course[]>('/api/admin/courses', {
  server: false,
  default: () => [],
  key: 'admin-courses-for-classes',
})

const { data: users } = await useFetch<User[]>('/api/admin/users', {
  lazy: true,
  server: false,
  default: () => [],
  key: 'admin-users-for-classes',
})

function getCourseName(courseId: string): string {
  if (!courseId)
    return '-'
  const course = courses.value?.find(c => c._id === courseId)
  if (!course)
    return courseId
  return course.title
}

function handleDeleted() {
  if (table.value?.tableApi) {
    table.value.tableApi.resetRowSelection()
  }
  refreshClasses()
}

async function handleCreated() {
  await refreshClasses()
}

function getTeacherName(teacherId: string): string {
  if (!teacherId)
    return '-'
  const teacher = users.value?.find(user => user._id === teacherId)
  if (!teacher)
    return teacherId
  return `${teacher.fullName || ''} (@${teacher.username || ''})`
}

function getRowItems(row: Row<Class>) {
  return [
    {
      type: 'label',
      label: $t('COMMON.ACTIONS'),
    },
    {
      label: $t('ADMIN.CLASSES.COPY_CLASS_ID'),
      icon: 'i-lucide-copy',
      onSelect() {
        if (row.original._id) {
          navigator.clipboard.writeText(row.original._id)
          toast.add({
            title: $t('ADMIN.USERS.COPIED_TO_CLIPBOARD'),
            description: $t('ADMIN.CLASSES.CLASS_ID_COPIED'),
          })
        }
      },
    },
    {
      type: 'separator',
    },
    {
      label: $t('ADMIN.CLASSES.VIEW_CLASS'),
      icon: 'i-lucide-eye',
      onSelect() {
        openViewModal(row.original)
      },
    },
    {
      label: $t('ADMIN.CLASSES.EDIT_CLASS'),
      icon: 'i-lucide-pencil',
      onSelect() {
        openEditModal(row.original)
      },
    },
    {
      type: 'separator',
    },
    {
      label: $t('ADMIN.CLASSES.DELETE_CLASS'),
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        classesToDelete.value = [row.original]
        deleteModalOpen.value = true
      },
    },
  ]
}

const columns: TableColumn<Class>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': $t('ADMIN.CLASSES.SELECT_ALL'),
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'ariaLabel': $t('ADMIN.CLASSES.SELECT_ROW'),
      }),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: $t('ADMIN.CLASSES.COLUMN_NAME'),
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-heroicons-arrow-up-narrow-wide'
            : 'i-heroicons-arrow-down-wide-narrow'
          : 'i-heroicons-arrows-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
    cell: ({ row }) => {
      const teacherName = getTeacherName(row.original.teacherId)
      return h('div', {}, [
        h('p', { class: 'font-medium text-highlighted' }, row.original.name),
        h('p', { class: 'text-sm text-muted' }, teacherName),
      ])
    },
  },
  {
    accessorKey: 'courseId',
    header: $t('ADMIN.CLASSES.COLUMN_COURSE'),
    cell: ({ row }) => {
      return h('span', {}, getCourseName(row.original.courseId))
    },
  },
  {
    accessorKey: 'room',
    header: $t('ADMIN.CLASSES.ROOM'),
    cell: ({ row }) => {
      return h('span', { class: row.original.room ? '' : 'text-muted' }, row.original.room || '-')
    },
  },
  {
    accessorKey: 'status',
    header: $t('ADMIN.CLASSES.COLUMN_STATUS'),
    cell: ({ row }) => {
      const UBadge = resolveComponent('UBadge')
      const statusColors: Record<string, string> = {
        ACTIVE: 'success',
        PENDING: 'warning',
        COMPLETED: 'neutral',
        CANCELLED: 'error',
      }
      return h(UBadge, {
        color: statusColors[row.original.status || 'PENDING'],
        variant: 'subtle',
      }, () => $t(`ADMIN.CLASSES.STATUS_${row.original.status || 'PENDING'}`))
    },
  },
  {
    accessorKey: 'openedAt',
    header: $t('ADMIN.CLASSES.COLUMN_START_DATE'),
    cell: ({ row }) => {
      const date = row.original.startDate || row.original.openedAt
      if (!date) {
        return h('span', { class: 'text-muted' }, '-')
      }
      return h('span', {}, new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }))
    },
  },
  {
    accessorKey: 'endedAt',
    header: $t('ADMIN.CLASSES.COLUMN_END_DATE'),
    cell: ({ row }) => {
      const date = row.original.endDate || row.original.endedAt
      if (!date) {
        return h('span', { class: 'text-muted' }, '-')
      }
      return h('span', {}, new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }))
    },
  },
  {
    accessorKey: 'studentCount',
    header: $t('ADMIN.CLASSES.COLUMN_STUDENTS'),
    cell: ({ row }) => {
      const count = row.original.studentIds?.length || 0
      return h('span', { class: 'font-medium' }, count.toString())
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end',
            },
            items: getRowItems(row),
          },
          () =>
            h(UButton, {
              icon: 'i-heroicons-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
            }),
        ),
      )
    },
  },
]
</script>

<template>
  <UDashboardPanel id="admin-classes">
    <template #header>
      <UDashboardNavbar :title="$t('ADMIN.NAV.CLASSES')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <AdminClassesAddModal
            v-model:open="addModalOpen"
            @created="handleCreated"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            :model-value="columnFilters[0]?.value"
            icon="i-heroicons-magnifying-glass"
            :placeholder="$t('ADMIN.CLASSES.FILTER_NAMES')"
            class="w-full sm:w-64"
            @update:model-value="(value: string) => { if (columnFilters[0]) columnFilters[0].value = value }"
          />
          <UButton
            v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
            :label="$t('COMMON.DELETE')"
            color="error"
            variant="subtle"
            icon="i-heroicons-trash"
            @click="openDeleteModal"
          >
            <template #trailing>
              <UKbd>
                {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
              </UKbd>
            </template>
          </UButton>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UPageCard variant="subtle" :ui="{ body: 'p-0' }">
        <UTable
          ref="table"
          v-model:column-filters="columnFilters"
          v-model:column-visibility="columnVisibility"
          v-model:row-selection="rowSelection"
          :columns="columns"
          :data="classes"
          :loading="status === 'pending'"
          :get-pagination-row-model="getPaginationRowModel"
        >
          <template #loading>
            <div class="flex items-center justify-center h-32">
              <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
            </div>
          </template>

          <template #empty>
            <div class="flex flex-col items-center justify-center h-32 gap-2">
              <UIcon name="i-heroicons-user-group" class="w-8 h-8 text-muted" />
              <p class="text-muted">
                {{ $t('ADMIN.CLASSES.SUBTITLE') }}
              </p>
            </div>
          </template>
        </UTable>
      </UPageCard>
    </template>
  </UDashboardPanel>

  <AdminClassesDeleteModal
    v-model:open="deleteModalOpen"
    :classes="classesToDelete"
    @deleted="handleDeleted"
  />

  <AdminClassesViewModal
    v-model:open="viewModalOpen"
    :class-item="selectedClass"
    @edit="handleViewEdit"
    @delete="handleViewDelete"
  />

  <AdminClassesEditModal
    v-model:open="editModalOpen"
    :class-item="selectedClass"
    @updated="handleDeleted"
  />
</template>
