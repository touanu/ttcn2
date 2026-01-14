import type { AccessTokenPayload, RefreshTokenData, SuccessResponseBody } from '@shared/types'
import type { H3Event } from 'h3'
import jwt from 'jsonwebtoken'

async function refreshAccessToken(
  event: H3Event,
  sessionId: string,
  refreshToken: string,
): Promise<RefreshTokenData | undefined> {
  const res = await useAPI<SuccessResponseBody<RefreshTokenData>>(
    event,
    '/auth/refresh',
    {
      method: 'POST',
      body: {
        sessionId,
        refreshToken,
      },
      ignoreResponseError: true,
    },
  )

  return res?.data as RefreshTokenData
}

export default defineNitroPlugin(() => {
  sessionHooks.hook('fetch', async (session, event) => {
    if (!session || !session.user || !session.secure || !session.secure.accessToken || !session.secure.refreshToken) {
      return
    }

    const { accessTokenSecret } = useRuntimeConfig()
    let payload: AccessTokenPayload
    try {
      payload = jwt.verify(session.secure.accessToken, accessTokenSecret) as AccessTokenPayload

      if (!payload.id)
        throw new Error('AUTH.ACCESS_TOKEN_INVALID')
    }
    catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        const tokenData = await refreshAccessToken(event, session.secure.sessionId, session.secure.refreshToken)
        if (!tokenData) {
          await clearUserSession(event)
          throw createError({ status: 401, message: await translate(event, 'AUTH.UNAUTHORIZED') })
        }

        // Update session with new tokens
        session.secure.accessToken = tokenData.accessToken.token
        session.secure.refreshToken = tokenData.refreshToken.token
        session.secure.sessionId = tokenData.sessionId

        // Update user data with role and permissions from the new token
        const newPayload = jwt.decode(tokenData.accessToken.token) as AccessTokenPayload
        session.user = newPayload

        await replaceUserSession(event, session)
      }
      else {
        logger.error('Xác thực access token thất bại:', error)
        await clearUserSession(event)
        throw createError({ status: 401, message: await translate(event, 'AUTH.UNAUTHORIZED') })
      }
    }
  })
})
