<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), {
  fallback: false,
})

/**
 * Component hiển thị nội dung chỉ cho người dùng đã xác thực
 */
const { isAuthenticated } = usePermissions()

interface Props {
  /**
   * Nếu true, hiển thị nội dung khi người dùng CHƯA xác thực (hành vi ngược lại)
   */
  fallback?: boolean
}

const shouldShow = computed(() => {
  return props.fallback ? !isAuthenticated.value : isAuthenticated.value
})
</script>

<template>
  <slot v-if="shouldShow" />
</template>
