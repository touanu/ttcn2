import type { RouteLocationNormalizedGeneric } from 'vue-router'

/**
 * Middleware route để kiểm tra người dùng có phải admin
 * Sử dụng trong trang: definePageMeta({ middleware: ['auth', 'admin'] })
 */
export default defineNuxtRouteMiddleware((to: RouteLocationNormalizedGeneric) => {
  const { isAdmin, isAuthenticated } = usePermissions()

  if (!isAuthenticated.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }

  if (!isAdmin.value) {
    return abortNavigation({
      statusCode: 403,
      message: ('AUTH.PERMISSIONS.ACCESS_DENIED'),
    })
  }
})
