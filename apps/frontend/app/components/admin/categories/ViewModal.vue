<script setup lang="ts">
import type { CourseCategory } from '@shared/types'

const props = defineProps<{
  open?: boolean
  category: CourseCategory | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'edit': [category: CourseCategory]
  'delete': [category: CourseCategory]
}>()

const open = computed({
  get: () => props.open ?? false,
  set: value => emit('update:open', value),
})
</script>

<template>
  <UModal v-model:open="open" :title="$t('ADMIN.CATEGORIES.VIEW_CATEGORY')" :ui="{ wrapper: 'max-w-2xl' }">
    <template v-if="category" #body>
      <div class="space-y-6">
        <!-- Category Name -->
        <div>
          <h3 class="text-lg font-semibold mb-2">
            {{ category.name }}
          </h3>
        </div>

        <!-- Description -->
        <div>
          <h4 class="text-sm font-medium text-muted mb-2">
            {{ $t('ADMIN.CATEGORIES.DESCRIPTION') }}
          </h4>
          <p class="text-sm">
            {{ category.description }}
          </p>
        </div>

        <USeparator />

        <!-- Metadata -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm font-medium text-muted mb-1">
              {{ $t('ADMIN.CATEGORIES.CATEGORY_ID') }}
            </div>
            <div class="text-sm font-mono">
              {{ category._id }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-muted mb-1">
              {{ $t('COMMON.CREATED_AT') }}
            </div>
            <div class="text-sm">
              {{ new Date(category.createdAt).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          :label="$t('COMMON.EDIT')"
          color="primary"
          variant="outline"
          icon="i-heroicons-pencil"
          @click="() => { if (category) emit('edit', category); open = false }"
        />
        <UButton
          :label="$t('COMMON.DELETE')"
          color="error"
          variant="outline"
          icon="i-heroicons-trash"
          @click="() => { if (category) emit('delete', category); open = false }"
        />
      </div>
    </template>
  </UModal>
</template>
