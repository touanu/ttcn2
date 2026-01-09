<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { ResponseBody } from '@shared/types'

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
      const res = await $fetch<ResponseBody>('/api/auth/logout', { method: 'POST' })
      if (!res.success)
        console.error('Logout failed:', res.message)

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
