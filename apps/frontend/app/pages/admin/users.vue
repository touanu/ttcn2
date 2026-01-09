<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { User } from '@shared/types'
import type { Row } from '@tanstack/table-core'
import { getPaginationRowModel } from '@tanstack/table-core'
import { upperFirst } from 'scule'

definePageMeta({
  layout: 'admin',
})

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef('table')
const deleteModalOpen = ref(false)
const usersToDelete = ref<User[]>([])
const { canDeleteUser } = useUserAbilities()

const columnFilters = ref([{
  id: 'email',
  value: '',
}])
const columnVisibility = ref()
const rowSelection = ref({ 1: true })

function openDeleteModal() {
  const selectedRows = table.value?.tableApi?.getFilteredSelectedRowModel().rows || []
  const selectedUsers = selectedRows.map(row => row.original)

  const deletableUsers = selectedUsers.filter(user => canDeleteUser(user.role))
  const protectedCount = selectedUsers.length - deletableUsers.length

  if (protectedCount > 0) {
    toast.add({
      title: $t('ADMIN.USERS.CANNOT_DELETE_ADMIN'),
      description: $t('ADMIN.USERS.ADMIN_PROTECTED'),
      color: 'error',
    })
  }

  if (deletableUsers.length > 0) {
    usersToDelete.value = deletableUsers
    deleteModalOpen.value = true
  }
}

function handleDeleted() {
  // Clear selection after delete
  if (table.value?.tableApi) {
    table.value.tableApi.resetRowSelection()
  }
}

const { data, status } = await useFetch<User[]>('/api/admin/users', {
  lazy: true,
})

function getRowItems(row: Row<User>) {
  return [
    {
      type: 'label',
      label: $t('COMMON.ACTIONS'),
    },
    {
      label: $t('ADMIN.USERS.COPY_USER_ID'),
      icon: 'i-lucide-copy',
      onSelect() {
        if (row.original._id) {
          navigator.clipboard.writeText(row.original._id)
          toast.add({
            title: $t('ADMIN.USERS.COPIED_TO_CLIPBOARD'),
            description: $t('ADMIN.USERS.USER_ID_COPIED'),
          })
        }
        else {
          toast.add({
            title: $t('ERROR_TITLE'),
            description: $t('ADMIN.USERS.USER_ID_NOT_FOUND'),
            color: 'error',
          })
        }
      },
    },
    {
      type: 'separator',
    },
    {
      label: $t('ADMIN.USERS.VIEW_PROFILE'),
      icon: 'i-lucide-user',
    },
    {
      label: $t('ADMIN.USERS.EDIT_USER'),
      icon: 'i-lucide-pencil',
    },
    {
      type: 'separator',
    },
    {
      label: $t('ADMIN.USERS.DELETE_USER'),
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect() {
        if (!canDeleteUser(row.original.role)) {
          toast.add({
            title: $t('ADMIN.USERS.CANNOT_DELETE_ADMIN'),
            description: $t('ADMIN.USERS.ADMIN_PROTECTED'),
            color: 'error',
          })
          return
        }
        usersToDelete.value = [row.original]
        deleteModalOpen.value = true
      },
    },
  ]
}

const columns: TableColumn<User>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'ariaLabel': 'Select all',
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'ariaLabel': 'Select row',
      }),
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'fullName',
    header: () => $t('COMMON.NAME'),
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: row.original.profilePictureUrl,
          alt: row.original.fullName,
          size: 'lg',
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted' }, row.original.fullName),
          h('p', { class: '' }, `@${row.original.username}`),
        ]),
      ])
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: $t('COMMON.EMAIL'),
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', {}, row.original.email),
        h(UBadge, {
          color: row.original.isEmailVerified ? 'success' : 'neutral',
          variant: 'subtle',
          size: 'xs',
        }, () => row.original.isEmailVerified ? $t('COMMON.VERIFIED') : $t('COMMON.UNVERIFIED')),
      ])
    },
  },
  {
    accessorKey: 'role',
    header: () => $t('COMMON.ROLE'),
    filterFn: 'equals',
    cell: ({ row }) => {
      const roleValue = (row.original.role || 'student') as 'student' | 'teacher' | 'admin' | 'superadmin'
      const color = {
        student: 'neutral' as const,
        teacher: 'primary' as const,
        admin: 'success' as const,
        superadmin: 'warning' as const,
      }[roleValue]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        roleValue)
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
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
            }),
        ),
      )
    },
  },
]

const roleFilter = ref('all')

watch(() => roleFilter.value, (newVal) => {
  if (!table?.value?.tableApi)
    return

  const roleColumn = table.value.tableApi.getColumn('role')
  if (!roleColumn)
    return

  if (newVal === 'all') {
    roleColumn.setFilterValue(undefined)
  }
  else {
    roleColumn.setFilterValue(newVal)
  }
})

const email = computed({
  get: (): string => {
    return (table.value?.tableApi?.getColumn('email')?.getFilterValue() as string) || ''
  },
  set: (value: string) => {
    table.value?.tableApi?.getColumn('email')?.setFilterValue(value || undefined)
  },
})

const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
})
</script>

<template>
  <UDashboardPanel id="users">
    <template #header>
      <UDashboardNavbar :title="$t('ADMIN.NAV.USERS')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <AdminUsersAddModal />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          v-model="email"
          class="max-w-sm"
          icon="i-lucide-search"
          :placeholder="$t('ADMIN.USERS.FILTER_EMAILS')"
        />

        <div class="flex flex-wrap items-center gap-1.5">
          <UButton
            v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
            :label="$t('COMMON.DELETE')"
            color="error"
            variant="subtle"
            icon="i-lucide-trash"
            @click="openDeleteModal"
          >
            <template #trailing>
              <UKbd>
                {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
              </UKbd>
            </template>
          </UButton>

          <USelect
            v-model="roleFilter"
            :items="[
              { label: $t('ROLES.ALL'), value: 'all' },
              { label: $t('ROLES.STUDENT'), value: 'student' },
              { label: $t('ROLES.TEACHER'), value: 'teacher' },
              { label: $t('ROLES.ADMIN'), value: 'admin' },
              { label: $t('ROLES.SUPERADMIN'), value: 'superadmin' },
            ]"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            :placeholder="$t('ROLES.ALL')"
            class="min-w-28"
          />
          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column: any) => column.getCanHide())
                .map((column: any) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  },
                }))
            "
            :content="{ align: 'end' }"
          >
            <UButton
              :label="$t('ADMIN.USERS.DISPLAY')"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-settings-2"
            />
          </UDropdownMenu>
        </div>
      </div>

      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        v-model:pagination="pagination"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel(),
        }"
        class="shrink-0"
        :data="data"
        :columns="columns"
        :loading="status === 'pending'"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default',
          separator: 'h-0',
        }"
      />

      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} {{ $t('COMMON.OF') }}
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} {{ $t('ADMIN.USERS.ROWS_SELECTED') }}
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>

  <AdminUsersDeleteModal
    v-model:open="deleteModalOpen"
    :users="usersToDelete"
    @deleted="handleDeleted"
  />
</template>
