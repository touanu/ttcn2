import type { SuccessResponseBody } from '@shared/types'
import { emailVerificationSchema } from '@shared/schemas/user'

export default defineEventHandler(async (event) => {
  const { email, otp } = await readValidatedBody(event, emailVerificationSchema.parse)
  await useAPI<undefined>(event, `/users/verify-email`, {
    method: 'POST',
    body: {
      email,
      otp,
    },
  })

  return {
    success: true,
    message: await translate(event, 'AUTH.OTP.VERIFICATION_SUCCESS'),
  } as SuccessResponseBody<null>
})
