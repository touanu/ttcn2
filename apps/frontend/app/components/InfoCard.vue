<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  value: string
  color?: 'primary' | 'blue' | 'green' | 'purple' | 'orange' | 'red'
}>()

const colorClasses = {
  primary: {
    bg: 'bg-primary-100 dark:bg-primary-900',
    icon: 'text-primary-600 dark:text-primary-400',
  },
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900',
    icon: 'text-green-600 dark:text-green-400',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900',
    icon: 'text-purple-600 dark:text-purple-400',
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900',
    icon: 'text-orange-600 dark:text-orange-400',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900',
    icon: 'text-red-600 dark:text-red-400',
  },
}
</script>

<template>
  <UCard class="shadow-xl transition-all hover:shadow-2xl">
    <div class="flex items-start gap-4">
      <div class="rounded-lg p-3" :class="colorClasses[color || 'primary'].bg">
        <UIcon :name="icon" class="h-6 w-6" :class="colorClasses[color || 'primary'].icon" />
      </div>
      <div>
        <h4 class="font-semibold text-gray-900 dark:text-white">
          {{ title }}
        </h4>
        <p class="mt-1 text-gray-600 dark:text-gray-400">
          {{ value }}
        </p>
      </div>
    </div>
  </UCard>
</template>
