<script setup lang="ts">
definePageMeta({
  seo: false,
  title: 'Đăng nhập',
})
</script>

<template>
  <div class="hidden">
    <AuthModal :open="true" />
  </div>
</template>
