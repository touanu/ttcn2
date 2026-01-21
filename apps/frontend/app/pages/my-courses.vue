<script setup lang="ts">
import type { Class, Course, TimeTable } from '@shared/types'

definePageMeta({
  middleware: ['auth'],
})

interface EnrolledCourse extends Omit<Course, 'classes'> {
  enrollment?: {
    _id?: string
    status: 'in-progress' | 'completed' | 'dropped'
    enrolledAt: Date
    completedAt?: Date
  }
  classes?: Array<Class & { timetables?: TimeTable[] }>
}

const { data: courses, status, refresh } = await useAPI<EnrolledCourse[]>('/api/my-courses', {
  lazy: true,
  server: false,
})

const filterStatus = ref<'all' | 'in-progress' | 'completed' | 'dropped'>('all')

const filteredCourses = computed(() => {
  if (!courses.value)
    return []
  if (filterStatus.value === 'all')
    return courses.value
  return courses.value.filter(c => c.enrollment?.status === filterStatus.value)
})

const statsCards = computed(() => [
  {
    title: $t('MY_COURSES.STATS.TOTAL'),
    value: courses.value?.length || 0,
    icon: 'i-heroicons-academic-cap',
    color: 'primary' as const,
  },
  {
    title: $t('MY_COURSES.STATS.IN_PROGRESS'),
    value: courses.value?.filter(c => c.enrollment?.status === 'in-progress').length || 0,
    icon: 'i-heroicons-clock',
    color: 'warning' as const,
  },
  {
    title: $t('MY_COURSES.STATS.COMPLETED'),
    value: courses.value?.filter(c => c.enrollment?.status === 'completed').length || 0,
    icon: 'i-heroicons-check-circle',
    color: 'success' as const,
  },
])

function getStatusColor(status?: string) {
  switch (status) {
    case 'in-progress':
      return 'warning'
    case 'completed':
      return 'success'
    case 'dropped':
      return 'error'
    default:
      return 'neutral'
  }
}

function getStatusLabel(status?: string) {
  switch (status) {
    case 'in-progress':
      return $t('MY_COURSES.STATUS.IN_PROGRESS')
    case 'completed':
      return $t('MY_COURSES.STATUS.COMPLETED')
    case 'dropped':
      return $t('MY_COURSES.STATUS.DROPPED')
    default:
      return $t('MY_COURSES.STATUS.UNKNOWN')
  }
}

function formatDate(date?: Date | string) {
  if (!date)
    return '-'
  return new Date(date).toLocaleDateString()
}

function formatTime(date?: Date | string) {
  if (!date)
    return '-'
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function getDayName(dayOfWeek: number) {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  return $t(`COMMON.DAYS.${days[dayOfWeek]}`)
}
</script>

<template>
  <UContainer class="py-8">
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">
            {{ $t('MY_COURSES.TITLE') }}
          </h1>
          <p class="text-muted mt-2">
            {{ $t('MY_COURSES.DESCRIPTION') }}
          </p>
        </div>
        <UButton
          icon="i-heroicons-arrow-path"
          color="neutral"
          variant="outline"
          :loading="status === 'pending'"
          @click="refresh"
        >
          {{ $t('COMMON.REFRESH') }}
        </UButton>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UCard
          v-for="stat in statsCards"
          :key="stat.title"
          class="overflow-hidden"
        >
          <div class="flex items-center gap-4">
            <div
              class="p-3 rounded-lg"
              :class="[
                stat.color === 'primary' && 'bg-primary-50 dark:bg-primary-950',
                stat.color === 'warning' && 'bg-warning-50 dark:bg-warning-950',
                stat.color === 'success' && 'bg-success-50 dark:bg-success-950',
              ]"
            >
              <UIcon
                :name="stat.icon"
                class="w-6 h-6"
                :class="[
                  stat.color === 'primary' && 'text-primary-600 dark:text-primary-400',
                  stat.color === 'warning' && 'text-warning-600 dark:text-warning-400',
                  stat.color === 'success' && 'text-success-600 dark:text-success-400',
                ]"
              />
            </div>
            <div>
              <p class="text-sm text-muted">
                {{ stat.title }}
              </p>
              <p class="text-2xl font-bold">
                {{ stat.value }}
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Filter Tabs -->
      <UTabs
        v-model:selected="filterStatus"
        :items="[
          { label: $t('MY_COURSES.FILTER.ALL'), value: 'all' },
          { label: $t('MY_COURSES.FILTER.IN_PROGRESS'), value: 'in-progress' },
          { label: $t('MY_COURSES.FILTER.COMPLETED'), value: 'completed' },
          { label: $t('MY_COURSES.FILTER.DROPPED'), value: 'dropped' },
        ]"
      />

      <!-- Loading State -->
      <div v-if="status === 'pending'" class="flex items-center justify-center py-12">
        <CommonLoading />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!filteredCourses.length"
        class="text-center py-12"
      >
        <UIcon name="i-heroicons-academic-cap" class="w-16 h-16 text-muted mx-auto mb-4" />
        <h3 class="text-xl font-semibold mb-2">
          {{ $t('MY_COURSES.EMPTY.TITLE') }}
        </h3>
        <p class="text-muted mb-6">
          {{ $t('MY_COURSES.EMPTY.DESCRIPTION') }}
        </p>
        <UButton
          to="/courses"
          color="primary"
          icon="i-heroicons-magnifying-glass"
        >
          {{ $t('MY_COURSES.EMPTY.BROWSE_COURSES') }}
        </UButton>
      </div>

      <!-- Course Grid -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <UCard
          v-for="course in filteredCourses"
          :key="course._id"
          class="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <template #header>
            <div class="aspect-video bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden">
              <img
                v-if="course.thumbnail"
                :src="course.thumbnail"
                :alt="course.title"
                class="w-full h-full object-cover"
              >
              <div v-else class="w-full h-full flex items-center justify-center">
                <UIcon name="i-heroicons-academic-cap" class="w-12 h-12 text-muted" />
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <div class="flex items-start justify-between gap-2 mb-2">
                <h3 class="font-semibold text-lg line-clamp-2">
                  {{ course.title }}
                </h3>
                <UBadge
                  :color="getStatusColor(course.enrollment?.status)"
                  variant="subtle"
                  size="sm"
                >
                  {{ getStatusLabel(course.enrollment?.status) }}
                </UBadge>
              </div>
              <p class="text-sm text-muted line-clamp-2">
                {{ course.description }}
              </p>
            </div>

            <!-- Classes Information -->
            <div v-if="course.classes && course.classes.length > 0" class="space-y-3">
              <div class="flex items-center gap-2 text-sm font-medium">
                <UIcon name="i-heroicons-user-group" class="text-primary" />
                <span>{{ $t('MY_COURSES.CLASSES') }} ({{ course.classes.length }})</span>
              </div>

              <div class="space-y-2">
                <div
                  v-for="classItem in course.classes"
                  :key="classItem._id"
                  class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-medium text-sm">{{ classItem.name }}</span>
                    <UBadge
                      v-if="classItem.status"
                      :color="classItem.status === 'ACTIVE' ? 'success' : classItem.status === 'PENDING' ? 'warning' : 'neutral'"
                      variant="subtle"
                      size="sm"
                    >
                      {{ $t(`STATUS.CLASS.${classItem.status}`) }}
                    </UBadge>
                  </div>

                  <!-- Timetables -->
                  <div v-if="classItem.timetables && classItem.timetables.length > 0" class="space-y-1">
                    <div class="flex items-center gap-1 text-xs text-muted">
                      <UIcon name="i-heroicons-clock" />
                      <span>{{ $t('MY_COURSES.SCHEDULE') }}:</span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <div
                        v-for="timetable in classItem.timetables"
                        :key="timetable._id"
                        class="text-xs px-2 py-1 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"
                      >
                        <span class="font-medium">{{ getDayName(timetable.dayOfWeek) }}</span>:
                        {{ formatTime(timetable.startTime) }} - {{ formatTime(timetable.endTime) }}
                      </div>
                    </div>
                  </div>

                  <!-- Room Info -->
                  <div v-if="classItem.room" class="flex items-center gap-1 text-xs text-muted">
                    <UIcon name="i-heroicons-map-pin" />
                    <span>{{ $t('MY_COURSES.ROOM') }}: {{ classItem.room }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-sm text-muted italic">
              {{ $t('MY_COURSES.NO_CLASSES') }}
            </div>

            <!-- Enrollment Info -->
            <div class="text-xs text-muted space-y-1">
              <div class="flex items-center justify-between">
                <span>{{ $t('MY_COURSES.ENROLLED_AT') }}:</span>
                <span>{{ formatDate(course.enrollment?.enrolledAt) }}</span>
              </div>
              <div v-if="course.enrollment?.completedAt" class="flex items-center justify-between">
                <span>{{ $t('MY_COURSES.COMPLETED_AT') }}:</span>
                <span>{{ formatDate(course.enrollment?.completedAt) }}</span>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
