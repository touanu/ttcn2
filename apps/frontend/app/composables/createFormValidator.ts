import type { FormError } from '@nuxt/ui'
import type { z } from 'zod'

export default function createFormValidator<T>(schema: z.ZodType<T>) {
  const nuxtApp = useNuxtApp()

  return (data: unknown): FormError[] => {
    const errors: FormError[] = []
    const result: z.ZodSafeParseResult<T> = schema.safeParse(data)
    if (!result.success) {
      result.error.issues.forEach((err: z.core.$ZodIssue) => {
        let min: number | undefined
        let max: number | undefined

        if (err.code === 'too_small' && typeof err.minimum === 'number') {
          min = err.minimum
        }

        if (err.code === 'too_big' && typeof err.maximum === 'number') {
          max = err.maximum
        }

        errors.push({
          name: err.path.join('.'),
          message: nuxtApp.$i18n.te(err.message) ? nuxtApp.$i18n.t(err.message, { min, max }) : err.message,
        })
      })
    }

    return errors
  }
}
