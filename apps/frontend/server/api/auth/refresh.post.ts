import type { SecureSessionData, User, UserSession } from '#auth-utils'
import type { AccessTokenPayload, RefreshTokenData, SuccessResponseBody } from '@shared/types'
import type { H3Event } from 'h3'
import jwt from 'jsonwebtoken'

async function requestNewToken(
  event: H3Event,
  sessionId: string,
  refreshToken: string,
): Promise<RefreshTokenData | undefined> {
  const { beApiBaseUrl } = useRuntimeConfig()
  try {
    const res = await $fetch<SuccessResponseBody<RefreshTokenData>>(`${beApiBaseUrl}/auth/refresh`, {
      method: 'POST',
      body: {
        sessionId,
        refreshToken,
      },
    })
    return res?.data
  }
  catch (error: any) {
    console.error(`Error code:`, error.data?.error?.message, `\nOn requestNewToken: `, error)

    if (error.data?.error?.message === 'AUTH.INVALID_REFRESH_TOKEN')
      return

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.data?.error?.message
        ? await translate(event, error.data.error.message)
        : (error.statusMessage || await translate(event, 'INTERNAL_SERVER_ERROR')),
      data: { errorCode: error.data?.error?.message },
    })
  }
}

/**
 * Lấy dữ liệu token mới bằng cách sử dụng refresh token.
 * @param session Phiên làm việc của người dùng hiện tại.
 * @param event Sự kiện H3 hiện tại.
 * @returns Phiên làm việc của người dùng đã được cập nhật với token mới.
 */
async function refreshToken(
  session: UserSession,
  event: H3Event,
): Promise<{ secure: SecureSessionData, user: User } | null> {
  if (!session || !session.user || !session.secure || !session.secure.accessToken || !session.secure.refreshToken)
    return null

  const tokenData = await requestNewToken(event, session.secure.sessionId, session.secure.refreshToken)
  if (!tokenData)
    return null

  return {
    secure: {
      accessToken: tokenData.accessToken.token,
      refreshToken: tokenData.refreshToken.token,
      sessionId: tokenData.sessionId,
    } as SecureSessionData,
    user: jwt.decode(tokenData.accessToken.token) as User,
  }
}

export default defineEventHandler(async (event) => {
  const { accessTokenSecret } = useRuntimeConfig()
  const session = await getUserSession(event)

  if (!session.secure) {
    await clearUserSession(event)
    throw createError({
      status: 401,
      message: await translate(event, 'AUTH.UNAUTHORIZED'),
    })
  }

  try {
    jwt.verify(session.secure.accessToken, accessTokenSecret) as AccessTokenPayload
    return { success: true } as SuccessResponseBody<undefined>
  }
  catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const newSession = await refreshToken(session, event)
      if (!newSession) {
        await clearUserSession(event)
        throw createError({ status: 401, message: await translate(event, 'AUTH.UNAUTHORIZED') })
      }

      await setUserSession(event, { ...newSession })

      return { success: true } as SuccessResponseBody<undefined>
    }
    else {
      console.error('Xác thực access token thất bại:', error)
      await clearUserSession(event)
      throw createError({ status: 401, message: await translate(event, 'AUTH.UNAUTHORIZED') })
    }
  }
})
