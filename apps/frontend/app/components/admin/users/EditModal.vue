<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { User } from '@shared/types'
import { updateUserSchema } from '@shared/schemas'

const props = defineProps<{
  user: User | null
}>()

const emit = defineEmits<{
  updated: []
}>()

const { $api } = useNuxtApp()
const open = defineModel<boolean>('open', { required: true })
const { canManageUserRole } = useUserAbilities()
const toast = useToast()
const validateForm = createFormValidator(updateUserSchema)

const state = reactive<Partial<User>>({
  fullName: '',
  username: '',
  email: '',
  role: 'student',
})

watch(() => props.user, (newUser) => {
  if (newUser) {
    state.fullName = newUser.fullName
    state.username = newUser.username
    state.email = newUser.email
    state.role = newUser.role || 'student'
  }
}, { immediate: true })

async function onSubmit(event: FormSubmitEvent<Partial<User>>) {
  if (!props.user?._id)
    return

  await $api(`/api/admin/users/${props.user._id}`, {
    method: 'PATCH',
    body: event.data,
  })

  toast.add({
    title: $t('COMMON.SUCCESS'),
    description: $t('ADMIN.USERS.USER_UPDATED', { name: event.data.fullName }),
    color: 'success',
  })

  open.value = false
  emit('updated')

  // Refresh the users list
  await refreshNuxtData()
}

const canChangeRole = computed(() => {
  return canManageUserRole(props.user?.role)
})
</script>

<template>
  <UModal v-model:open="open" :title="$t('ADMIN.USERS.EDIT_USER')" :ui="{ wrapper: 'max-w-2xl' }">
    <template #body>
      <UForm
        v-if="user"
        :schema="updateUserSchema"
        :validate="validateForm"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div class="flex items-center gap-4 pb-4 border-b border-default">
          <UAvatar
            :src="user.profilePictureUrl"
            :alt="user.fullName"
            size="xl"
          />
          <div>
            <h4 class="font-medium text-highlighted">
              {{ user.fullName }}
            </h4>
            <p class="text-sm text-muted">
              @{{ user.username }}
            </p>
          </div>
        </div>

        <UFormField :label="$t('COMMON.FULL_NAME')" name="fullName" required>
          <UInput v-model="state.fullName" class="w-full" />
        </UFormField>

        <UFormField :label="$t('COMMON.USERNAME')" name="username" required>
          <UInput v-model="state.username" class="w-full" />
        </UFormField>

        <UFormField :label="$t('COMMON.EMAIL')" name="email" required>
          <UInput v-model="state.email" type="email" class="w-full" />
        </UFormField>

        <UFormField
          :label="$t('COMMON.ROLE')"
          name="role"
          :hint="!canChangeRole ? $t('ADMIN.USERS.CANNOT_CHANGE_ROLE') : undefined"
        >
          <USelect
            v-model="state.role"
            :items="[
              { label: $t('ROLES.STUDENT'), value: 'student' },
              { label: $t('ROLES.TEACHER'), value: 'teacher' },
              { label: $t('ROLES.ADMIN'), value: 'admin' },
              { label: $t('ROLES.SUPERADMIN'), value: 'superadmin' },
            ]"
            :disabled="!canChangeRole"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end gap-2 pt-4">
          <UButton
            :label="$t('COMMON.CANCEL')"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            type="submit"
            :label="$t('COMMON.SAVE')"
            color="primary"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
