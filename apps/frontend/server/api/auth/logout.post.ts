import type { ResponseBody, SuccessResponseBody } from '@shared/interfaces'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const session = await getUserSession(event)
    const accessToken = session.secure?.accessToken
    const sessionId = session.secure?.sessionId

    if (!session || !session.user || !accessToken || !sessionId) {
      throw createError({ status: 401, message: 'UNAUTHORIZED' })
    }

    const res = await $fetch<ResponseBody>(`${config.beApiBaseUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: { sessionId },
    })

    if (!res.success)
      throw new Error(res.message || 'LOGOUT_FAILED')

    await clearUserSession(event)
    return { success: true, message: 'LOGOUT_SUCCESS' } as SuccessResponseBody<null>
  }
  catch (error) {
    console.error('Đăng xuất thất bại:', error)
    throw createError({
      status: 500,
      message: 'LOGOUT_FAILED',
    })
  }
})
