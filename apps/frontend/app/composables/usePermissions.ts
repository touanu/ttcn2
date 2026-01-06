import type { Permission } from '@shared/constants'
import type { UserRole } from '@shared/types'

/**
 * Composable để quản lý quyền người dùng trong Vue components
 * Cung cấp truy cập reactive đến vai trò và kiểm tra quyền của người dùng
 * @returns Các thuộc tính và phương thức liên quan đến quyền người dùng
 */
export function usePermissions() {
  const { user, loggedIn, clear } = useUserSession()

  const userRole = computed<UserRole>(() => {
    return (user.value?.role as UserRole) || 'student'
  })

  const permissions = computed<Permission[]>(() => {
    return (user.value?.permissions as Permission[]) || []
  })

  const isAuthenticated = computed(() => loggedIn.value)

  /**
   * Kiểm tra người dùng có quyền cụ thể hay không
   */
  const hasPermission = (permission: Permission): boolean => {
    return permissions.value.includes(permission)
  }

  /**
   * Kiểm tra người dùng có bất kỳ quyền nào trong danh sách
   */
  const hasAnyPermission = (...requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.some(permission => permissions.value.includes(permission))
  }

  /**
   * Kiểm tra người dùng có tất cả các quyền trong danh sách
   */
  const hasAllPermissions = (...requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.every(permission => permissions.value.includes(permission))
  }

  /**
   * Kiểm tra người dùng có vai trò cụ thể hay không
   */
  const hasRole = (role: UserRole): boolean => {
    return userRole.value === role
  }

  /**
   * Kiểm tra người dùng có bất kỳ vai trò nào trong danh sách
   */
  const hasAnyRole = (...roles: UserRole[]): boolean => {
    return roles.includes(userRole.value)
  }

  /**
   * Kiểm tra người dùng có phải admin hoặc superadmin
   */
  const isAdmin = computed(() => {
    return hasAnyRole('admin', 'superadmin')
  })

  /**
   * Kiểm tra người dùng có phải giáo viên
   */
  const isTeacher = computed(() => {
    return hasRole('teacher')
  })

  /**
   * Kiểm tra người dùng có phải học viên
   */
  const isStudent = computed(() => {
    return hasRole('student')
  })

  return {
    user,
    userRole,
    permissions,
    isAuthenticated,
    loggedIn,
    clear,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isAdmin,
    isTeacher,
    isStudent,
  }
}
