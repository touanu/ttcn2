<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CreateCourseDto } from '@shared/schemas'
import type { Media } from '@shared/types'
import { createCourseSchema } from '@shared/schemas'

const { $api } = useNuxtApp()
const open = ref(false)

const state = reactive<Partial<CreateCourseDto>>({
  title: undefined,
  description: undefined,
  thumbnail: undefined,
})

const thumbnailFile = ref<File | null>(null)
const uploading = ref(false)
const validateForm = createFormValidator(createCourseSchema)

watch(thumbnailFile, (file) => {
  if (file) {
    handleFileChange(file)
  }
})

async function handleFileChange(file: File) {
  uploading.value = true

  const formData = new FormData()
  formData.append('file', file)

  const image = await $api<Media>('/api/media/upload', {
    method: 'POST',
    body: formData,
    ignoreResponseError: true,
  })

  if (image && image.url) {
    state.thumbnail = image.url
  }
  else {
    thumbnailFile.value = null
    state.thumbnail = undefined
  }

  uploading.value = false
}

async function onSubmit(event: FormSubmitEvent<CreateCourseDto>) {
  await $api('/api/admin/courses', {
    method: 'POST',
    body: event.data,
  })

  // Reset form
  Object.assign(state, {
    title: undefined,
    description: undefined,
    thumbnail: undefined,
  })
  thumbnailFile.value = null

  // Refresh the courses list
  await refreshNuxtData()
  open.value = false
}
</script>

<template>
  <UModal v-model:open="open" :title="$t('ADMIN.ADD_COURSE')" :description="$t('ADMIN.COURSES.ADD_COURSE_DESC')">
    <UButton :label="$t('ADMIN.ADD_COURSE')" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="createCourseSchema"
        :validate="validateForm"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
        @error="(event) => console.log(event)"
      >
        <UFormField :label="$t('ADMIN.COURSES.TITLE')" name="title" required>
          <UInput v-model="state.title" :placeholder="$t('ADMIN.COURSES.TITLE_PLACEHOLDER')" class="w-full" />
        </UFormField>

        <UFormField :label="$t('ADMIN.COURSES.DESCRIPTION')" name="description" required>
          <UTextarea v-model="state.description" :placeholder="$t('ADMIN.COURSES.DESCRIPTION_PLACEHOLDER')" :rows="4" class="w-full" />
        </UFormField>

        <UFormField :label="$t('ADMIN.COURSES.THUMBNAIL')" name="thumbnail" required>
          <div class="space-y-2">
            <UFileUpload
              v-model="thumbnailFile"
              accept="image/*"
              :disabled="uploading"
              :loading="uploading"
              class="min-h-48"
              highlight
              :label="$t('MEDIA.LABEL')"
              :description="$t('MEDIA.DESCRIPTION.IMG', { max: '2' })"
            />
            <!-- <div v-if="state.thumbnail" class="relative w-full h-48 rounded-lg overflow-hidden border border-default mt-2">
              <img :src="state.thumbnail" alt="Thumbnail preview" class="w-full h-full object-cover">
            </div> -->
          </div>
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            :label="$t('COMMON.CREATE')"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
