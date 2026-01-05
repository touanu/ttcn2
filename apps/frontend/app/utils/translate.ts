/**
 * Lấy phần dịch đầu tiên từ chuỗi dịch có định dạng "Dịch 1, Dịch 2, Dịch 3"
 * @param translatedString - Chuỗi dịch
 * @returns Phần dịch đầu tiên
 */
export function getFirstTranslation(translatedString?: string): string {
  if (!translatedString)
    return ''

  const parts = translatedString.split(',')
  return parts[0] || translatedString
}
