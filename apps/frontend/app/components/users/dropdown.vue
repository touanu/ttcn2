<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const { $api } = useNuxtApp()
const { fetch: fetchSession } = useUserSession()

const userActionItems = ref<DropdownMenuItem[]>([
  {
    label: $t('NAVIGATION.USER.DROPDOWN.PROFILE'),
    to: '/profile',
    icon: 'i-ph-user-circle',
  },
  {
    label: $t('NAVIGATION.USER.DROPDOWN.SETTINGS'),
    to: '/settings',
    icon: 'i-ph-gear',
  },
  {
    label: $t('NAVIGATION.USER.DROPDOWN.LOGOUT'),
    onClick: async () => {
      $api('/api/auth/logout', { method: 'POST' })
      fetchSession()
      await navigateTo('/')
    },
    icon: 'i-ph-sign-out',
    class: 'cursor-pointer',
  },
])
</script>

<template>
  <UDropdownMenu
    :items="userActionItems"
  >
    <slot />
  </UDropdownMenu>
</template>
