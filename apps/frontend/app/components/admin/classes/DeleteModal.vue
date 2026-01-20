<script setup lang="ts">
import type { Class } from '@shared/types'

const props = defineProps<{
  open?: boolean
  classes: Class[]
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'deleted': []
}>()

const { $api } = useNuxtApp()
const open = computed({
  get: () => props.open ?? false,
  set: value => emit('update:open', value),
})

const toast = useToast()
const isDeleting = ref(false)

const displayedClasses = computed(() => {
  return props.classes.slice(0, 5)
})

const remainingCount = computed(() => {
  return Math.max(0, props.classes.length - 5)
})

async function handleDelete() {
  if (props.classes.length === 0)
    return

  isDeleting.value = true

  try {
    await $api('/api/admin/classes/bulk-delete', {
      method: 'POST',
      body: {
        ids: props.classes.map(c => c._id),
      },
    })

    open.value = false
    emit('deleted')
    await refreshNuxtData()
  }
  catch (err: any) {
    toast.add({
      title: $t('ERRORS.TITLE'),
      description: err?.message || $t('ADMIN.CLASSES.DELETE_ERROR'),
      color: 'error',
    })
  }
  finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <UModal v-model:open="open" :title="$t('ADMIN.CLASSES.DELETE_MODAL_TITLE')">
    <template #body>
      <div class="space-y-4">
        <p class="text-sm">
          {{ $t('ADMIN.CLASSES.DELETE_CONFIRMATION', { count: classes.length }) }}
        </p>

        <div class="rounded-lg border border-default p-4 space-y-2">
          <p class="text-sm font-medium">
            {{ $t('ADMIN.CLASSES.CLASSES_TO_DELETE') }}
          </p>
          <ul class="text-sm space-y-1">
            <li v-for="classItem in displayedClasses" :key="classItem._id" class="flex items-center gap-2">
              <UIcon name="i-heroicons-user-group" class="shrink-0" />
              <span class="truncate">{{ classItem.name }}</span>
            </li>
            <li v-if="remainingCount > 0" class="text-muted">
              {{ $t('ADMIN.CLASSES.AND_MORE', { count: remainingCount }) }}
            </li>
          </ul>
        </div>

        <div class="rounded-lg bg-error-50 dark:bg-error-950 border border-error-200 dark:border-error-800 p-4">
          <p class="text-sm text-error-700 dark:text-error-300">
            {{ $t('ADMIN.CLASSES.DELETE_WARNING') }}
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
