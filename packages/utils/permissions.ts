import type { Permission } from '@shared/constants'
import { ROLE_PERMISSIONS } from '@shared/constants'

/**
 * Lấy danh sách quyền của một vai trò người dùng
 */
export function getRolePermissions(role: string): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * Kiểm tra xem vai trò có quyền cụ thể hay không
 */
export function roleHasPermission(role: string, permission: Permission): boolean {
  const permissions = getRolePermissions(role)
  return permissions.includes(permission)
}

/**
 * Kiểm tra xem vai trò có bất kỳ quyền nào trong danh sách hay không
 */
export function roleHasAnyPermission(role: string, permissions: Permission[]): boolean {
  const rolePermissions = getRolePermissions(role)
  return permissions.some(permission => rolePermissions.includes(permission))
}

/**
 * Kiểm tra xem vai trò có tất cả các quyền trong danh sách hay không
 */
export function roleHasAllPermissions(role: string, permissions: Permission[]): boolean {
  const rolePermissions = getRolePermissions(role)
  return permissions.every(permission => rolePermissions.includes(permission))
}
