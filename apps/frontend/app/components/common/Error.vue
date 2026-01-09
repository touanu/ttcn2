<script setup lang="ts">
defineProps<{
  title?: string
  message?: string
  retry?: () => void
}>()
</script>

<template>
  <div class="py-8">
    <UAlert
      color="error"
      variant="subtle"
      icon="i-heroicons-exclamation-triangle"
      :title="title || $t('PROFILE.ERROR.FETCH_FAILED')"
      :description="message"
    />
    <div v-if="retry" class="mt-4 flex justify-center">
      <UButton
        color="primary"
        @click="retry"
      >
        {{ $t('COMMON.RETRY') }}
      </UButton>
    </div>
  </div>
</template>
