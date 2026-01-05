<script setup lang="ts">
defineProps({
  placeholder: {
    type: String,
    default: '',
  },

  buttonText: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="flex border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
    <input
      type="text"
      class="outline-none w-full text-sm"
      :placeholder="placeholder"
    >
    <button class="bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm p-1 min-w-1/3">
      {{ buttonText }}
    </button>
  </div>
</template>
