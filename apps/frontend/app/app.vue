<script setup>
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang,
    dir,
  },
})

useSeoMeta({
  title: 'Englearn - Học tiếng Anh hiệu quả',
  description: 'Nền tảng học tiếng Anh trực tuyến hiệu quả với các khóa học chất lượng cao và phương pháp giảng dạy tiên tiến.',
})
</script>

<template>
  <UApp :locale="locales[locale]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
