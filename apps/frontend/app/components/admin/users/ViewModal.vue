<script setup lang="ts">
import type { User } from '@shared/types'

const props = defineProps<{
  user: User | null
}>()

const emit = defineEmits<{
  edit: [user: User]
  delete: [user: User]
}>()
const open = defineModel<boolean>('open', { required: true })
const { canDeleteUser } = useUserAbilities()

const roleColor = computed(() => {
  const role = props.user?.role || 'student'
  return {
    student: 'neutral' as const,
    teacher: 'primary' as const,
    admin: 'success' as const,
    superadmin: 'warning' as const,
  }[role]
})

const roleLabel = computed(() => {
  const role = props.user?.role || 'student'
  return {
    student: $t('ROLES.STUDENT'),
    teacher: $t('ROLES.TEACHER'),
    admin: $t('ROLES.ADMIN'),
    superadmin: $t('ROLES.SUPERADMIN'),
  }[role]
})

function formatDate(date?: Date | string) {
  if (!date)
    return $t('COMMON.NOT_AVAILABLE')
  return new Date(date).toLocaleString()
}

function handleEdit() {
  if (props.user) {
    open.value = false
    emit('edit', props.user)
  }
}

function handleDelete() {
  if (props.user) {
    emit('delete', props.user)
  }
}

const canDelete = computed(() => {
  return props.user ? canDeleteUser(props.user.role) : false
})
</script>

<template>
  <UModal v-model:open="open" :title="$t('ADMIN.USERS.VIEW_PROFILE')" :ui="{ wrapper: 'max-w-2xl' }">
    <template #body>
      <div v-if="user" class="space-y-6">
        <!-- User Avatar and Basic Info -->
        <div class="flex items-center gap-4 pb-4 border-b border-default">
          <UAvatar
            :src="user.profilePictureUrl"
            :alt="user.fullName"
            size="2xl"
          />
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-highlighted">
              {{ user.fullName }}
            </h3>
            <p class="text-sm text-muted">
              @{{ user.username }}
            </p>
            <div class="flex items-center gap-2 mt-2">
              <UBadge :color="roleColor" variant="subtle" size="sm">
                {{ roleLabel }}
              </UBadge>
              <UBadge
                v-if="user.isEmailVerified"
                color="success"
                variant="subtle"
                size="sm"
              >
                {{ $t('COMMON.VERIFIED') }}
              </UBadge>
            </div>
          </div>
        </div>

        <!-- User Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-muted">
              {{ $t('COMMON.EMAIL') }}
            </label>
            <p class="mt-1 text-sm text-highlighted">
              {{ user.email }}
            </p>
          </div>

          <div>
            <label class="text-sm font-medium text-muted">
              {{ $t('COMMON.USERNAME') }}
            </label>
            <p class="mt-1 text-sm text-highlighted">
              {{ user.username }}
            </p>
          </div>

          <div>
            <label class="text-sm font-medium text-muted">
              {{ $t('COMMON.ROLE') }}
            </label>
            <p class="mt-1">
              <UBadge :color="roleColor" variant="subtle">
                {{ roleLabel }}
              </UBadge>
            </p>
          </div>

          <div>
            <label class="text-sm font-medium text-muted">
              {{ $t('COMMON.EMAIL_VERIFIED') }}
            </label>
            <p class="mt-1">
              <UBadge
                :color="user.isEmailVerified ? 'success' : 'neutral'"
                variant="subtle"
              >
                {{ user.isEmailVerified ? $t('COMMON.YES') : $t('COMMON.NO') }}
              </UBadge>
            </p>
          </div>

          <div>
            <label class="text-sm font-medium text-muted">
              {{ $t('COMMON.CREATED_AT') }}
            </label>
            <p class="mt-1 text-sm text-highlighted">
              {{ formatDate(user.createdAt) }}
            </p>
          </div>

          <div class="">
            <label class="text-sm font-medium text-muted">
              {{ $t('COMMON.UPDATED_AT') }}
            </label>
            <p class="mt-1 text-sm text-highlighted">
              {{ formatDate(user.updatedAt) }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between items-center w-full">
        <UButton
          :label="$t('COMMON.CLOSE')"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />

        <div class="flex justify-between gap-2">
          <div class="flex gap-2">
            <UButton
              v-if="canDelete"
              :label="$t('COMMON.DELETE')"
              color="error"
              variant="subtle"
              icon="i-lucide-trash"
              @click="handleDelete"
            />
          </div>
          <div class="flex gap-2">
            <UButton
              :label="$t('COMMON.EDIT')"
              color="primary"
              variant="outline"
              icon="i-lucide-pencil"
              @click="handleEdit"
            />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
