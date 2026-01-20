<script setup lang="ts">
import type { Course } from '@shared/types'

definePageMeta({
  title: 'Courses',
})

const { data: courses, pending, error } = await useAPI<Course[]>('/api/courses')
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <div class="mb-12 text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
        {{ $t('NAVIGATION.COURSES') }}
      </h1>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
        {{ $t('COURSES.SUBTITLE') }}
      </p>
    </div>

    <CommonLoading v-if="pending" />
    <CommonError v-else-if="error" :message="error.message" />
    <CommonEmpty
      v-else-if="!courses || courses.length === 0"
      title="No courses available"
      description="Check back later for new courses"
      icon="i-heroicons-academic-cap"
    />

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <UCard v-for="course in courses" :key="course._id" class="group hover:shadow-xl transition-all duration-300">
        <div class="space-y-4">
          <div class="relative overflow-hidden rounded-lg">
            <div class="aspect-video bg-linear-to-br from-primary-100 via-primary-200 to-primary-300 dark:from-primary-900 dark:via-primary-800 dark:to-primary-700 transition-transform duration-300 group-hover:scale-105" />
            <div class="absolute inset-0 flex items-center justify-center">
              <UIcon name="i-heroicons-academic-cap" class="h-16 w-16 text-primary-600 dark:text-primary-300 opacity-50" />
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex items-start justify-between">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white flex-1">
                {{ course.title }}
              </h3>
            </div>
          </div>
          <USeparator />
          <div class="flex items-center justify-between">
            <UButton color="primary" size="sm" trailing-icon="i-heroicons-arrow-right" :to="`/courses/${course._id}`">
              {{ $t('COURSES.VIEW_COURSE') }}
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
