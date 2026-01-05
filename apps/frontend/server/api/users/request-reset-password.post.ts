import type { SuccessResponseBody } from '@shared/interfaces'
import { emailOnlySchema } from '@shared/schemas/user'

export default defineEventHandler(async (event) => {
  const { email } = await readValidatedBody(event, emailOnlySchema.parse)

  await useAPI<undefined>(event, `/users/forgot-password`, {
    method: 'POST',
    body: {
      email,
    },
  })

  return {
    success: true,
    message: await translate(event, 'AUTH.PASSWORD.RESET_EMAIL_SENT'),
  } as SuccessResponseBody<null>
})
