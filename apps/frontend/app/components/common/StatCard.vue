<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  value: string | number
  color?: 'blue' | 'green' | 'purple' | 'orange'
}>()

const colorClasses = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-500/10',
    icon: 'text-green-600 dark:text-green-400',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    icon: 'text-purple-600 dark:text-purple-400',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    icon: 'text-orange-600 dark:text-orange-400',
  },
}
</script>

<template>
  <UCard>
    <div class="flex items-center gap-4">
      <div class="rounded-lg p-3" :class="colorClasses[color || 'blue'].bg">
        <UIcon :name="icon" class="h-6 w-6" :class="colorClasses[color || 'blue'].icon" />
      </div>
      <div>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ label }}
        </p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ value }}
        </p>
      </div>
    </div>
  </UCard>
</template>
