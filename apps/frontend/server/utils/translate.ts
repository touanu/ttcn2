import type { H3Event } from 'h3'

/**
 * Dịch nhiều khóa cùng lúc, ngăn cách bằng dấu phẩy
 * @param event - H3 event
 * @param rawKeys - Chuỗi khóa dịch, ngăn cách bằng dấu phẩy
 * @param vars - Mảng biến để thay thế trong chuỗi dịch
 * @returns Chuỗi dịch đã được nối lại, ngăn cách bằng dấu phẩy
 */
export async function translate(event: H3Event, rawKeys: string, vars: string[] = []): Promise<string> {
  const t = await useTranslation(event)
  const keys = rawKeys.split(',')
  const translations = keys.map(key => t(key, vars))
  return translations.join(',')
}
