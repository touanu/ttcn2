import { z } from 'zod'

/**
 * Biến đổi các chuỗi rỗng thành null trước khi xác thực
 * @param schema
 * @returns ZodTypeAny
 */
export function emptyAsNull<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((val) => {
    if (typeof val === 'string' && val === '') {
      return null
    }
    else {
      return val
    }
  }, schema)
}
