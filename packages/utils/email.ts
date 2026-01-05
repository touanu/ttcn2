import { emailOnlySchema } from '@shared/schemas'

/**
 * Ẩn một phần địa chỉ email để bảo vệ thông tin cá nhân.
 * @param email Địa chỉ email cần ẩn
 * @returns Địa chỉ email đã ẩn
 */
export function hideRealEmailAddress(email: string): string {
  const result = emailOnlySchema.parse({ email })
  if (!result.email) {
    throw new Error('Invalid email format')
  }

  const [localPart, domain] = email.split('@')

  // Satisfy type-checker
  if (!localPart || !domain) {
    throw new Error('Invalid email format')
  }

  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`
  }

  const visibleChars = Math.ceil(localPart.length / 3)
  const hiddenChars = localPart.length - visibleChars * 2
  return `${localPart.slice(0, visibleChars)}${'*'.repeat(hiddenChars)}${localPart.slice(-visibleChars)}@${domain}`
}
