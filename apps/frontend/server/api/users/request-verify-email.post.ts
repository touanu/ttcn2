import type { ResponseBody, SuccessResponseBody } from '@shared/interfaces'
import { requestVerifyEmailSchema } from '@shared/schemas/user'

export default defineEventHandler(async (event) => {
  const { beApiBaseUrl } = useRuntimeConfig()
  const { email, username } = await readValidatedBody(event, requestVerifyEmailSchema.parse)

  try {
    const res = await $fetch<ResponseBody>(`${beApiBaseUrl}/users/request-verify-email`, {
      method: 'POST',
      body: {
        email,
        username,
      },
    })

    const rqVerifyEmailResponse = res as SuccessResponseBody<{ email: string }>

    return {
      success: true,
      message: 'OTP_SENT_SUCCESS',
      data: { email: rqVerifyEmailResponse.data?.email },
    } as SuccessResponseBody<{ email: string }>
  }
  catch (error: any) {
    console.error('Yêu cầu gửi lại OTP thất bại:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || await translate(event, 'INTERNAL_SERVER_ERROR'),
      message: await translate(event, error.data.error.message),
    })
  }
})
