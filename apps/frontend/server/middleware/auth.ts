import type { AccessTokenPayload, RefreshTokenData, ResponseBody } from '@shared/interfaces'
import jwt from 'jsonwebtoken'

const appliedPaths = [
  '/api/auth/logout',
]

async function refreshAccessToken(sessionId: string, refreshToken: string): Promise<RefreshTokenData> {
  const { beApiBaseUrl } = useRuntimeConfig()
  try {
    const res = await $fetch<ResponseBody>(`${beApiBaseUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      body: {
        sessionId,
        refreshToken,
      },
    })

    if (!res.success || !res.data) {
      throw new Error(res.message || 'Đã có lỗi xảy ra')
    }

    return res.data as RefreshTokenData
  }
  catch (err) {
    console.error('Làm mới access token thất bại:', err)
    throw createError({ status: 401, message: 'UNAUTHORIZED' })
  }
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  if (url.pathname && !appliedPaths.includes(url.pathname)) {
    return
  }

  const session = await getUserSession(event)
  const { accessTokenSecret } = useRuntimeConfig()

  if (!session || !session.user || !session.secure || !session.secure.accessToken || !session.secure.refreshToken) {
    throw createError({ status: 401, message: 'UNAUTHORIZED' })
  }

  const accessToken = session.secure.accessToken

  let payload: AccessTokenPayload
  try {
    payload = jwt.verify(accessToken, accessTokenSecret) as AccessTokenPayload

    if (!payload.id)
      throw new Error('ACCESS_TOKEN_INVALID')
  }
  catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const tokenData = await refreshAccessToken(session.id, session.secure.refreshToken)
      session.secure.accessToken = tokenData.accessToken.token
      session.secure.refreshToken = tokenData.refreshToken.token
      session.id = tokenData.sessionId
      await setUserSession(event, session)
    }
    else {
      console.error('Xác thực access token thất bại:', error)
      await clearUserSession(event)
      throw createError({ status: 401, message: 'UNAUTHORIZED' })
    }
  }
})
