<script setup lang="ts">
import type { UserRole } from '@shared/types'

interface Props {
  /**
   * Vai trò đơn lẻ cần kiểm tra
   */
  role?: UserRole
  /**
   * Nhiều vai trò cần kiểm tra (người dùng cần có BẤT KỲ vai trò nào)
   */
  roles?: UserRole[]
  /**
   * Nội dung hiển thị khi người dùng không có vai trò
   */
  fallback?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fallback: false,
})

const { hasRole, hasAnyRole } = usePermissions()

const hasAccess = computed(() => {
  // Check single role
  if (props.role) {
    return hasRole(props.role)
  }

  // Check multiple roles
  if (props.roles && props.roles.length > 0) {
    return hasAnyRole(...props.roles)
  }

  return false
})

const shouldShow = computed(() => {
  return props.fallback ? !hasAccess.value : hasAccess.value
})
</script>

<template>
  <slot v-if="shouldShow" />
</template>
