<script setup lang="ts">
import type { CourseCategory } from '@shared/types'

const props = defineProps<{
  open?: boolean
  categories: CourseCategory[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'deleted': []
}>()

const open = computed({
  get: () => props.open ?? false,
  set: value => emit('update:open', value),
})

const toast = useToast()
const isDeleting = ref(false)

const displayedCategories = computed(() => {
  return props.categories.slice(0, 5)
})

const remainingCount = computed(() => {
  return Math.max(0, props.categories.length - 5)
})

async function handleDelete() {
  if (props.categories.length === 0)
    return

  isDeleting.value = true

  try {
    await $fetch('/api/admin/categories/bulk-delete', {
      method: 'POST',
      body: {
        ids: props.categories.map(c => c._id),
      },
    })

    toast.add({
      title: $t('COMMON.SUCCESS'),
      description: $t('ADMIN.CATEGORIES.CATEGORIES_DELETED_SUCCESS'),
      color: 'success',
    })

    open.value = false
    emit('deleted')
    await refreshNuxtData()
  }
  catch (err: any) {
    toast.add({
      title: $t('ERRORS.TITLE'),
      description: err?.message || $t('ADMIN.CATEGORIES.DELETE_ERROR'),
      color: 'error',
    })
  }
  finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <UModal v-model:open="open" :title="$t('ADMIN.CATEGORIES.DELETE_MODAL_TITLE')">
    <template #body>
      <div class="space-y-4">
        <p class="text-sm">
          {{ $t('ADMIN.CATEGORIES.DELETE_CONFIRMATION', { count: categories.length }) }}
        </p>

        <div class="rounded-lg border border-default p-4 space-y-2">
          <p class="text-sm font-medium">
            {{ $t('ADMIN.CATEGORIES.CATEGORIES_TO_DELETE') }}
          </p>
          <ul class="text-sm space-y-1">
            <li v-for="category in displayedCategories" :key="category._id" class="flex items-center gap-2">
              <UIcon name="i-heroicons-tag" class="shrink-0" />
              <span class="truncate">{{ category.name }}</span>
            </li>
            <li v-if="remainingCount > 0" class="text-muted">
              {{ $t('ADMIN.CATEGORIES.AND_MORE', { count: remainingCount }) }}
            </li>
          </ul>
        </div>

        <div class="rounded-lg bg-error-50 dark:bg-error-950 border border-error-200 dark:border-error-800 p-4">
          <p class="text-sm text-error-700 dark:text-error-300">
            {{ $t('ADMIN.CATEGORIES.DELETE_WARNING') }}
          </p>
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
          icon="i-heroicons-trash"
          :loading="isDeleting"
          @click="handleDelete"
        />
      </div>
    </template>
  </UModal>
</template>
