<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/table-core'
import { getPaginationRowModel } from '@tanstack/table-core'
import { upperFirst } from 'scule'

definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef('table')

const columnFilters = ref([{
  id: 'title',
  value: '',
}])
const columnVisibility = ref()
const rowSelection = ref({})

interface Course {
  _id: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  status: 'draft' | 'published' | 'archived'
  lessonsCount: number
  createdAt: string
}

const { data, status } = await useFetch<Course[]>('/api/admin/courses', {
  lazy: true,
  default: () => [],
})

function getRowItems(row: Row<Course>) {
  return [
    {
      type: 'label',
      label: $t('COMMON.ACTIONS'),
    },
    {
      label: $t('ADMIN.COURSES.COPY_COURSE_ID'),
      icon: 'i-heroicons-clipboard-document',
      onSelect() {
        if (row.original._id) {
          navigator.clipboard.writeText(row.original._id)
          toast.add({
            title: $t('ADMIN.USERS.COPIED_TO_CLIPBOARD'),
            description: $t('ADMIN.COURSES.COURSE_ID_COPIED'),
          })
        }
      },
    },
    {
      type: 'separator',
    },
    {
      label: $t('ADMIN.COURSES.EDIT_COURSE'),
      icon: 'i-heroicons-pencil',
      onSelect() {
        toast.add({
          title: $t('ADMIN.COURSES.EDIT_COURSE'),
          description: $t('ADMIN.COURSES.EDIT_COMING_SOON'),
        })
      },
    },
    {
      label: $t('ADMIN.COURSES.VIEW_LESSONS'),
      icon: 'i-heroicons-book-open',
    },
    {
      type: 'separator',
    },
    {
      label: $t('ADMIN.COURSES.DELETE_COURSE'),
      icon: 'i-heroicons-trash',
      color: 'error',
      onSelect() {
        toast.add({
          title: $t('ADMIN.COURSES.COURSE_DELETED'),
          description: $t('ADMIN.COURSES.COURSE_DELETED_DESC'),
          color: 'error',
        })
      },
    },
  ]
}

const columns: TableColumn<Course>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': $t('ADMIN.COURSES.SELECT_ALL'),
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'ariaLabel': $t('ADMIN.COURSES.SELECT_ROW'),
      }),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: $t('ADMIN.COURSES.COLUMN_TITLE'),
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-heroicons-arrow-up-narrow-wide'
            : 'i-heroicons-arrow-down-wide-narrow'
          : 'i-heroicons-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
    cell: ({ row }) => {
      return h('div', undefined, [
        h('p', { class: 'font-medium text-highlighted' }, row.original.title),
        h('p', { class: 'text-sm text-muted truncate max-w-md' }, row.original.description),
      ])
    },
  },
  {
    accessorKey: 'level',
    header: $t('ADMIN.COURSES.COLUMN_LEVEL'),
    filterFn: 'equals',
    cell: ({ row }) => {
      const color = {
        beginner: 'success' as const,
        intermediate: 'warning' as const,
        advanced: 'error' as const,
      }[row.original.level]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        upperFirst(row.original.level))
    },
  },
  {
    accessorKey: 'status',
    header: $t('ADMIN.COURSES.COLUMN_STATUS'),
    filterFn: 'equals',
    cell: ({ row }) => {
      const color = {
        published: 'success' as const,
        draft: 'warning' as const,
        archived: 'neutral' as const,
      }[row.original.status]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        upperFirst(row.original.status))
    },
  },
  {
    accessorKey: 'lessonsCount',
    header: $t('ADMIN.COURSES.COLUMN_LESSONS'),
    cell: ({ row }) => row.original.lessonsCount || 0,
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

const statusFilter = ref<{ value: string, label: string }>({ value: 'all', label: 'All' })
const levelFilter = ref<{ value: string, label: string }>({ value: 'all', label: 'All' })

watch(() => statusFilter.value, (newVal) => {
  if (!table?.value?.tableApi)
    return

  const statusColumn = table.value.tableApi.getColumn('status')
  if (!statusColumn)
    return

  statusColumn.setFilterValue(newVal.value === 'all' ? undefined : newVal.value)
})

watch(() => levelFilter.value, (newVal) => {
  if (!table?.value?.tableApi)
    return

  const levelColumn = table.value.tableApi.getColumn('level')
  if (!levelColumn)
    return

  levelColumn.setFilterValue(newVal.value === 'all' ? undefined : newVal.value)
})
</script>

<template>
  <UDashboardPanel id="admin-courses">
    <template #header>
      <UDashboardNavbar :title="$t('ADMIN.NAV.COURSES')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton
            :label="$t('ADMIN.ADD_COURSE')"
            icon="i-heroicons-plus"
            color="primary"
          />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <UInput
            :model-value="columnFilters[0]?.value"
            icon="i-heroicons-magnifying-glass"
            :placeholder="$t('FORMS.SEARCH_PLACEHOLDER')"
            class="w-full sm:w-64"
            @update:model-value="(value) => { if (columnFilters[0]) columnFilters[0].value = value }"
          />
        </template>
        <template #right>
          <USelectMenu
            :model-value="statusFilter"
            :items="[
              { value: 'all', label: $t('COMMON.ALL') },
              { value: 'published', label: $t('COURSE.STATUS.PUBLISHED') },
              { value: 'draft', label: $t('COURSE.STATUS.DRAFT') },
              { value: 'archived', label: $t('COURSE.STATUS.ARCHIVED') },
            ]"
            value-attribute="value"
            class="w-40"
            @update:model-value="(value) => statusFilter = value"
          />
          <USelectMenu
            :model-value="levelFilter"
            :items="[
              { value: 'all', label: $t('COMMON.ALL') },
              { value: 'beginner', label: $t('COURSE.LEVELS.BEGINNER') },
              { value: 'intermediate', label: $t('COURSE.LEVELS.INTERMEDIATE') },
              { value: 'advanced', label: $t('COURSE.LEVELS.ADVANCED') },
            ]"
            value-attribute="value"
            class="w-40"
            @update:model-value="(value) => levelFilter = value"
          />
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
          :data="data"
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
              <UIcon name="i-heroicons-academic-cap" class="w-8 h-8 text-muted" />
              <p class="text-muted">
                {{ $t('ADMIN.COURSES.SUBTITLE') }}
              </p>
            </div>
          </template>
        </UTable>
      </UPageCard>
    </template>
  </UDashboardPanel>
</template>
