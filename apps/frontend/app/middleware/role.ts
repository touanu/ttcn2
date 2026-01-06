import type { UserRole } from '@shared/types'

/**
 * Middleware route để kiểm tra vai trò người dùng
 * Sử dụng trong trang: definePageMeta({ middleware: ['auth', 'role'], role: 'admin' })
 * hoặc: definePageMeta({ middleware: ['auth', 'role'], roles: ['admin', 'teacher'] })
 */
export default defineNuxtRouteMiddleware((to) => {
  const { hasRole, hasAnyRole, isAuthenticated } = usePermissions()

  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  // Check for single role
  const requiredRole = to.meta.role as UserRole | undefined
  if (requiredRole && !hasRole(requiredRole)) {
    return abortNavigation({
      statusCode: 403,
      message: 'AUTH.PERMISSIONS.ACCESS_DENIED',
    })
  }

  // Check for multiple roles (any of them)
  const requiredRoles = to.meta.roles as UserRole[] | undefined
  if (requiredRoles && requiredRoles.length > 0 && !hasAnyRole(...requiredRoles)) {
    return abortNavigation({
      statusCode: 403,
      message: 'AUTH.PERMISSIONS.ACCESS_DENIED',
    })
  }
})
