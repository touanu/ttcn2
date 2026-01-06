import type { AccessTokenPayload, RefreshTokenData, ResponseBody } from '@shared/interfaces'
import type { H3Event } from 'h3'
import jwt from 'jsonwebtoken'

const appliedPaths = [
  '/api/auth/logout',
]

async function refreshAccessToken(
  event: H3Event,
  sessionId: string,
  refreshToken: string,
): Promise<RefreshTokenData> {
  const res = await useAPI<ResponseBody>(event, `/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    body: {
      sessionId,
      refreshToken,
    },
  })

  return res.data as RefreshTokenData
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  if (url.pathname && !appliedPaths.includes(url.pathname)) {
    return
  }

  const session = await getUserSession(event)
  const { accessTokenSecret } = useRuntimeConfig()

  if (!session || !session.user || !session.secure || !session.secure.accessToken || !session.secure.refreshToken) {
    throw createError({ status: 401, message: 'AUTH.UNAUTHORIZED' })
  }

  const accessToken = session.secure.accessToken

  let payload: AccessTokenPayload
  try {
    payload = jwt.verify(accessToken, accessTokenSecret) as AccessTokenPayload

    if (!payload.id)
      throw new Error('AUTH.ACCESS_TOKEN_INVALID')

    // Update user data with role and permissions from JWT
    if (payload.role || payload.permissions) {
      session.user = {
        ...session.user,
        role: payload.role,
        permissions: payload.permissions,
      }
      await setUserSession(event, session)
    }
  }
  catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const tokenData = await refreshAccessToken(event, session.id, session.secure.refreshToken)
      session.secure.accessToken = tokenData.accessToken.token
      session.secure.refreshToken = tokenData.refreshToken.token
      session.id = tokenData.sessionId

      // Update user data with role and permissions from the new token
      const newPayload = jwt.decode(tokenData.accessToken.token) as AccessTokenPayload
      if (newPayload) {
        session.user = {
          ...session.user,
          role: newPayload.role,
          permissions: newPayload.permissions,
        }
      }

      await setUserSession(event, session)
    }
    else {
      logger.error('Xác thực access token thất bại:', error)
      await clearUserSession(event)
      throw createError({ status: 401, message: 'AUTH.UNAUTHORIZED' })
    }
  }
})
