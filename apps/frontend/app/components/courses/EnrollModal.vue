<script lang="ts" setup>
import type { Class, Course } from '@shared/types'

const props = defineProps<{
  course: Course | undefined
  classes: Class[]
}>()

const emit = defineEmits<{
  enrolled: []
}>()

const { $api } = useNuxtApp()
const open = defineModel<boolean>('open', { required: true })
const toast = useToast()

const selectedClassId = ref<string>()
const enrolling = ref(false)

const availableClasses = computed(() => {
  if (!props.classes || props.classes.length === 0)
    return []

  return props.classes.filter((c) => {
    // Show ACTIVE or PENDING classes (not COMPLETED)
    const isAvailable = c.status !== 'COMPLETED'
    const hasCapacity = (c.studentIds?.length || 0) < (c.maxStudents || 30)

    return isAvailable && hasCapacity
  })
})

async function handleEnroll() {
  if (!selectedClassId.value) {
    toast.add({
      title: $t('ERROR_TITLE'),
      description: $t('COURSES.SELECT_CLASS_ERROR'),
      color: 'error',
    })
    return
  }

  if (!props.course?._id)
    return

  enrolling.value = true

  await $api(`/api/courses/${props.course._id}/enroll`, {
    method: 'POST',
    body: {
      classId: selectedClassId.value,
    },
  }).catch(() => { enrolling.value = false })

  open.value = false
  emit('enrolled')

  enrolling.value = false
}

// Reset selection when modal closes
watch(open, (isOpen) => {
  if (!isOpen) {
    selectedClassId.value = undefined
  }
})
</script>

<template>
  <UModal
    v-model:open="open"
    :title="$t('COURSES.ENROLL_IN_COURSE')"
    :ui="{ wrapper: 'max-w-3xl' }"
  >
    <template #body>
      <div v-if="course" class="space-y-4">
        <div class="pb-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="font-semibold text-lg">
            {{ course.title }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ $t('COURSES.SELECT_CLASS') }}
          </p>
        </div>

        <CommonEmpty
          v-if="availableClasses.length === 0"
          :title="$t('COURSES.NO_AVAILABLE_CLASSES')"
          :description="$t('COURSES.NO_AVAILABLE_CLASSES_DESC')"
          icon="i-heroicons-calendar"
        />

        <div v-else class="space-y-3 max-h-96 overflow-y-auto">
          <div
            v-for="classItem in availableClasses"
            :key="classItem._id"
            class="relative p-4 rounded-lg border-2 cursor-pointer transition-all"
            :class="[
              selectedClassId === classItem._id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700',
            ]"
            @click="selectedClassId = classItem._id"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h4 class="font-semibold mb-1">
                  {{ classItem.name }}
                </h4>
              </div>
              <UIcon
                v-if="selectedClassId === classItem._id"
                name="i-heroicons-check-circle-solid"
                class="h-6 w-6 text-primary-500 shrink-0"
              />
            </div>

            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-calendar" class="text-gray-500 shrink-0" />
                <span class="truncate">{{ classItem.startDate ? new Date(classItem.startDate).toLocaleDateString() : 'TBA' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-users" class="text-gray-500 shrink-0" />
                <span>{{ classItem.studentIds?.length || 0 }} / {{ classItem.maxStudents || 30 }}</span>
              </div>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-map-pin" class="text-gray-500 shrink-0" />
                <span class="truncate">{{ classItem.room || 'TBA' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-3">
        <UButton
          color="neutral"
          variant="subtle"
          :disabled="enrolling"
          @click="open = false"
        >
          {{ $t('COMMON.CANCEL') }}
        </UButton>
        <UButton
          :disabled="!selectedClassId || enrolling || availableClasses.length === 0"
          :loading="enrolling"
          color="primary"
          @click="handleEnroll"
        >
          {{ $t('COURSES.CONFIRM_ENROLLMENT') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
