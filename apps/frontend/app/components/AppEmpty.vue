<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  icon?: string
  actionLabel?: string
  actionTo?: string
}>()
</script>

<template>
  <UEmpty
    :icon="icon || 'i-heroicons-inbox'"
    :label="title"
    :description="description"
  >
    <template v-if="actionLabel && actionTo" #default>
      <UButton
        :to="actionTo"
        color="primary"
      >
        {{ actionLabel }}
      </UButton>
    </template>
  </UEmpty>
</template>
