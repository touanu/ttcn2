<script setup lang="ts">
import type { User } from '@shared/types'
import { updateUserSchema } from '@shared/schemas/user'

definePageMeta({
})

const { $api } = useNuxtApp()
const toast = useToast()
const { setLocale, locale } = useI18n()

// Fetch current user data
const { data: user, pending, error } = await useAPI<User>('/api/profile')

// Form state
const formState = reactive({
  username: '',
  email: '',
  fullName: '',
  profilePictureUrl: '',
})

const isSubmitting = ref(false)

// Initialize form with user data
watch(user, (newUser) => {
  if (newUser) {
    formState.username = newUser.username
    formState.email = newUser.email
    formState.fullName = newUser.fullName
    formState.profilePictureUrl = newUser.profilePictureUrl || ''
  }
}, { immediate: true })

// Track if form has changes
const hasChanges = computed(() => {
  if (!user.value)
    return false
  return (
    formState.username !== user.value.username
    || formState.email !== user.value.email
    || formState.fullName !== user.value.fullName
    || formState.profilePictureUrl !== (user.value.profilePictureUrl || '')
  )
})

// Reset form to original values
function resetForm() {
  if (user.value) {
    formState.username = user.value.username
    formState.email = user.value.email
    formState.fullName = user.value.fullName
    formState.profilePictureUrl = user.value.profilePictureUrl || ''
  }
}

// Submit form
async function onSubmit() {
  isSubmitting.value = true

  const updatedUser = await $api<User>('/api/profile', {
    method: 'PATCH',
    body: formState,
  })

  // Update the user data
  user.value = updatedUser

  toast.add({
    title: $t('PROFILE.SUCCESS.UPDATED'),
    color: 'success',
    icon: 'i-heroicons-check-circle',
  })

  isSubmitting.value = false
}

// Request email verification
async function requestVerifyEmail() {
  await $api('/api/users/request-verify-email', {
    method: 'POST',
    body: { email: formState.email },
  })

  toast.add({
    title: $t('PROFILE.SUCCESS.VERIFICATION_SENT'),
    description: $t('PROFILE.SUCCESS.VERIFICATION_SENT_DESC'),
    color: 'success',
    icon: 'i-heroicons-envelope',
  })
}
</script>

<template>
  <NuxtLayout name="profile">
    <!-- Loading State -->
    <UCard v-if="pending">
      <CommonLoading size="lg" :message="$t('COMMON.LOADING')" />
    </UCard>

    <!-- Error State -->
    <UCard v-else-if="error">
      <div class="flex flex-col items-center justify-center py-16">
        <div class="rounded-full bg-red-100 p-3 dark:bg-red-950/30">
          <UIcon name="i-heroicons-exclamation-triangle" class="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('PROFILE.ERROR.FETCH_FAILED') }}
        </h3>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ error.message }}
        </p>
      </div>
    </UCard>

    <!-- Settings Form -->
    <UCard v-else>
      <template #header>
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ $t('PROFILE.SETTINGS.TITLE') }}
            </h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ $t('PROFILE.SETTINGS.SUBTITLE') }}
            </p>
          </div>
          <UBadge
            v-if="hasChanges"
            color="warning"
            variant="subtle"
          >
            {{ $t('COMMON.UNSAVED_CHANGES') }}
          </UBadge>
        </div>
      </template>

      <UForm
        :state="formState"
        :schema="updateUserSchema"
        class="space-y-8"
        @submit="onSubmit"
      >
        <!-- Profile Picture Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-photo" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h4 class="text-base font-medium text-gray-900 dark:text-white">
              {{ $t('PROFILE.SETTINGS.PROFILE_PICTURE') }}
            </h4>
          </div>

          <UFormField
            name="profilePictureUrl"
            :hint="$t('PROFILE.SETTINGS.PROFILE_PICTURE_HINT')"
            class="pl-7"
          >
            <div class="flex items-start gap-6">
              <UAvatar
                :src="formState.profilePictureUrl"
                :alt="formState.fullName"
                size="2xl"
                class="ring-4 ring-gray-100 dark:ring-gray-800"
              />
              <div class="flex-1 space-y-2">
                <UInput
                  v-model="formState.profilePictureUrl"
                  :placeholder="$t('PROFILE.SETTINGS.PROFILE_PICTURE_URL')"
                  size="lg"
                >
                  <template #leading>
                    <UIcon name="i-heroicons-link" class="h-5 w-5" />
                  </template>
                </UInput>
              </div>
            </div>
          </UFormField>
        </div>

        <USeparator />

        <!-- Personal Information Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-user" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h4 class="text-base font-medium text-gray-900 dark:text-white">
              {{ $t('PROFILE.SETTINGS.PERSONAL_INFO') }}
            </h4>
          </div>

          <div class="grid gap-6 pl-7 sm:grid-cols-2">
            <!-- Full Name -->
            <UFormField
              :label="$t('FORMS.FULLNAME.LABEL')"
              name="fullName"
              required
            >
              <UInput
                v-model="formState.fullName"
                type="text"
                :placeholder="$t('FORMS.FULLNAME.PLACEHOLDER')"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-heroicons-user-circle" class="h-5 w-5" />
                </template>
              </UInput>
            </UFormField>

            <!-- Username -->
            <UFormField
              :label="$t('FORMS.USERNAME.LABEL')"
              name="username"
              required
            >
              <UInput
                v-model="formState.username"
                type="text"
                :placeholder="$t('FORMS.USERNAME.PLACEHOLDER')"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-heroicons-at-symbol" class="h-5 w-5" />
                </template>
              </UInput>
            </UFormField>
          </div>
        </div>

        <USeparator />

        <!-- Localization Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-language" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h4 class="text-base font-medium text-gray-900 dark:text-white">
              {{ $t('SETTINGS.LOCALIZATION') }}
            </h4>
          </div>

          <div class="pl-7">
            <UFormField
              :label="$t('SETTINGS.LANGUAGE')"
              :description="$t('SETTINGS.LANGUAGE_DESC')"
            >
              <USelectMenu
                :model-value="{ value: locale, label: locale === 'vi' ? 'Tiếng Việt' : 'English', icon: locale === 'vi' ? 'i-circle-flags-vn' : 'i-circle-flags-us' }"
                :items="[{
                  value: 'vi',
                  label: 'Tiếng Việt',
                  icon: 'i-circle-flags-vn',
                }, {
                  value: 'en',
                  label: 'English',
                  icon: 'i-circle-flags-us',
                }]"
                value-attribute="value"
                size="lg"
                @update:model-value="(item) => setLocale(item.value as 'vi' | 'en')"
              >
                <template #leading>
                  <UIcon :name="locale === 'vi' ? 'i-circle-flags-vn' : 'i-circle-flags-us'" class="h-5 w-5" />
                </template>
              </USelectMenu>
            </UFormField>
          </div>
        </div>

        <USeparator />

        <!-- Contact Information Section -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-envelope" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h4 class="text-base font-medium text-gray-900 dark:text-white">
              {{ $t('PROFILE.SETTINGS.CONTACT_INFO') }}
            </h4>
          </div>

          <div class="pl-7">
            <!-- Email -->
            <UFormField
              :label="$t('FORMS.EMAIL.LABEL')"
              name="email"
              required
            >
              <UInput
                v-model="formState.email"
                type="email"
                :placeholder="$t('FORMS.EMAIL.PLACEHOLDER')"
                size="lg"
              >
                <template #leading>
                  <UIcon name="i-heroicons-envelope" class="h-5 w-5" />
                </template>
                <template v-if="user && !user.isEmailVerified" #trailing>
                  <UBadge color="warning" variant="subtle" size="xs">
                    {{ $t('PROFILE.NOT_VERIFIED') }}
                  </UBadge>
                </template>
              </UInput>

              <div v-if="user && !user.isEmailVerified" class="mt-2 flex items-center gap-2 rounded-lg bg-warning-50 p-3 dark:bg-warning-950/30">
                <UIcon name="i-heroicons-exclamation-triangle" class="h-4 w-4 text-warning-600 dark:text-warning-400" />
                <span class="flex-1 text-xs text-warning-700 dark:text-warning-300">
                  {{ $t('PROFILE.EMAIL_NOT_VERIFIED') }}
                </span>
                <UButton
                  size="xs"
                  color="warning"
                  variant="soft"
                  @click="requestVerifyEmail"
                >
                  {{ $t('PROFILE.ACTIONS.VERIFY_EMAIL') }}
                </UButton>
              </div>
            </UFormField>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
          <UButton
            color="neutral"
            variant="ghost"
            type="button"
            size="lg"
            :disabled="!hasChanges"
            @click="resetForm"
          >
            <template #leading>
              <UIcon name="i-heroicons-arrow-uturn-left" />
            </template>
            {{ $t('COMMON.CANCEL') }}
          </UButton>

          <UButton
            type="submit"
            color="primary"
            size="lg"
            :loading="isSubmitting"
            :disabled="!hasChanges"
          >
            <template #leading>
              <UIcon name="i-heroicons-check" />
            </template>
            {{ $t('COMMON.SAVE_CHANGES') }}
          </UButton>
        </div>
      </UForm>
    </UCard>
  </NuxtLayout>
</template>
