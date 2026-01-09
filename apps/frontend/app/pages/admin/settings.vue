<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const sections = [
  {
    title: 'ADMIN.SETTINGS.GENERAL',
    description: 'ADMIN.SETTINGS.GENERAL_DESC',
    icon: 'i-heroicons-cog-6-tooth',
  },
  {
    title: 'ADMIN.SETTINGS.AUTHENTICATION',
    description: 'ADMIN.SETTINGS.AUTH_DESC',
    icon: 'i-heroicons-lock-closed',
  },
  {
    title: 'ADMIN.SETTINGS.EMAIL',
    description: 'ADMIN.SETTINGS.EMAIL_DESC',
    icon: 'i-heroicons-envelope',
  },
  {
    title: 'ADMIN.SETTINGS.STORAGE',
    description: 'ADMIN.SETTINGS.STORAGE_DESC',
    icon: 'i-heroicons-server',
  },
]
</script>

<template>
  <UDashboardPanel id="admin-settings">
    <template #header>
      <UDashboardNavbar :title="$t('ADMIN.NAV.SETTINGS')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <p class="text-sm text-muted">
            {{ $t('ADMIN.SETTINGS.SUBTITLE') }}
          </p>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 sm:gap-6">
        <UPageCard
          v-for="(section, index) in sections"
          :key="index"
          variant="subtle"
          class="cursor-pointer hover:bg-elevated/50 transition-colors"
        >
          <div class="flex items-start gap-4">
            <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 shrink-0">
              <UIcon :name="section.icon" class="w-6 h-6 text-primary" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-highlighted mb-1">
                {{ $t(section.title) }}
              </h3>
              <p class="text-sm text-muted">
                {{ $t(section.description) }}
              </p>
            </div>
          </div>
        </UPageCard>
      </div>

      <!-- Danger Zone -->
      <UPageCard
        class="mt-8"
        variant="subtle"
      >
        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold text-error mb-1">
              {{ $t('ADMIN.SETTINGS.DANGER_ZONE') }}
            </h3>
            <p class="text-sm text-muted">
              {{ $t('ADMIN.SETTINGS.DANGER_DESC') }}
            </p>
          </div>

          <USeparator />

          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium text-highlighted">
                {{ $t('ADMIN.SETTINGS.CLEAR_CACHE') }}
              </h4>
              <p class="text-sm text-muted">
                {{ $t('ADMIN.SETTINGS.CLEAR_CACHE_DESC') }}
              </p>
            </div>
            <UButton
              :label="$t('ADMIN.SETTINGS.CLEAR')"
              color="error"
              variant="outline"
            />
          </div>

          <USeparator />

          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium text-highlighted">
                {{ $t('ADMIN.SETTINGS.RESET_DATABASE') }}
              </h4>
              <p class="text-sm text-muted">
                {{ $t('ADMIN.SETTINGS.RESET_DATABASE_DESC') }}
              </p>
            </div>
            <UButton
              :label="$t('ADMIN.SETTINGS.RESET')"
              color="error"
              variant="solid"
            />
          </div>
        </div>
      </UPageCard>
    </template>
  </UDashboardPanel>
</template>
