<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  icon?: string
  iconGradientFrom?: string
  iconGradientTo?: string
}>()
</script>

<template>
  <div class="mb-16 text-center">
    <div
      v-if="icon"
      class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full shadow-lg"
      :class="`bg-linear-to-br ${iconGradientFrom || 'from-primary-500'} ${iconGradientTo || 'to-primary-600'}`"
    >
      <UIcon :name="icon" class="h-10 w-10 text-white" />
    </div>
    <h1 class="text-5xl font-bold text-gray-900 dark:text-white">
      {{ title }}
    </h1>
    <p v-if="subtitle" class="mx-auto mt-6 max-w-2xl text-xl text-gray-600 dark:text-gray-400">
      {{ subtitle }}
    </p>
  </div>
</template>
