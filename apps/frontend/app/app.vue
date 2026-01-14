<script setup>
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
const route = useRoute()
const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)

useHead({
  title: route.meta.title ? `${route.meta.title} - Englearn` : 'Englearn',
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      property: 'og:title',
      content: `${route.meta.title} - Englearn`,
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
  useUserSession().fetch()
})
</script>

<template>
  <UApp :locale="locales[locale]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
