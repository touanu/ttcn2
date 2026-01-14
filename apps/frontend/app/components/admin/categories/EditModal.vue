<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CourseCategory } from '@shared/types'
import { z } from 'zod'

const props = defineProps<{
  open?: boolean
  category: CourseCategory | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const open = computed({
  get: () => props.open ?? false,
  set: value => emit('update:open', value),
})

const categorySchema = z.object({
  name: z.string().min(1, 'FORMS.CATEGORY.NAME_REQUIRED').max(100, 'FORMS.CATEGORY.NAME_MAX_LENGTH'),
  description: z.string().min(1, 'FORMS.CATEGORY.DESCRIPTION_REQUIRED'),
})

type CategoryForm = z.infer<typeof categorySchema>

const state = reactive<Partial<CategoryForm>>({
  name: undefined,
  description: undefined,
})

const toast = useToast()
const validateForm = createFormValidator(categorySchema)

watch(() => props.category, (category) => {
  if (category) {
    state.name = category.name
    state.description = category.description
  }
}, { immediate: true })

async function onSubmit(event: FormSubmitEvent<CategoryForm>) {
  if (!props.category?._id)
    return

  try {
    await $fetch(`/api/admin/categories/${props.category._id}`, {
      method: 'PATCH',
      body: event.data,
    })

    toast.add({
      title: $t('COMMON.SUCCESS'),
      description: $t('ADMIN.CATEGORIES.CATEGORY_UPDATED'),
      color: 'success',
    })

    open.value = false
    await refreshNuxtData()
  }
  catch (err: any) {
    toast.add({
      title: $t('ERRORS.TITLE'),
      description: err?.message || $t('ADMIN.CATEGORIES.UPDATE_ERROR'),
      color: 'error',
    })
  }
}
</script>

<template>
  <UModal v-model:open="open" :title="$t('ADMIN.CATEGORIES.EDIT_CATEGORY')">
    <template #body>
      <UForm
        :schema="categorySchema"
        :validate="validateForm"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField :label="$t('ADMIN.CATEGORIES.NAME')" name="name" required>
          <UInput v-model="state.name" :placeholder="$t('ADMIN.CATEGORIES.NAME_PLACEHOLDER')" class="w-full" />
        </UFormField>

        <UFormField :label="$t('ADMIN.CATEGORIES.DESCRIPTION')" name="description" required>
          <UTextarea v-model="state.description" :placeholder="$t('ADMIN.CATEGORIES.DESCRIPTION_PLACEHOLDER')" :rows="4" class="w-full" />
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
            :label="$t('COMMON.SAVE')"
            color="primary"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
