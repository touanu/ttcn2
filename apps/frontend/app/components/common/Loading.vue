<script setup lang="ts">
defineProps<{
  message?: string
  size?: 'sm' | 'md' | 'lg'
}>()

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12">
    <UIcon
      name="i-heroicons-arrow-path"
      class="animate-spin text-primary-500" :class="[sizeClasses[size || 'md']]"
    />
    <p v-if="message" class="mt-4 text-sm text-gray-600 dark:text-gray-400">
      {{ message }}
    </p>
  </div>
</template>
