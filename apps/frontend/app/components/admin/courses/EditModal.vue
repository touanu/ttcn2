<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Course } from '@shared/types'
import { updateCourseSchema } from '@shared/schemas'

const props = defineProps<{
  course: Course | null
}>()

const emit = defineEmits<{
  updated: []
}>()
const open = defineModel<boolean>('open', { required: true })
const toast = useToast()
const validateForm = createFormValidator(updateCourseSchema)

const thumbnailFile = ref<File | null>(null)
const uploading = ref(false)

const state = reactive<Partial<Course>>({
  title: '',
  description: '',
  thumbnail: '',
  level: 'BEGINNER',
  status: 'DRAFT',
})

watch(() => props.course, (newCourse) => {
  if (newCourse) {
    state.title = newCourse.title
    state.description = newCourse.description
    state.thumbnail = newCourse.thumbnail
    state.level = newCourse.level || 'BEGINNER'
    state.status = newCourse.status || 'DRAFT'
    thumbnailFile.value = null
  }
}, { immediate: true })

watch(thumbnailFile, (file) => {
  if (file) {
    handleFileChange(file)
  }
})

async function handleFileChange(file: File) {
  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await $fetch<{ url: string }>('/api/media/upload', {
      method: 'POST',
      body: formData,
    })

    state.thumbnail = response.url

    toast.add({
      title: $t('COMMON.SUCCESS'),
      description: 'Thumbnail uploaded successfully',
      color: 'success',
    })
  }
  catch (err: any) {
    toast.add({
      title: $t('ERRORS.TITLE'),
      description: err?.message || 'Failed to upload thumbnail',
      color: 'error',
    })
    thumbnailFile.value = null
  }
  finally {
    uploading.value = false
  }
}

async function onSubmit(event: FormSubmitEvent<Partial<Course>>) {
  if (!props.course?._id)
    return

  try {
    await $fetch(`/api/admin/courses/${props.course._id}`, {
      method: 'PATCH',
      body: event.data,
    })

    toast.add({
      title: $t('COMMON.SUCCESS'),
      description: $t('ADMIN.COURSES.COURSE_UPDATED', { title: event.data.title }),
      color: 'success',
    })

    open.value = false
    emit('updated')

    // Refresh the courses list
    await refreshNuxtData()
  }
  catch (err: any) {
    toast.add({
      title: $t('ERRORS.TITLE'),
      description: err?.message || $t('ADMIN.COURSES.UPDATE_ERROR'),
      color: 'error',
    })
  }
}
</script>

<template>
  <UModal v-model:open="open" :title="$t('ADMIN.COURSES.EDIT_COURSE')" :ui="{ wrapper: 'max-w-2xl' }">
    <template #body>
      <UForm
        v-if="course"
        :schema="updateCourseSchema"
        :validate="validateForm"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <div v-if="course.thumbnail" class="pb-4 border-b border-default">
          <img
            :src="course.thumbnail"
            :alt="course.title"
            class="w-full h-32 object-cover rounded-lg"
          >
        </div>

        <UFormField :label="$t('ADMIN.COURSES.TITLE')" name="title" required>
          <UInput v-model="state.title" class="w-full" />
        </UFormField>

        <UFormField :label="$t('ADMIN.COURSES.DESCRIPTION')" name="description" required>
          <UTextarea v-model="state.description" :rows="4" class="w-full" />
        </UFormField>

        <UFormField :label="$t('ADMIN.COURSES.THUMBNAIL')" name="thumbnail" required>
          <div class="space-y-2">
            <UFileUpload
              v-model="thumbnailFile"
              accept="image/*"
              :disabled="uploading"
              :loading="uploading"
            />
            <div v-if="state.thumbnail" class="relative w-full h-48 rounded-lg overflow-hidden border border-default mt-2">
              <img :src="state.thumbnail" alt="Thumbnail preview" class="w-full h-full object-cover">
            </div>
          </div>
        </UFormField>

        <UFormField :label="$t('ADMIN.COURSES.LEVEL')" name="level" required>
          <USelect
            v-model="state.level"
            :items="[
              { label: $t('LEVELS.BEGINNER'), value: 'BEGINNER' },
              { label: $t('LEVELS.INTERMEDIATE'), value: 'INTERMEDIATE' },
              { label: $t('LEVELS.ADVANCED'), value: 'ADVANCED' },
            ]"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="$t('ADMIN.STATUS.COURSES')" name="status">
          <USelect
            v-model="state.status"
            :items="[
              { label: $t('STATUS.COURSE.DRAFT'), value: 'DRAFT' },
              { label: $t('STATUS.COURSE.PUBLISHED'), value: 'PUBLISHED' },
              { label: $t('STATUS.COURSE.ARCHIVED'), value: 'ARCHIVED' },
            ]"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end gap-2 pt-4">
          <UButton
            :label="$t('COMMON.CANCEL')"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            type="submit"
            :label="$t('COMMON.SAVE')"
            color="primary"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
