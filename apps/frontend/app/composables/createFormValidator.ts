import type { FormError } from '@nuxt/ui'
import type { z } from 'zod'

export default function createFormValidator<T>(schema: z.ZodType<T>) {
  const nuxtApp = useNuxtApp()

  return (data: unknown): FormError[] => {
    const errors: FormError[] = []
    const result: z.ZodSafeParseResult<T> = schema.safeParse(data)
    if (!result.success) {
      result.error.issues.forEach((err) => {
        errors.push({
          name: err.path.join('.'),
          message: nuxtApp.$i18n.t(err.message),
        })
      })
    }

    return errors
  }
}
