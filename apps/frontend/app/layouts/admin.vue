<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { user } = useUserSession()

const items = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: $t('ADMIN.NAV.DASHBOARD'),
      icon: 'i-heroicons-home',
      to: '/admin',
    },
    {
      label: $t('ADMIN.NAV.USERS'),
      icon: 'i-heroicons-users',
      to: '/admin/users',
    },
    {
      label: $t('ADMIN.NAV.COURSES'),
      icon: 'i-heroicons-academic-cap',
      to: '/admin/courses',
    },
    {
      label: $t('ADMIN.NAV.CONTENT'),
      icon: 'i-heroicons-document-text',
      to: '/admin/content',
    },
    {
      label: $t('ADMIN.NAV.SETTINGS'),
      icon: 'i-heroicons-cog-6-tooth',
      to: '/admin/settings',
    },
  ],
])
</script>

<template>
  <UDashboardGroup>
    <UDashboardSidebar collapsible resizable :ui="{ footer: 'border-t border-default' }">
      <template #header="{ collapsed }">
        <NuxtLink to="/admin" class="mx-auto flex items-center gap-2 hover:opacity-80 transition-opacity">
          <LayoutLogo v-if="!collapsed" class="h-8 w-auto shrink-0" />
          <span v-if="!collapsed" class="text-lg font-semibold">{{ $t('ADMIN.TITLE') }}</span>
          <span v-else class="text-lg font-semibold">A</span>
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <UButton
          :label="collapsed ? undefined : $t('COMMON.SEARCH')"
          icon="i-lucide-search"
          color="neutral"
          variant="outline"
          block
          :square="collapsed"
        >
          <template v-if="!collapsed" #trailing>
            <div class="flex items-center gap-0.5 ms-auto">
              <UKbd value="meta" variant="subtle" />
              <UKbd value="K" variant="subtle" />
            </div>
          </template>
        </UButton>

        <UNavigationMenu
          :collapsed="collapsed"
          :items="items[0]"
          orientation="vertical"
        />

        <UNavigationMenu
          v-if="items[1]"
          :collapsed="collapsed"
          :items="items[1]"
          orientation="vertical"
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UsersDropdown>
          <UButton
            :avatar="{
              alt: user?.name,
            }"
            :label="collapsed ? undefined : user?.name"
            color="neutral"
            variant="ghost"
            class="w-full"
            :block="!collapsed"
            :square="collapsed"
          />
        </UsersDropdown>
      </template>
    </UDashboardSidebar>

    <UDashboardSearch />

    <slot />
  </UDashboardGroup>
</template>
