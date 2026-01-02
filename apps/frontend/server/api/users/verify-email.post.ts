import type { ResponseBody, SuccessResponseBody } from '@shared/interfaces'
import { emailVerificationSchema } from '@shared/schemas/user'

export default defineEventHandler(async (event) => {
  const { beApiBaseUrl } = useRuntimeConfig()

  try {
    const { email, otp } = await readValidatedBody(event, emailVerificationSchema.parse)
    await $fetch<ResponseBody>(`${beApiBaseUrl}/users/verify-email`, {
      method: 'POST',
      body: {
        email,
        otp,
      },
    })

    return { success: true, message: 'AUTH.OTP.VERIFICATION_SUCCESS' } as SuccessResponseBody<null>
  }
  catch (error: any) {
    console.error('Xác minh email thất bại:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || await translate(event, 'INTERNAL_SERVER_ERROR'),
      message: error.data?.error?.message
        ? await translate(event, error.data.error.message)
        : await translate(event, 'INTERNAL_SERVER_ERROR'),
    })
  }
})
