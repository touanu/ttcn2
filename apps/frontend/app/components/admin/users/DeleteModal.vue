<script setup lang="ts">
import type { User } from '@shared/types'

const props = defineProps<{
  users: User[]
}>()

const emit = defineEmits<{
  deleted: []
}>()

const { $api } = useNuxtApp()
const open = defineModel<boolean>('open', { default: false })
const toast = useToast()
const isDeleting = ref(false)

async function onDelete() {
  if (props.users.length === 0)
    return

  isDeleting.value = true

  const userIds = props.users.map(u => u._id).filter(Boolean)

  if (userIds.length === 0) {
    toast.add({
      title: $t('ERRORS.TITLE'),
      description: $t('ADMIN.USERS.NO_USERS_SELECTED'),
      color: 'error',
    })
    return
  }

  // Delete users one by one or in batch
  const deletePromises = userIds.map(id =>
    $api(`/api/admin/users/${id}`, {
      method: 'DELETE',
    }),
  )

  await Promise.all(deletePromises)

  toast.add({
    title: $t('COMMON.SUCCESS'),
    description: $t('ADMIN.USERS.USERS_DELETED_SUCCESS', { count: userIds.length }),
    color: 'success',
  })

  open.value = false
  emit('deleted')

  // Refresh the users list
  await refreshNuxtData()

  isDeleting.value = false
}
</script>

<template>
  <UModal v-model:open="open" :title="$t('ADMIN.USERS.DELETE_MODAL_TITLE')" prevent-close>
    <template #body>
      <div class="space-y-4">
        <p class="text-muted">
          {{ $t('ADMIN.USERS.DELETE_CONFIRMATION', { count: users.length }) }}
        </p>

        <div v-if="users.length > 0" class="rounded-lg border border-default p-3 space-y-2">
          <div v-for="user in users.slice(0, 5)" :key="user._id" class="flex items-center gap-2">
            <UAvatar :src="user.profilePictureUrl" :alt="user.fullName" size="sm" />
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm truncate">
                {{ user.fullName }}
              </p>
              <p class="text-xs text-muted truncate">
                {{ user.email }}
              </p>
            </div>
          </div>
          <p v-if="users.length > 5" class="text-xs text-muted text-center pt-2">
            {{ $t('ADMIN.USERS.AND_MORE', { count: users.length - 5 }) }}
          </p>
        </div>

        <div class="p-3 bg-error/10 border border-error/20 rounded-lg">
          <p class="text-sm text-error font-medium">
            {{ $t('ADMIN.USERS.DELETE_WARNING') }}
          </p>
        </div>

        <div class="flex justify-end gap-2">
          <UButton
            :label="$t('COMMON.CANCEL')"
            color="neutral"
            variant="subtle"
            :disabled="isDeleting"
            @click="open = false"
          />
          <UButton
            :label="$t('COMMON.DELETE')"
            color="error"
            variant="solid"
            icon="i-lucide-trash"
            :loading="isDeleting"
            @click="onDelete"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
