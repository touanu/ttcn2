import type { UserRole } from '@shared/types'

/**
 * Lấy màu tương ứng với vai trò người dùng
 * @param role Vai trò người dùng
 * @returns Màu sắc dưới dạng chuỗi
 */
export function getRoleColor(role: UserRole): 'primary' | 'success' | 'secondary' | 'error' | 'neutral' {
  const colors: Record<UserRole, 'primary' | 'success' | 'secondary' | 'error'> = {
    student: 'primary',
    teacher: 'success',
    admin: 'secondary',
    superadmin: 'error',
  }
  return colors[role] || 'neutral'
}

/**
 * Định dạng ngày tháng theo định dạng địa phương
 * @param date Ngày tháng cần định dạng
 * @param locale Mã ngôn ngữ địa phương, mặc định là 'en-US'
 * @returns Ngày tháng đã được định dạng dưới dạng chuỗi
 */
export function formatDate(date: Date | undefined, locale: string = 'en-US'): string {
  if (!date)
    return '-'
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
