<script setup lang="ts">
defineProps({
  placeholder: {
    type: String,
    default: 'Search...',
  },
})
</script>

<template>
  <div class="bg-white border h-9 rounded-xl px-2.5 selection:bg-blackA9 selection:color-black flex items-center gap-2 shadow-md">
    <UIcon
      name="i-lucide-search"
      size="sm"
      class="text-muted"
    />
    <input
      id="searchBox"
      class="text-sm text-blue-700 leading-none outline-none flex-1 bg-transparent"
      type="text"
      :placeholder
    >
  </div>
</template>
