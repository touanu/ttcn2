import type { RequestVerifyEmailResponse, ResponseBody, SuccessResponseBody, User } from '@shared/interfaces'
import { createUserSchema } from '@shared/schemas/user'
import { translate } from '~~/server/utils/translate'

export default defineEventHandler(async (event) => {
  const { beApiBaseUrl } = useRuntimeConfig()
  const user: User = await readValidatedBody(event, createUserSchema.parse)

  try {
    await $fetch<ResponseBody>(`${beApiBaseUrl}/users`, {
      method: 'POST',
      body: user,
    })

    const res = await $fetch<ResponseBody>(`${beApiBaseUrl}/users/request-verify-email`, {
      method: 'POST',
      body: {
        email: user.email,
      },
    })

    const rqVerifyEmailResponse = res as SuccessResponseBody<{ email: string }>

    return {
      success: true,
      message: 'REGISTER_SUCCESS',
      data: { email: rqVerifyEmailResponse.data?.email },
    } as RequestVerifyEmailResponse
  }
  catch (error: any) {
    logger.error('Login error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || await translate(event, 'INTERNAL_SERVER_ERROR'),
      message: await translate(event, error.data.error.message),
    })
  }
})
