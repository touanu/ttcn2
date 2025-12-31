import type { H3Event } from 'h3'

export async function translate(event: H3Event, rawKeys: string, vars: string[] = []): Promise<string> {
  const t = await useTranslation(event)
  const keys = rawKeys.split(',')
  const translations = keys.map(key => t(key, vars))
  return translations.join(',')
}
