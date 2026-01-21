<script setup lang="ts">
import type { User } from '@shared/types'
import { formatDate, getRoleColor } from '~/utils/profile'

definePageMeta({
  title: 'Profile',
})

const { locale } = useI18n()
const { data: user, pending, error, refresh } = await useAPI<User>('/api/profile', { server: false })

const formattedCreatedAt = computed(() => formatDate(user.value?.createdAt, locale.value))
const formattedUpdatedAt = computed(() => formatDate(user.value?.updatedAt, locale.value))
</script>

<template>
  <NuxtLayout name="profile">
    <AppLoading v-if="pending" />

    <AppError
      v-else-if="error"
      :message="error.message"
      :retry="() => refresh()"
    />

    <div v-else-if="user" class="space-y-6">
      <!-- Profile Header Card -->
      <UCard>
        <div class="flex flex-col items-center gap-6 sm:flex-row">
          <!-- Avatar -->
          <UAvatar
            :src="user.profilePictureUrl"
            :alt="user.fullName"
            size="3xl"
            class="ring-4 ring-white dark:ring-gray-800"
          />

          <!-- User Info -->
          <div class="flex-1 text-center sm:text-left">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ user.fullName }}
            </h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              @{{ user.username }}
            </p>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ user.email }}
            </p>
            <div class="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <UBadge
                v-if="user.role"
                :color="getRoleColor(user.role)"
                variant="subtle"
                size="md"
              >
                {{ $t(`ROLES.${user.role.toUpperCase()}`) }}
              </UBadge>
              <UBadge
                v-if="!user.isEmailVerified"
                color="warning"
                variant="subtle"
                size="md"
              >
                {{ $t('PROFILE.EMAIL_NOT_VERIFIED') }}
              </UBadge>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <UButton
              color="neutral"
              variant="soft"
              to="/profile/settings"
            >
              {{ $t('PROFILE.ACTIONS.EDIT_PROFILE') }}
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Account Information -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('PROFILE.ACCOUNT_INFO.TITLE') }}
          </h3>
        </template>

        <dl class="divide-y divide-gray-200 dark:divide-gray-800">
          <div class="grid grid-cols-1 gap-4 py-4 sm:grid-cols-3">
            <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ $t('PROFILE.ACCOUNT_INFO.MEMBER_SINCE') }}
            </dt>
            <dd class="text-sm text-gray-900 dark:text-white sm:col-span-2">
              {{ formattedCreatedAt }}
            </dd>
          </div>

          <div class="grid grid-cols-1 gap-4 py-4 sm:grid-cols-3">
            <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ $t('PROFILE.ACCOUNT_INFO.LAST_UPDATED') }}
            </dt>
            <dd class="text-sm text-gray-900 dark:text-white sm:col-span-2">
              {{ formattedUpdatedAt }}
            </dd>
          </div>

          <div class="grid grid-cols-1 gap-4 py-4 sm:grid-cols-3">
            <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">
              {{ $t('PROFILE.ACCOUNT_INFO.EMAIL_STATUS') }}
            </dt>
            <dd class="text-sm sm:col-span-2">
              <UBadge
                :color="user.isEmailVerified ? 'success' : 'warning'"
                variant="subtle"
              >
                {{ user.isEmailVerified ? $t('PROFILE.VERIFIED') : $t('PROFILE.NOT_VERIFIED') }}
              </UBadge>
            </dd>
          </div>
        </dl>
      </UCard>
    </div>
  </NuxtLayout>
</template>
