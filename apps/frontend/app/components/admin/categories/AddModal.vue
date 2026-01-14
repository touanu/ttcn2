<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const props = defineProps<{
  open?: boolean
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

async function onSubmit(event: FormSubmitEvent<CategoryForm>) {
  try {
    await $fetch('/api/admin/categories', {
      method: 'POST',
      body: event.data,
    })

    toast.add({
      title: $t('COMMON.SUCCESS'),
      description: $t('ADMIN.CATEGORIES.CATEGORY_CREATED', { name: event.data.name }),
      color: 'success',
    })

    open.value = false

    Object.assign(state, {
      name: undefined,
      description: undefined,
    })

    await refreshNuxtData()
  }
  catch (err: any) {
    toast.add({
      title: $t('ERRORS.TITLE'),
      description: err?.message || $t('ADMIN.CATEGORIES.CREATE_ERROR'),
      color: 'error',
    })
  }
}
</script>

<template>
  <UModal v-model:open="open" :title="$t('ADMIN.ADD_CATEGORY')" :description="$t('ADMIN.CATEGORIES.ADD_CATEGORY_DESC')">
    <UButton :label="$t('ADMIN.ADD_CATEGORY')" icon="i-lucide-plus" />

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
            :label="$t('COMMON.CREATE')"
            color="primary"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
