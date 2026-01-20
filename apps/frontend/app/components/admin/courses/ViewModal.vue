<script setup lang="ts">
import type { Course } from '@shared/types'

const props = defineProps<{
  course: Course | null
}>()

const emit = defineEmits<{
  edit: [course: Course]
  delete: [course: Course]
}>()
const open = defineModel<boolean>('open', { required: true })

function formatDate(date?: Date | string) {
  if (!date)
    return $t('COMMON.NOT_AVAILABLE')
  return new Date(date).toLocaleString()
}

function handleEdit() {
  if (props.course) {
    open.value = false
    emit('edit', props.course)
  }
}

function handleDelete() {
  if (props.course) {
    emit('delete', props.course)
  }
}
</script>

<template>
  <UModal v-model:open="open" :title="$t('ADMIN.COURSES.VIEW_COURSE')" :ui="{ wrapper: 'max-w-2xl' }">
    <template #body>
      <div v-if="course" class="space-y-6">
        <!-- Course Thumbnail and Basic Info -->
        <div class="pb-4 border-b border-default">
          <div v-if="course.thumbnail" class="mb-4 rounded-lg overflow-hidden">
            <img
              :src="course.thumbnail"
              :alt="course.title"
              class="w-full h-48 object-cover"
            >
          </div>
          <h3 class="text-lg font-semibold text-highlighted">
            {{ course.title }}
          </h3>
        </div>

        <!-- Course Details -->
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="text-sm font-medium text-muted">
              {{ $t('ADMIN.COURSES.DESCRIPTION') }}
            </label>
            <p class="mt-1 text-sm text-highlighted whitespace-pre-wrap">
              {{ course.description }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-muted">
                {{ $t('ADMIN.COURSES.CLASSES') }}
              </label>
              <p class="mt-1 text-sm text-highlighted">
                {{ course.classes?.length || 0 }} {{ $t('ADMIN.COURSES.CLASSES').toLowerCase() }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-muted">
                {{ $t('COMMON.CREATED_AT') }}
              </label>
              <p class="mt-1 text-sm text-highlighted">
                {{ formatDate(course.createdAt) }}
              </p>
            </div>

            <div>
              <label class="text-sm font-medium text-muted">
                {{ $t('COMMON.UPDATED_AT') }}
              </label>
              <p class="mt-1 text-sm text-highlighted">
                {{ formatDate(course.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between items-center w-full">
        <div class="flex justify-between gap-2">
          <div class="flex gap-2">
            <UButton
              :label="$t('COMMON.DELETE')"
              color="error"
              variant="subtle"
              icon="i-lucide-trash"
              @click="handleDelete"
            />
          </div>
          <div class="flex gap-2">
            <UButton
              :label="$t('COMMON.EDIT')"
              color="primary"
              variant="outline"
              icon="i-lucide-pencil"
              @click="handleEdit"
            />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
