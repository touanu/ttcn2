<script setup lang="ts">
import type { User } from '@shared/types'
import { passwordSchema as basePasswordSchema } from '@shared/schemas/base'
import { z } from 'zod'
import { formatDate } from '~/utils/profile'

definePageMeta({
})

const { $api } = useNuxtApp()
const toast = useToast()
const { locale } = useI18n()
const router = useRouter()

const { data: user } = await useAPI<User>('/api/profile', {
  lazy: true,
  server: false,
})

const passwordSchema = z.object({
  currentPassword: basePasswordSchema,
  newPassword: basePasswordSchema,
  confirmPassword: basePasswordSchema,
}).refine(data => data.newPassword === data.confirmPassword, {
  message: $t('FORMS.PASSWORD.MISMATCH'),
  path: ['confirmPassword'],
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const isChangingPassword = ref(false)
const showDeleteConfirmation = ref(false)
const isDeletingAccount = ref(false)

async function onChangePassword() {
  isChangingPassword.value = true

  await $api('/api/users/change-password', {
    method: 'POST',
    body: {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    },
  })

  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  isChangingPassword.value = false
}

async function onDeleteAccount() {
  isDeletingAccount.value = true

  await new Promise(resolve => setTimeout(resolve, 1000))

  toast.add({
    title: $t('PROFILE.SUCCESS.ACCOUNT_DELETED'),
    color: 'success',
    icon: 'i-heroicons-check-circle',
  })

  router.push('/')
  isDeletingAccount.value = false
  showDeleteConfirmation.value = false
}
</script>

<template>
  <NuxtLayout name="profile">
    <div class="space-y-6">
      <!-- Change Password Card -->
      <UCard>
        <template #header>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ $t('PROFILE.SECURITY.CHANGE_PASSWORD') }}
            </h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ $t('PROFILE.SECURITY.CHANGE_PASSWORD_DESC') }}
            </p>
          </div>
        </template>

        <UForm
          :state="passwordForm"
          :schema="passwordSchema"
          class="space-y-4"
          @submit="onChangePassword"
        >
          <!-- Current Password -->
          <UFormField
            :label="$t('PROFILE.SECURITY.CURRENT_PASSWORD')"
            name="currentPassword"
            required
          >
            <UInput
              v-model="passwordForm.currentPassword"
              type="password"
              :placeholder="$t('PROFILE.SECURITY.CURRENT_PASSWORD_PLACEHOLDER')"
              icon="i-heroicons-lock-closed"
            />
          </UFormField>

          <!-- New Password -->
          <UFormField
            :label="$t('FORMS.PASSWORD.LABEL')"
            name="newPassword"
            :hint="$t('FORMS.PASSWORD.HINT')"
            required
          >
            <UInput
              v-model="passwordForm.newPassword"
              type="password"
              :placeholder="$t('FORMS.PASSWORD.PLACEHOLDER')"
              icon="i-heroicons-key"
            />
          </UFormField>

          <!-- Confirm New Password -->
          <UFormField
            :label="$t('PROFILE.SECURITY.CONFIRM_NEW_PASSWORD')"
            name="confirmPassword"
            required
          >
            <UInput
              v-model="passwordForm.confirmPassword"
              type="password"
              :placeholder="$t('PROFILE.SECURITY.CONFIRM_NEW_PASSWORD_PLACEHOLDER')"
              icon="i-heroicons-key"
            />
          </UFormField>

          <!-- Submit Button -->
          <div class="flex justify-end pt-2">
            <UButton
              type="submit"
              color="primary"
              :loading="isChangingPassword"
            >
              {{ $t('PROFILE.SECURITY.UPDATE_PASSWORD') }}
            </UButton>
          </div>
        </UForm>
      </UCard>

      <!-- Security Settings Card -->
      <UCard>
        <template #header>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ $t('PROFILE.SECURITY.SECURITY_SETTINGS') }}
            </h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ $t('PROFILE.SECURITY.SECURITY_SETTINGS_DESC') }}
            </p>
          </div>
        </template>

        <div class="space-y-4">
          <!-- Email Verification Status -->
          <div class="flex items-center justify-between py-3">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-blue-50 p-2 dark:bg-blue-500/10">
                <UIcon name="i-heroicons-envelope" class="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ $t('PROFILE.SECURITY.EMAIL_VERIFICATION') }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  {{ user?.isEmailVerified ? $t('PROFILE.SECURITY.EMAIL_VERIFIED') : $t('PROFILE.SECURITY.EMAIL_NOT_VERIFIED') }}
                </p>
              </div>
            </div>
            <UBadge
              :color="user?.isEmailVerified ? 'success' : 'warning'"
              variant="subtle"
            >
              {{ user?.isEmailVerified ? $t('PROFILE.VERIFIED') : $t('PROFILE.NOT_VERIFIED') }}
            </UBadge>
          </div>

          <!-- Account Created -->
          <div class="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-800">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-purple-50 p-2 dark:bg-purple-500/10">
                <UIcon name="i-heroicons-calendar" class="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ $t('PROFILE.SECURITY.ACCOUNT_CREATED') }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  {{ formatDate(user?.createdAt, locale) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Last Updated -->
          <div class="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-800">
            <div class="flex items-center gap-3">
              <div class="rounded-lg bg-green-50 p-2 dark:bg-green-500/10">
                <UIcon name="i-heroicons-clock" class="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ $t('PROFILE.SECURITY.LAST_UPDATED') }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  {{ formatDate(user?.updatedAt, locale) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Danger Zone Card -->
      <UCard>
        <template #header>
          <div>
            <h3 class="text-lg font-semibold text-red-600 dark:text-red-400">
              {{ $t('PROFILE.SECURITY.DANGER_ZONE') }}
            </h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ $t('PROFILE.SECURITY.DANGER_ZONE_DESC') }}
            </p>
          </div>
        </template>

        <div class="space-y-4">
          <!-- Delete Account -->
          <div class="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
            <div>
              <p class="text-sm font-medium text-red-900 dark:text-red-200">
                {{ $t('PROFILE.SECURITY.DELETE_ACCOUNT') }}
              </p>
              <p class="mt-1 text-xs text-red-700 dark:text-red-400">
                {{ $t('PROFILE.SECURITY.DELETE_ACCOUNT_DESC') }}
              </p>
            </div>
            <!-- Delete Confirmation Modal -->
            <UModal v-model="showDeleteConfirmation" title="{{ $t('PROFILE.SECURITY.DELETE_ACCOUNT_BTN') }}">
              <UButton
                color="error"
                variant="soft"
                @click="showDeleteConfirmation = true"
              >
                {{ $t('PROFILE.SECURITY.DELETE_ACCOUNT_BTN') }}
              </UButton>

              <template #content>
                <UCard>
                  <template #header>
                    <div class="flex items-center gap-3">
                      <UIcon name="i-heroicons-exclamation-triangle" class="h-6 w-6 text-red-500" />
                      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {{ $t('PROFILE.SECURITY.DELETE_CONFIRMATION_TITLE') }}
                      </h3>
                    </div>
                  </template>

                  <div class="space-y-4">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ $t('PROFILE.SECURITY.DELETE_CONFIRMATION_DESC') }}
                    </p>

                    <div class="rounded-lg bg-red-50 p-4 dark:bg-red-950/20">
                      <p class="text-sm font-medium text-red-900 dark:text-red-200">
                        {{ $t('PROFILE.SECURITY.DELETE_WARNING') }}
                      </p>
                    </div>
                  </div>

                  <template #footer>
                    <div class="flex items-center justify-end gap-2">
                      <UButton
                        color="neutral"
                        variant="ghost"
                        @click="showDeleteConfirmation = false"
                      >
                        {{ $t('COMMON.CANCEL') }}
                      </UButton>
                      <UButton
                        color="error"
                        :loading="isDeletingAccount"
                        @click="onDeleteAccount"
                      >
                        {{ $t('PROFILE.SECURITY.CONFIRM_DELETE') }}
                      </UButton>
                    </div>
                  </template>
                </UCard>
              </template>
            </UModal>
          </div>
        </div>
      </UCard>
    </div>
  </NuxtLayout>
</template>
