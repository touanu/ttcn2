<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <UDashboardPanel id="admin-content">
    <template #header>
      <UDashboardNavbar :title="$t('ADMIN.NAV.CONTENT')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <p class="text-sm text-muted">
            {{ $t('ADMIN.CONTENT.SUBTITLE') }}
          </p>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        <!-- Lessons Card -->
        <UPageCard
          variant="subtle"
          class="cursor-pointer hover:bg-elevated/50 transition-colors"
        >
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <UIcon name="i-heroicons-book-open" class="w-6 h-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-highlighted mb-1">
                {{ $t('ADMIN.CONTENT.LESSONS') }}
              </h3>
              <p class="text-sm text-muted">
                {{ $t('ADMIN.CONTENT.LESSONS_DESC') }}
              </p>
            </div>
          </div>
        </UPageCard>

        <!-- Quizzes Card -->
        <UPageCard
          variant="subtle"
          class="cursor-pointer hover:bg-elevated/50 transition-colors"
        >
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-success/10">
                <UIcon name="i-heroicons-clipboard-document-check" class="w-6 h-6 text-success" />
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-highlighted mb-1">
                {{ $t('ADMIN.CONTENT.QUIZZES') }}
              </h3>
              <p class="text-sm text-muted">
                {{ $t('ADMIN.CONTENT.QUIZZES_DESC') }}
              </p>
            </div>
          </div>
        </UPageCard>

        <!-- Videos Card -->
        <UPageCard
          variant="subtle"
          class="cursor-pointer hover:bg-elevated/50 transition-colors"
        >
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-warning/10">
                <UIcon name="i-heroicons-video-camera" class="w-6 h-6 text-warning" />
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-highlighted mb-1">
                {{ $t('ADMIN.CONTENT.VIDEOS') }}
              </h3>
              <p class="text-sm text-muted">
                {{ $t('ADMIN.CONTENT.VIDEOS_DESC') }}
              </p>
            </div>
          </div>
        </UPageCard>

        <!-- Materials Card -->
        <UPageCard
          variant="subtle"
          class="cursor-pointer hover:bg-elevated/50 transition-colors"
        >
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-error/10">
                <UIcon name="i-heroicons-document" class="w-6 h-6 text-error" />
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-highlighted mb-1">
                {{ $t('ADMIN.CONTENT.MATERIALS') }}
              </h3>
              <p class="text-sm text-muted">
                {{ $t('ADMIN.CONTENT.MATERIALS_DESC') }}
              </p>
            </div>
          </div>
        </UPageCard>
      </div>

      <!-- Recent Activity -->
      <UPageCard
        class="mt-6"
        :title="$t('ADMIN.CONTENT.RECENT_ACTIVITY')"
        variant="subtle"
        :ui="{ header: 'pb-4 mb-0 border-b border-default' }"
      >
        <div class="divide-y divide-default">
          <div class="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <UIcon name="i-heroicons-book-open" class="w-5 h-5 text-primary" />
              </div>
              <div>
                <p class="font-medium text-highlighted">
                  {{ $t('ADMIN.CONTENT.LESSON') }} "Introduction to Grammar"
                </p>
                <p class="text-sm text-muted">
                  {{ $t('ADMIN.CONTENT.ACTIVITY_CREATED') }}
                </p>
              </div>
            </div>
            <p class="text-sm text-muted">
              2h ago
            </p>
          </div>

          <div class="flex items-center justify-between py-3">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-success/10">
                <UIcon name="i-heroicons-clipboard-document-check" class="w-5 h-5 text-success" />
              </div>
              <div>
                <p class="font-medium text-highlighted">
                  Quiz "Vocabulary Test 1"
                </p>
                <p class="text-sm text-muted">
                  {{ $t('ADMIN.CONTENT.ACTIVITY_CREATED') }}
                </p>
              </div>
            </div>
            <p class="text-sm text-muted">
              5h ago
            </p>
          </div>

          <div class="flex items-center justify-between py-3">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/10">
                <UIcon name="i-heroicons-video-camera" class="w-5 h-5 text-warning" />
              </div>
              <div>
                <p class="font-medium text-highlighted">
                  Video "Pronunciation Guide"
                </p>
                <p class="text-sm text-muted">
                  {{ $t('ADMIN.CONTENT.ACTIVITY_CREATED') }}
                </p>
              </div>
            </div>
            <p class="text-sm text-muted">
              1d ago
            </p>
          </div>
        </div>
      </UPageCard>
    </template>
  </UDashboardPanel>
</template>
