<script lang="ts" setup>
import type { Course } from '@shared/types'

definePageMeta({
  seo: false,
  title: 'Home',
})

const searchQuery = ref('')
const selectedLevel = ref('all')

const { data: courses, pending } = await useFetch<Course[]>('/api/courses')

const filteredCourses = computed(() => {
  if (!courses.value)
    return []

  return courses.value.filter((course) => {
    const matchesSearch
      = course.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        || course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        || course.status === 'PUBLISHED'
    const matchesLevel = selectedLevel.value === 'all' || course.level === selectedLevel.value.toUpperCase()

    return matchesSearch && matchesLevel
  })
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-linear-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center space-y-6">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
            {{ $t('HOME.HERO.TITLE') }}
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            {{ $t('HOME.HERO.SUBTITLE') }}
          </p>

          <!-- Search Bar -->
          <div class="max-w-2xl mx-auto pt-8">
            <div class="flex gap-3">
              <UInput
                v-model="searchQuery"
                icon="i-heroicons-magnifying-glass"
                :placeholder="$t('HOME.SEARCH_PLACEHOLDER')"
                size="xl"
                class="flex-1"
              />
              <USelect
                v-model="selectedLevel"
                :items="[
                  { label: $t('COMMON.ALL'), value: 'all' },
                  { label: $t('LEVELS.BEGINNER'), value: 'beginner' },
                  { label: $t('LEVELS.INTERMEDIATE'), value: 'intermediate' },
                  { label: $t('LEVELS.ADVANCED'), value: 'advanced' },
                ]"
                size="xl"
                class="w-48"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Courses Section -->
    <section class="py-16 container mx-auto px-4">
      <div class="mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('HOME.COURSES.TITLE') }}
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t('HOME.COURSES.SUBTITLE') }}
        </p>
      </div>

      <CommonLoading v-if="pending" />
      <CommonEmpty
        v-else-if="filteredCourses.length === 0"
        :title="$t('HOME.NO_COURSES')"
        :description="$t('HOME.NO_COURSES_DESC')"
        icon="i-heroicons-academic-cap"
      />

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UCard
          v-for="course in filteredCourses"
          :key="course._id"
          class="group hover:shadow-xl transition-all duration-300 cursor-pointer"
          @click="navigateTo(`/courses/${course._id}`)"
        >
          <div class="space-y-4">
            <div class="relative overflow-hidden rounded-lg aspect-video">
              <img
                v-if="course.thumbnail"
                :src="course.thumbnail"
                :alt="course.title"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              >
              <div
                v-else
                class="w-full h-full bg-linear-to-br from-primary-100 via-primary-200 to-primary-300 dark:from-primary-900 dark:via-primary-800 dark:to-primary-700 flex items-center justify-center"
              >
                <UIcon name="i-heroicons-academic-cap" class="h-16 w-16 text-primary-600 dark:text-primary-300 opacity-50" />
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                {{ course.title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {{ course.description }}
              </p>

              <div class="flex items-center gap-3 pt-2">
                <UBadge :color="course.level === 'BEGINNER' ? 'success' : course.level === 'INTERMEDIATE' ? 'warning' : 'error'" variant="subtle" size="sm">
                  {{ $t(`LEVELS.${course.level}`) }}
                </UBadge>
                <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <UIcon name="i-heroicons:user-group" class="h-4 w-4" />
                  <span>{{ course.classIds?.length || 0 }}</span>
                </div>
              </div>
            </div>

            <USeparator />

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UBadge
                  :color="course.status === 'PUBLISHED' ? 'success' : course.status === 'DRAFT' ? 'warning' : 'neutral'"
                  variant="subtle"
                  size="sm"
                >
                  {{ $t(`STATUS.COURSE.${course.status}`) }}
                </UBadge>
              </div>
              <UButton
                v-if="course.status === 'PUBLISHED'"
                color="primary"
                size="sm"
                trailing-icon="i-heroicons-arrow-right"
                @click.stop="navigateTo(`/courses/${course._id}`)"
              >
                {{ $t('HOME.VIEW_DETAILS') }}
              </UButton>
              <UButton
                v-else
                color="neutral"
                size="sm"
                disabled
              >
                {{ $t('COURSES.NOT_AVAILABLE') }}
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
    </section>
  </div>
</template>
