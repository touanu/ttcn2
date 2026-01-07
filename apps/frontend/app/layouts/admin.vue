<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const navigation = [
  {
    label: t('ADMIN.NAV.DASHBOARD'),
    icon: 'i-heroicons-home',
    to: '/admin',
  },
  {
    label: t('ADMIN.NAV.USERS'),
    icon: 'i-heroicons-users',
    to: '/admin/users',
  },
  {
    label: t('ADMIN.NAV.COURSES'),
    icon: 'i-heroicons-academic-cap',
    to: '/admin/courses',
  },
  {
    label: t('ADMIN.NAV.CONTENT'),
    icon: 'i-heroicons-document-text',
    to: '/admin/content',
  },
  {
    label: t('ADMIN.NAV.SETTINGS'),
    icon: 'i-heroicons-cog-6-tooth',
    to: '/admin/settings',
  },
]
</script>

<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div class="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ $t('ADMIN.TITLE') }}
        </h1>
      </div>
      <nav class="space-y-1 p-4">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="[
            route.path === item.to
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
          ]"
        >
          <UIcon :name="item.icon" class="h-5 w-5" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Header -->
      <header class="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950">
        <div class="flex items-center gap-4">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-bars-3"
            class="lg:hidden"
          />
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ $t(`ADMIN.${route.path.split('/').pop()?.toUpperCase() || 'DASHBOARD'}`) }}
            </h2>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-bell"
            trailing
          />
          <UButton
            color="neutral"
            to="/"
            icon="i-heroicons-arrow-left"
          >
            {{ $t('ADMIN.BACK_TO_SITE') }}
          </UButton>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
