import type { ResponseBody, SuccessResponseBody } from '@shared/interfaces'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const session = await getUserSession(event)
    const accessToken = session.secure?.accessToken
    const sessionId = session.secure?.sessionId

    if (!session || !session.user || !accessToken || !sessionId) {
      throw createError({ status: 401, message: 'AUTH.UNAUTHORIZED' })
    }

    await $fetch<ResponseBody>(`${config.beApiBaseUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: { sessionId },
    })

    await clearUserSession(event)
    return { success: true, message: 'AUTH.LOGOUT.SUCCESS' } as SuccessResponseBody<null>
  }
  catch (error: any) {
    console.error('Đăng xuất thất bại:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || await translate(event, 'INTERNAL_SERVER_ERROR'),
      message: await translate(event, error.data.error.message),
    })
  }
})
