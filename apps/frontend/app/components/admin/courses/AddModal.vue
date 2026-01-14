<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CreateCourseDto } from '@shared/schemas'
import type { CourseCategory } from '@shared/types'
import { createCourseSchema } from '@shared/schemas'

const open = ref(false)

const state = reactive<Partial<CreateCourseDto>>({
  title: undefined,
  description: undefined,
  thumbnail: undefined,
  categoryId: undefined,
  level: 'BEGINNER',
  lessonIds: [],
})

const thumbnailFile = ref<File | null>(null)
const uploading = ref(false)

const toast = useToast()
const validateForm = createFormValidator(createCourseSchema)

// Fetch categories
const { data: categories } = await useFetch<CourseCategory[]>('/api/categories')

const categoryOptions = computed(() => {
  return categories.value?.map(cat => ({
    label: cat.name,
    value: cat._id!,
  })) || []
})

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
    state.thumbnail = undefined
  }
  finally {
    uploading.value = false
  }
}

async function onSubmit(event: FormSubmitEvent<CreateCourseDto>) {
  try {
    await $fetch('/api/admin/courses', {
      method: 'POST',
      body: event.data,
    })

    toast.add({
      title: $t('COMMON.SUCCESS'),
      description: $t('ADMIN.COURSES.COURSE_CREATED', { title: event.data.title }),
      color: 'success',
    })

    open.value = false

    // Reset form
    Object.assign(state, {
      title: undefined,
      description: undefined,
      thumbnail: undefined,
      categoryId: undefined,
      level: 'BEGINNER',
      lessonIds: [],
    })
    thumbnailFile.value = null

    // Refresh the courses list
    await refreshNuxtData()
  }
  catch (err: any) {
    toast.add({
      title: $t('ERRORS.TITLE'),
      description: err?.message || $t('ADMIN.COURSES.CREATE_ERROR'),
      color: 'error',
    })
  }
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
      >
        <UFormField :label="$t('ADMIN.COURSES.TITLE')" name="title" required>
          <UInput v-model="state.title" :placeholder="$t('ADMIN.COURSES.TITLE_PLACEHOLDER')" class="w-full" />
        </UFormField>

        <UFormField :label="$t('ADMIN.COURSES.DESCRIPTION')" name="description" required>
          <UTextarea v-model="state.description" :placeholder="$t('ADMIN.COURSES.DESCRIPTION_PLACEHOLDER')" :rows="4" class="w-full" />
        </UFormField>

        <UFormField :label="$t('ADMIN.COURSES.CATEGORY')" name="categoryId" required>
          <USelect
            v-model="state.categoryId"
            :items="categoryOptions"
            :placeholder="$t('ADMIN.COURSES.SELECT_CATEGORY')"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="$t('ADMIN.COURSES.THUMBNAIL')" name="thumbnail" required>
          <div class="space-y-2">
            <UFileUpload
              v-model="thumbnailFile"
              accept="image/*"
              :disabled="uploading"
              :loading="uploading"
            />
            <!-- <div v-if="state.thumbnail" class="relative w-full h-48 rounded-lg overflow-hidden border border-default mt-2">
              <img :src="state.thumbnail" alt="Thumbnail preview" class="w-full h-full object-cover">
            </div> -->
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

        <div class="flex justify-end gap-2">
          <UButton
            :label="$t('COMMON.CANCEL')"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            type="submit"
            :label="$t('COMMON.CREATE')"
            color="primary"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
