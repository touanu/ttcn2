<script setup lang="ts">
definePageMeta({
  title: 'Settings',
})
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-16">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ $t('NAVIGATION.USER.DROPDOWN.SETTINGS') }}
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ $t('SETTINGS.SUBTITLE') }}
      </p>
    </div>

    <div class="space-y-6">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('SETTINGS.APPEARANCE') }}
          </h3>
        </template>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ $t('SETTINGS.THEME') }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('SETTINGS.THEME_DESC') }}
              </p>
            </div>
            <UButton color="neutral" variant="soft">
              Auto
            </UButton>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('SETTINGS.NOTIFICATIONS') }}
          </h3>
        </template>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ $t('SETTINGS.EMAIL_NOTIFICATIONS') }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('SETTINGS.EMAIL_NOTIFICATIONS_DESC') }}
              </p>
            </div>
            <UToggle />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
