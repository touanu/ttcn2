<script lang="ts" setup>
import type { Class, Course, TimeTable } from '@shared/types'

definePageMeta({
  title: 'Course Details',
})

const route = useRoute()
const toast = useToast()
const { loggedIn, user } = useUserSession()

const courseId = route.params.id as string
const enrollModalOpen = ref(false)

const { data: course, pending: loadingCourse } = await useAPI<Course>(`/api/courses/${courseId}`)

// Fetch classes for this course
const { data: classes, pending: loadingClasses, refresh: refreshClasses } = await useAPI<Class[]>(
  `/api/classes/course/${courseId}`,
)

// Fetch timetables for all classes
const { data: timetables } = await useAPI<Record<string, TimeTable[]>>(
  `/api/timetables/course/${courseId}`,
)

// Fetch enrollments count
const { data: enrollmentCount } = await useAPI<number>(
  `/api/enrollments/course/${courseId}/count`,
)

// Check if user is already enrolled
const { data: enrollmentStatus, refresh: refreshEnrollmentStatus } = await useAPI<{ isEnrolled: boolean, enrollment?: any }>(
  `/api/enrollments/check/${user.value?.id || 'guest'}/${courseId}`,
  {
    immediate: !!user.value?.id,
  },
)

const isEnrolled = computed(() => enrollmentStatus.value?.isEnrolled ?? false)

const totalClasses = computed(() => classes.value?.length || 0)
const activeClasses = computed(() => classes.value?.filter(c => c.status === 'ACTIVE').length || 0)

async function handleEnroll() {
  if (!loggedIn.value) {
    toast.add({
      title: $t('AUTH.LOGIN_REQUIRED'),
      description: $t('COURSES.LOGIN_TO_ENROLL'),
      color: 'warning',
    })
    navigateTo('/login')
    return
  }

  enrollModalOpen.value = true
}

function handleEnrolled() {
  refreshClasses()
  refreshEnrollmentStatus()
}

function handleViewClasses() {
  // Scroll to classes section
  document.getElementById('classes-section')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div>
    <CommonLoading v-if="loadingCourse" />

    <div v-else-if="course" class="container mx-auto px-4 py-16">
      <!-- Hero Section -->
      <div class="relative rounded-2xl overflow-hidden mb-12">
        <div class="absolute inset-0">
          <img
            v-if="course.thumbnail"
            :src="course.thumbnail"
            :alt="course.title"
            class="w-full h-full object-cover opacity-20"
          >
          <div
            v-else
            class="w-full h-full bg-linear-to-br from-primary-500 via-primary-600 to-primary-700 opacity-20"
          />
        </div>

        <div class="relative bg-linear-to-r from-black/80 via-black/70 to-black/60 p-8 md:p-12">
          <div class="max-w-4xl">
            <!-- Title -->
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
              {{ course.title }}
            </h1>

            <!-- Stats -->
            <div class="flex flex-wrap gap-6 text-gray-200 mb-8">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-user-group" class="h-5 w-5" />
                <span>{{ enrollmentCount || 0 }} {{ $t('COURSES.STUDENTS') }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-calendar" class="h-5 w-5" />
                <span>{{ totalClasses }} {{ $t('COURSES.CLASSES') }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-clock" class="h-5 w-5" />
                <span>{{ activeClasses }} {{ $t('COURSES.ACTIVE_CLASSES') }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4">
              <UButton
                v-if="!isEnrolled"
                color="primary"
                size="xl"
                icon="i-heroicons-user-plus"
                @click="handleEnroll"
              >
                {{ $t('COURSES.REGISTER_NOW') }}
              </UButton>
              <UBadge
                v-else-if="isEnrolled"
                color="success"
                variant="solid"
                size="lg"
                class="px-4 py-3 text-base"
              >
                <UIcon name="i-heroicons-check-circle" class="mr-2" />
                {{ $t('COURSES.ALREADY_ENROLLED') }}
              </UBadge>
              <UButton
                color="neutral"
                size="xl"
                icon="i-heroicons-calendar-days"
                variant="outline"
                @click="handleViewClasses"
              >
                {{ $t('COURSES.VIEW_SCHEDULE') }}
              </UButton>
              <UButton
                v-if="!isEnrolled"
                color="neutral"
                size="xl"
                disabled
              >
                {{ $t('COURSES.NOT_AVAILABLE') }}
              </UButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Content -->
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- About Course -->
          <UCard>
            <template #header>
              <h2 class="text-2xl font-bold">
                {{ $t('COURSES.ABOUT') }}
              </h2>
            </template>

            <div class="prose dark:prose-invert max-w-none">
              <p>{{ course.description }}</p>
            </div>
          </UCard>

          <!-- Available Classes -->
          <UCard id="classes-section">
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-2xl font-bold">
                  {{ $t('COURSES.AVAILABLE_CLASSES') }}
                </h2>
                <UBadge color="primary" variant="subtle">
                  {{ totalClasses }} {{ $t('COURSES.CLASSES') }}
                </UBadge>
              </div>
            </template>

            <CommonLoading v-if="loadingClasses" />
            <CommonEmpty
              v-else-if="!classes || classes.length === 0"
              :title="$t('COURSES.NO_CLASSES')"
              :description="$t('COURSES.NO_CLASSES_DESC')"
              icon="i-heroicons-calendar"
            />

            <div v-else class="space-y-4">
              <div
                v-for="classItem in classes"
                :key="classItem._id"
                class="p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                <div class="flex items-start justify-between mb-3">
                  <div>
                    <h3 class="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                      {{ classItem.name }}
                    </h3>
                  </div>
                  <UBadge
                    :color="classItem.status === 'ACTIVE' ? 'success' : classItem.status === 'COMPLETED' ? 'neutral' : 'warning'"
                    variant="subtle"
                  >
                    {{ $t(`CLASSES.STATUS.${classItem.status}`) }}
                  </UBadge>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="flex items-center gap-2 text-sm">
                    <UIcon name="i-heroicons-calendar" class="text-gray-500" />
                    <span>{{ $t('CLASSES.START') }}: {{ classItem.openedAt ? new Date(classItem.openedAt).toLocaleDateString() : 'TBA' }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <UIcon name="i-heroicons-calendar" class="text-gray-500" />
                    <span>{{ $t('CLASSES.END') }}: {{ classItem.endedAt ? new Date(classItem.endedAt).toLocaleDateString() : 'TBA' }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <UIcon name="i-heroicons-users" class="text-gray-500" />
                    <span>{{ classItem.studentIds?.length || 0 }} / {{ classItem.maxStudents || 30 }} {{ $t('CLASSES.STUDENTS') }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <UIcon name="i-heroicons-map-pin" class="text-gray-500" />
                    <span>{{ classItem.room || 'TBA' }}</span>
                  </div>
                </div>

                <!-- Timetable -->
                <div v-if="timetables[classItem._id!]?.length" class="mb-4">
                  <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ $t('COURSES.SCHEDULE') }}:
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <UBadge
                      v-for="schedule in timetables[classItem._id!]"
                      :key="schedule._id"
                      color="primary"
                      variant="subtle"
                      size="sm"
                    >
                      {{ $t(`COMMON.DAYS.${schedule.dayOfWeek}`) }}:
                      {{ new Date(schedule.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
                      -
                      {{ new Date(schedule.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}
                    </UBadge>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <span v-if="(classItem.studentIds?.length || 0) >= (classItem.maxStudents || 30)" class="text-warning-600 dark:text-warning-400 font-medium">
                      {{ $t('CLASSES.FULL') }}
                    </span>
                    <span v-else class="text-success-600 dark:text-success-400 font-medium">
                      {{ (classItem.maxStudents || 30) - (classItem.studentIds?.length || 0) }} {{ $t('CLASSES.SEATS_AVAILABLE') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Stats -->
          <UCard>
            <template #header>
              <h3 class="font-bold">
                {{ $t('COURSES.QUICK_INFO') }}
              </h3>
            </template>

            <div class="space-y-4">
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {{ $t('COURSES.LEVEL') }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {{ $t('COURSES.TOTAL_STUDENTS') }}
                </div>
                <div class="font-semibold">
                  {{ enrollmentCount || 0 }} {{ $t('COURSES.STUDENTS') }}
                </div>
              </div>

              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {{ $t('COURSES.AVAILABLE_CLASSES') }}
                </div>
                <div class="font-semibold">
                  {{ activeClasses }} / {{ totalClasses }} {{ $t('COURSES.CLASSES') }}
                </div>
              </div>
            </div>
          </UCard>

          <!-- Contact Card -->
          <UCard>
            <template #header>
              <h3 class="font-bold">
                {{ $t('COURSES.NEED_HELP') }}
              </h3>
            </template>

            <div class="space-y-3 text-sm">
              <p class="text-gray-600 dark:text-gray-400">
                {{ $t('COURSES.CONTACT_DESC') }}
              </p>

              <UButton
                block
                color="primary"
                variant="outline"
                icon="i-heroicons-phone"
                to="/contact"
              >
                {{ $t('COURSES.CONTACT_US') }}
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </div>

    <CommonError
      v-else
      title="Course Not Found"
      description="The course you're looking for doesn't exist"
    />

    <!-- Enrollment Modal -->
    <CoursesEnrollModal
      v-model:open="enrollModalOpen"
      :course="course"
      :classes="classes || []"
      @enrolled="handleEnrolled"
    />
  </div>
</template>
