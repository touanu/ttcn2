<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  title: 'Profile',
})

const navigationLinks = computed(() => [
  {
    label: t('PROFILE.NAV.OVERVIEW'),
    to: '/profile',
    icon: 'i-heroicons-user-circle',
    exact: true,
  },
  {
    label: t('PROFILE.NAV.SETTINGS'),
    to: '/profile/settings',
    icon: 'i-heroicons-cog-6-tooth',
  },
  {
    label: t('PROFILE.NAV.SECURITY'),
    to: '/profile/security',
    icon: 'i-heroicons-shield-check',
  },
])
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-teal-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold text-gray-900 dark:text-white">
          {{ $t('PROFILE.TITLE') }}
        </h1>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {{ $t('PROFILE.SUBTITLE') }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <!-- Sidebar Navigation -->
        <aside class="lg:col-span-3">
          <UCard class="sticky top-8">
            <UNavigationMenu
              :items="navigationLinks"
              orientation="vertical"
            />
          </UCard>
        </aside>

        <!-- Main Content -->
        <main class="lg:col-span-9">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
