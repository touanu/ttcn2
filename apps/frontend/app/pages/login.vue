<script setup lang="ts">
definePageMeta({
  seo: false,
  title: 'Đăng nhập',
})

const { loggedIn } = useUserSession()

onMounted(async () => {
  if (loggedIn)
    await navigateTo('/')
})
</script>

<template>
  <div class="hidden">
    <AuthModal :open="!loggedIn" />
  </div>
</template>
