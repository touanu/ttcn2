import type { LoginCredential, LoginData, ResponseBody, SuccessResponseBody } from '@shared/interfaces'
import { loginSchema } from '#shared/schemas/auth.schema'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const user: LoginCredential = await readValidatedBody(event, loginSchema.parse)
  user.info = {
    ipAddress: event.node.req.socket.remoteAddress || undefined,
    userAgent: event.node.req.headers['user-agent'],
    deviceInfo: event.node.req.headers['sec-ch-ua-mobile']?.toString(),
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
      accessToken: loginData.accessToken.token,
    })

    setCookie(event, 'refreshToken', loginData.refreshToken.token, {
      httpOnly: true,
      maxAge: loginData.refreshToken.expiresIn,
    })

    setResponseStatus(event, 200)
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
