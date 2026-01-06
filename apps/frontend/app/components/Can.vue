<script setup lang="ts">
import type { Permission } from '@shared/constants'

interface Props {
  /**
   * Quyền đơn lẻ cần kiểm tra
   */
  permission?: Permission
  /**
   * Nhiều quyền cần kiểm tra
   */
  permissions?: Permission[]
  /**
   * Nếu true, người dùng phải có TẤT CẢ quyền. Nếu false, chỉ cần có MỘT quyền
   */
  requireAll?: boolean
  /**
   * Nội dung hiển thị khi người dùng không có quyền
   */
  fallback?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  requireAll: false,
  fallback: false,
})

const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

const hasAccess = computed(() => {
  // Check single permission
  if (props.permission) {
    return hasPermission(props.permission)
  }

  // Check multiple permissions
  if (props.permissions && props.permissions.length > 0) {
    return props.requireAll
      ? hasAllPermissions(...props.permissions)
      : hasAnyPermission(...props.permissions)
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
