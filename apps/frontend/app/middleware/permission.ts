import type { Permission } from '@shared/constants'

/**
 * Middleware route để kiểm tra quyền của người dùng
 * Sử dụng trong trang: definePageMeta({ middleware: ['auth', 'permission'], permission: 'user:write' })
 * hoặc: definePageMeta({ middleware: ['auth', 'permission'], permissions: ['user:write', 'course:write'], requireAll: true })
 */
export default defineNuxtRouteMiddleware((to) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isAuthenticated } = usePermissions()

  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  // Check for single permission
  const requiredPermission = to.meta.permission as Permission | undefined
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return abortNavigation({
      statusCode: 403,
      message: $t('AUTH.PERMISSIONS.ACCESS_DENIED'),
    })
  }

  // Check for multiple permissions
  const requiredPermissions = to.meta.permissions as Permission[] | undefined
  const requireAll = to.meta.requireAll as boolean | undefined

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(...requiredPermissions)
      : hasAnyPermission(...requiredPermissions)

    if (!hasAccess) {
      return abortNavigation({
        statusCode: 403,
        message: $t('AUTH.PERMISSIONS.ACCESS_DENIED'),
      })
    }
  }
})
