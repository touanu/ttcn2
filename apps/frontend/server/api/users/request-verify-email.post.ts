import type { SuccessResponseBody } from '@shared/interfaces'
import { requestVerifyEmailSchema } from '@shared/schemas/user'

export default defineEventHandler(async (event) => {
  const { email, username } = await readValidatedBody(event, requestVerifyEmailSchema.parse)

  const rqVerifyEmailResponse = await useAPI<{ email: string }>(
    event,
    `/users/request-verify-email`,
    {
      method: 'POST',
      body: {
        email,
        username,
      },
    },
  )

  return {
    success: true,
    message: await translate(event, 'AUTH.OTP.RESEND_SUCCESS'),
    data: { email: rqVerifyEmailResponse.email },
  } as SuccessResponseBody<{ email: string }>
})
