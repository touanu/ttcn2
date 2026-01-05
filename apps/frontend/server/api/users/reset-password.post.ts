import type { SuccessResponseBody } from '@shared/interfaces'
import { passwordResetSchema } from '@shared/schemas/user'

export default defineEventHandler(async (event) => {
  const { email, otp, newPassword } = await readValidatedBody(event, passwordResetSchema.parse)
  await useAPI<undefined>(event, `/users/reset-password`, {
    method: 'POST',
    body: {
      email,
      otp,
      newPassword,
    },
  })

  return {
    success: true,
    message: await translate(event, 'AUTH.PASSWORD_RESET.SUCCESS'),
  } as SuccessResponseBody<null>
})
