export function getKeyByValue(object: Record<PropertyKey, unknown>, value: unknown) {
  return Object.keys(object).find(key => object[key as PropertyKey] === value)
}
