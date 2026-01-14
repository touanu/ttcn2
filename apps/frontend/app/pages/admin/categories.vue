<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { CourseCategory } from '@shared/types'
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
const categoriesToDelete = ref<CourseCategory[]>([])
const selectedCategory = ref<CourseCategory | null>(null)

const columnFilters = ref([{
  id: 'name',
  value: '',
}])
const columnVisibility = ref()
const rowSelection = ref({})

function openDeleteModal() {
  const selectedRows = table.value?.tableApi?.getFilteredSelectedRowModel().rows || []
  categoriesToDelete.value = selectedRows.map((row: Row<CourseCategory>) => row.original)

  if (categoriesToDelete.value.length > 0) {
    deleteModalOpen.value = true
  }
}

function openViewModal(category: CourseCategory) {
  selectedCategory.value = category
  viewModalOpen.value = true
}

function openEditModal(category: CourseCategory) {
  selectedCategory.value = category
  editModalOpen.value = true
}

function handleViewEdit(category: CourseCategory) {
  selectedCategory.value = category
  editModalOpen.value = true
}

function handleViewDelete(category: CourseCategory) {
  categoriesToDelete.value = [category]
  deleteModalOpen.value = true
}

function handleDeleted() {
  if (table.value?.tableApi) {
    table.value.tableApi.resetRowSelection()
  }
}

function handleCreated() {
  // Refresh data after create
}

const { data, status } = await useFetch<CourseCategory[]>('/api/categories', {
  lazy: true,
  server: false,
  default: () => [],
})

function getRowItems(row: Row<CourseCategory>) {
  return [
    {
      type: 'label',
      label: $t('COMMON.ACTIONS'),
    },
    {
      label: $t('ADMIN.CATEGORIES.COPY_CATEGORY_ID'),
      icon: 'i-heroicons-clipboard-document',
      onSelect() {
        if (row.original._id) {
          navigator.clipboard.writeText(row.original._id)
          toast.add({
            title: $t('ADMIN.USERS.COPIED_TO_CLIPBOARD'),
            description: $t('ADMIN.CATEGORIES.CATEGORY_ID_COPIED'),
          })
        }
      },
    },
    {
      type: 'separator',
    },
    {
      label: $t('ADMIN.CATEGORIES.VIEW_CATEGORY'),
      icon: 'i-heroicons-eye',
      onSelect() {
        openViewModal(row.original)
      },
    },
    {
      label: $t('ADMIN.CATEGORIES.EDIT_CATEGORY'),
      icon: 'i-heroicons-pencil',
      onSelect() {
        openEditModal(row.original)
      },
    },
    {
      type: 'separator',
    },
    {
      label: $t('ADMIN.CATEGORIES.DELETE_CATEGORY'),
      icon: 'i-heroicons-trash',
      color: 'error',
      onSelect() {
        categoriesToDelete.value = [row.original]
        deleteModalOpen.value = true
      },
    },
  ]
}

const columns: TableColumn<CourseCategory>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': $t('ADMIN.CATEGORIES.SELECT_ALL'),
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'ariaLabel': $t('ADMIN.CATEGORIES.SELECT_ROW'),
      }),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: $t('ADMIN.CATEGORIES.COLUMN_NAME'),
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-heroicons-arrow-up-narrow-wide'
            : 'i-heroicons-arrow-down-wide-narrow'
          : 'i-heroicons-arrows-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
  },
  {
    accessorKey: 'description',
    header: $t('ADMIN.CATEGORIES.COLUMN_DESCRIPTION'),
    cell: ({ row }) => {
      return h('p', { class: 'text-sm text-muted truncate max-w-md' }, row.original.description)
    },
  },
  {
    accessorKey: 'createdAt',
    header: $t('COMMON.CREATED_AT'),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      return h('span', {}, date.toLocaleDateString())
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
  <UDashboardPanel id="admin-categories">
    <template #header>
      <UDashboardNavbar :title="$t('ADMIN.NAV.CATEGORIES')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <AdminCategoriesAddModal
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
            :placeholder="$t('ADMIN.CATEGORIES.FILTER_NAMES')"
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
              <UIcon name="i-heroicons-tag" class="w-8 h-8 text-muted" />
              <p class="text-muted">
                {{ $t('ADMIN.CATEGORIES.SUBTITLE') }}
              </p>
            </div>
          </template>
        </UTable>
      </UPageCard>
    </template>
  </UDashboardPanel>

  <AdminCategoriesDeleteModal
    v-model:open="deleteModalOpen"
    :categories="categoriesToDelete"
    @deleted="handleDeleted"
  />

  <AdminCategoriesViewModal
    v-model:open="viewModalOpen"
    :category="selectedCategory"
    @edit="handleViewEdit"
    @delete="handleViewDelete"
  />

  <AdminCategoriesEditModal
    v-model:open="editModalOpen"
    :category="selectedCategory"
    @updated="handleDeleted"
  />
</template>
