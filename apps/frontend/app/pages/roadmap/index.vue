<script setup lang="ts">
definePageMeta({
  title: 'Learning Roadmap',
})
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <div class="mb-12 text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
        {{ $t('NAVIGATION.ROADMAP') }}
      </h1>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
        {{ $t('ROADMAP.SUBTITLE') }}
      </p>
    </div>

    <div class="mx-auto max-w-4xl">
      <div class="relative space-y-6">
        <div v-for="(level, index) in ['Beginner', 'Intermediate', 'Advanced', 'Expert']" :key="level" class="relative">
          <div v-if="index < 3" class="absolute left-6 top-18 h-full w-0.5 bg-linear-to-b from-primary-200 to-transparent dark:from-primary-800" />
          <UCard class="hover:shadow-lg transition-all duration-300">
            <div class="flex items-start gap-6">
              <div class="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-600 shadow-lg">
                <UIcon name="i-heroicons-academic-cap" class="h-6 w-6 text-white" />
                <div class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white dark:bg-gray-900 text-xs font-bold text-primary-600">
                  {{ index + 1 }}
                </div>
              </div>
              <div class="flex-1 space-y-4">
                <div>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ $t(`ROADMAP.LEVEL_${level.toUpperCase()}`) }}
                  </h3>
                  <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {{ $t('ROADMAP.LEVEL_DESC') }}
                  </p>
                </div>
                <div class="space-y-2">
                  <div class="flex items-center justify-between text-sm">
                    <span class="font-medium text-gray-700 dark:text-gray-300">Progress</span>
                    <span class="font-semibold text-primary-600 dark:text-primary-400">
                      {{ Math.floor(Math.random() * 100) }}%
                    </span>
                  </div>
                  <UProgress :value="Math.random() * 100" size="md" />
                </div>
                <div class="flex flex-wrap gap-2">
                  <UBadge primary variant="subtle" size="sm">
                    <UIcon name="i-heroicons-book-open" class="h-3 w-3" />
                    {{ Math.floor(Math.random() * 20 + 10) }} lessons
                  </UBadge>
                  <UBadge primary variant="subtle" size="sm">
                    <UIcon name="i-heroicons-check-circle" class="h-3 w-3" />
                    {{ Math.floor(Math.random() * 10) }} completed
                  </UBadge>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>
