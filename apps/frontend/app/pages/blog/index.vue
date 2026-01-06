<script setup lang="ts">
import type { BlogPostProps } from '@nuxt/ui'

definePageMeta({
  title: 'Blog',
})

const posts = ref<BlogPostProps[]>([
  {
    title: $t('BLOG.POST_TITLE', { number: 1 }),
    description: $t('BLOG.POST_DESC'),
    image: 'https://nuxt.com/assets/blog/nuxt-icon/cover.png',
    date: new Date().toLocaleDateString(),
    variant: 'ghost',
    authors: [
      {
        name: 'Nuxt Team',
        avatar: {
          src: 'https://nuxt.com/assets/blog/authors/nuxt-team/avatar.png',
          alt: 'Nuxt Team',
        },
      },
    ],
    to: '/blog/sample-post-1',
  },
])
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <div class="mb-12 text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
        {{ $t('NAVIGATION.BLOG') }}
      </h1>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
        {{ $t('BLOG.SUBTITLE') }}
      </p>
    </div>

    <UBlogPosts
      :posts="posts"
    />
  </div>
</template>
