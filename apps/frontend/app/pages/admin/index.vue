<script setup lang="ts">
import type { User } from '@shared/types'

definePageMeta({
  layout: 'admin',
})

// Fetch dashboard stats
const { data: stats, status: statsStatus } = await useFetch('/api/admin/stats', {
  lazy: true,
  default: () => ({
    totalUsers: 0,
    totalCourses: 0,
    activeCourses: 0,
    totalLessons: 0,
  }),
})

// Fetch recent users
const { data: recentUsers } = await useFetch<User[]>('/api/admin/users/recent', {
  lazy: true,
  default: () => [],
})

// Helper function to format numbers
function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num)
}

// Calculate variations (mock data for now, can be calculated from real data)
const userVariation = ref(12.5)
const courseVariation = ref(8.3)
const lessonVariation = ref(-3.2)

const statCards = [
  {
    titleKey: 'ADMIN.STATS.TOTAL_USERS',
    icon: 'i-heroicons-users',
    getValue: () => formatNumber(stats.value?.totalUsers || 0),
    getVariation: () => userVariation.value,
  },
  {
    titleKey: 'ADMIN.STATS.TOTAL_COURSES',
    icon: 'i-heroicons-academic-cap',
    getValue: () => formatNumber(stats.value?.totalCourses || 0),
    getVariation: () => courseVariation.value,
  },
  {
    titleKey: 'ADMIN.STATS.ACTIVE_COURSES',
    icon: 'i-heroicons-check-circle',
    getValue: () => formatNumber(stats.value?.activeCourses || 0),
    getVariation: () => courseVariation.value,
  },
  {
    titleKey: 'ADMIN.STATS.TOTAL_LESSONS',
    icon: 'i-heroicons-document-text',
    getValue: () => formatNumber(stats.value?.totalLessons || 0),
    getVariation: () => lessonVariation.value,
  },
]
</script>

<template>
  <UDashboardPanel id="admin-dashboard">
    <template #header>
      <UDashboardNavbar :title="$t('ADMIN.DASHBOARD')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <NuxtLink to="/" external>
            <UButton
              :label="$t('ADMIN.BACK_TO_SITE')"
              icon="i-heroicons-arrow-left"
              color="neutral"
              variant="outline"
            />
          </NuxtLink>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <div class="flex flex-col">
            <h2 class="text-2xl font-semibold text-highlighted">
              {{ $t('ADMIN.WELCOME') }}
            </h2>
            <p class="text-sm text-muted">
              {{ $t('ADMIN.WELCOME_SUBTITLE') }}
            </p>
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <!-- Stats Cards Grid -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        <UPageCard
          v-for="(stat, index) in statCards"
          :key="index"
          variant="subtle"
          :ui="{ body: 'flex flex-col gap-y-3' }"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-muted uppercase font-medium mb-1.5">
                {{ $t(stat.titleKey) }}
              </p>
              <p v-if="statsStatus === 'pending'" class="text-2xl font-semibold text-muted">
                ---
              </p>
              <p v-else class="text-2xl font-semibold text-highlighted">
                {{ stat.getValue() }}
              </p>
            </div>
            <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
              <UIcon :name="stat.icon" class="w-6 h-6 text-primary" />
            </div>
          </div>
          <div v-if="statsStatus !== 'pending'" class="flex items-center gap-1">
            <UIcon
              :name="stat.getVariation() >= 0 ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down'"
              class="w-4 h-4"
              :class="[
                stat.getVariation() >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
              ]"
            />
            <span
              class="text-sm font-medium"
              :class="[
                stat.getVariation() >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
              ]"
            >
              {{ Math.abs(stat.getVariation()) }}%
            </span>
            <span class="text-xs text-muted ml-1">
              so với tháng trước
            </span>
          </div>
        </UPageCard>
      </div>

      <!-- Recent Users Section -->
      <UPageCard
        class="mt-6"
        :title="$t('ADMIN.RECENT_USERS')"
        variant="subtle"
        :ui="{ header: 'pb-4 mb-0 border-b border-default' }"
      >
        <template #trailing>
          <NuxtLink to="/admin/users">
            <UButton
              :label="$t('ADMIN.VIEW_ALL')"
              color="neutral"
              variant="ghost"
              trailing-icon="i-heroicons-arrow-right"
            />
          </NuxtLink>
        </template>

        <div v-if="recentUsers && recentUsers.length > 0" class="divide-y divide-default">
          <div
            v-for="user in recentUsers.slice(0, 5)"
            :key="user._id"
            class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
          >
            <div class="flex items-center gap-3 min-w-0">
              <UAvatar
                size="md"
                :alt="user.fullName || user.username"
              />
              <div class="min-w-0">
                <p class="font-medium text-highlighted truncate">
                  {{ user.fullName || user.username }}
                </p>
                <p class="text-sm text-muted truncate">
                  {{ user.email }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UBadge
                :label="user.role ? $t(`ROLES.${user.role.toUpperCase()}`) : 'N/A'"
                variant="subtle"
                :color="user.role === 'admin' ? 'primary' : 'neutral'"
              />
            </div>
          </div>
        </div>
        <div v-else class="py-8 text-center text-muted">
          <UIcon name="i-heroicons-users" class="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Chưa có người dùng mới</p>
        </div>
      </UPageCard>
    </template>
  </UDashboardPanel>
</template>
