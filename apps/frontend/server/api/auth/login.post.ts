import type { LoginCredential, LoginData, ResponseBody, SuccessResponseBody } from '@shared/interfaces'
import { loginSchema } from '#shared/schemas/auth.schema'
import { UAParser } from 'ua-parser-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const user: LoginCredential = await readValidatedBody(event, loginSchema.parse)

  const userAgent = event.node.req.headers['user-agent'] || ''
  const parsedUA = UAParser(userAgent)
  user.info = {
    ipAddress: event.node.req.socket.remoteAddress || event.node.req.socket.localAddress || 'Unknown IP',
    userAgent,
    deviceInfo: `${parsedUA.browser.name || 'Unknown Browser'} on ${parsedUA.os.name || 'Unknown OS'}`,
  }

  try {
    const res = await $fetch<ResponseBody>(`${config.beApiBaseUrl}/auth/login`, {
      method: 'POST',
      body: user,
    })

    if (!res.success) {
      throw new Error(res.message || 'LOGIN_FAILED')
    }

    const loginData = res.data as LoginData

    await setUserSession(event, {
      user: loginData.user,
      secure: {
        accessToken: loginData.accessToken.token,
        refreshToken: loginData.refreshToken.token,
        sessionId: loginData.sessionId,
      },
    })

    return { success: true, message: 'LOGIN_SUCCESS' } as SuccessResponseBody<null>
  }
  catch (error) {
    console.error('Đăng nhập thất bại:', error)
    throw createError({
      status: 401,
      message: 'BAD_CREDENTIALS',
    })
  }
})
