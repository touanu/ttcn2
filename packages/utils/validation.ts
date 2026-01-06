import type { ZodType } from 'zod'
import { preprocess } from 'zod'

/**
 * Biến đổi các chuỗi rỗng thành null trước khi xác thực
 * @param schema
 * @returns ZodTypeAny
 */
export function emptyAsNull<T extends ZodType<unknown, unknown>>(schema: T) {
  return preprocess((val) => {
    if (typeof val === 'string' && val === '') {
      return null
    }
    else {
      return val
    }
  }, schema)
}
