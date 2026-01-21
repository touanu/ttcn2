<script setup>
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
const route = useRoute()
const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)
const { fetch: refreshSession, clear: clearSession } = useUserSession()

useHead({
  title: route.meta.title ? `${route.meta.title} - Zenlish` : 'Zenlish',
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      property: 'og:title',
      content: `${route.meta.title} - Zenlish`,
    },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang,
    dir,
  },
})

onMounted(() => {
  $fetch('/api/auth/refresh', { method: 'POST' })
    .then(refreshSession)
    .catch(async () => {
      await clearSession()
      await navigateTo('/login')
    })
})
</script>

<template>
  <UApp :locale="locales[locale]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
