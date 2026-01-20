<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Course, Media } from '@shared/types'
import { updateCourseSchema } from '@shared/schemas'

const props = defineProps<{
  course: Course | null
}>()

const emit = defineEmits<{
  updated: []
}>()

const { $api } = useNuxtApp()
const open = defineModel<boolean>('open', { required: true })
const validateForm = createFormValidator(updateCourseSchema)

const thumbnailFile = ref<File | null>(null)
const uploading = ref(false)

const state = reactive<Partial<Course>>({
  title: '',
  description: '',
  thumbnail: '',
})

watch(() => props.course, (newCourse) => {
  if (newCourse) {
    state.title = newCourse.title
    state.description = newCourse.description
    state.thumbnail = newCourse.thumbnail
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

  const formData = new FormData()
  formData.append('file', file)

  const data = await $api<Media>('/api/media/upload', {
    method: 'POST',
    body: formData,
  })

  if (data && data.url) {
    state.thumbnail = data.url
  }
  else {
    thumbnailFile.value = null
  }

  uploading.value = false
}

async function onSubmit(event: FormSubmitEvent<Partial<Course>>) {
  if (!props.course?._id)
    return

  await $api(`/api/admin/courses/${props.course._id}`, {
    method: 'PATCH',
    body: event.data,
  })

  open.value = false
  emit('updated')

  // Refresh the courses list
  await refreshNuxtData()
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
          </div>
        </UFormField>

        <div class="flex justify-end gap-2 pt-4">
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
