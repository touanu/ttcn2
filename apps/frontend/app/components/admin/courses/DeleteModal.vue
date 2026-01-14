<script setup lang="ts">
import type { Course } from '@shared/types'

const props = defineProps<{
  courses: Course[]
}>()

const emit = defineEmits<{
  deleted: []
}>()
const open = defineModel<boolean>('open', { required: true })
const toast = useToast()
const isDeleting = ref(false)

async function handleDelete() {
  if (props.courses.length === 0)
    return

  isDeleting.value = true

  try {
    // Delete courses one by one
    await Promise.all(
      props.courses.map(course =>
        $fetch(`/api/admin/courses/${course._id}`, {
          method: 'DELETE',
        }),
      ),
    )

    toast.add({
      title: $t('COMMON.SUCCESS'),
      description: $t('ADMIN.COURSES.COURSES_DELETED_SUCCESS', { count: props.courses.length }),
      color: 'success',
    })

    open.value = false
    emit('deleted')

    // Refresh the courses list
    await refreshNuxtData()
  }
  catch (err: any) {
    toast.add({
      title: $t('ERRORS.TITLE'),
      description: err?.message || $t('ADMIN.COURSES.DELETE_ERROR'),
      color: 'error',
    })
  }
  finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="$t('ADMIN.COURSES.DELETE_MODAL_TITLE')"
    :ui="{ wrapper: 'max-w-md' }"
  >
    <template #body>
      <div class="space-y-4">
        <p class="text-sm text-muted">
          {{ $t('ADMIN.COURSES.DELETE_CONFIRMATION', { count: courses.length }) }}
        </p>

        <div class="bg-error/10 border border-error/20 rounded-lg p-3">
          <p class="text-sm text-error">
            {{ $t('ADMIN.COURSES.DELETE_WARNING') }}
          </p>
        </div>

        <div v-if="courses.length > 0" class="space-y-2">
          <p class="text-sm font-medium text-highlighted">
            {{ $t('ADMIN.COURSES.COURSES_TO_DELETE') }}:
          </p>
          <ul class="space-y-1">
            <li
              v-for="course in courses.slice(0, 3)"
              :key="course._id"
              class="text-sm text-muted flex items-center gap-2"
            >
              <UIcon name="i-lucide-book" class="w-4 h-4" />
              {{ course.title }}
            </li>
            <li v-if="courses.length > 3" class="text-sm text-muted italic">
              {{ $t('ADMIN.COURSES.AND_MORE', { count: courses.length - 3 }) }}
            </li>
          </ul>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          :label="$t('COMMON.CANCEL')"
          color="neutral"
          variant="subtle"
          :disabled="isDeleting"
          @click="open = false"
        />
        <UButton
          :label="$t('COMMON.DELETE')"
          color="error"
          icon="i-lucide-trash"
          :loading="isDeleting"
          @click="handleDelete"
        />
      </div>
    </template>
  </UModal>
</template>
