import type { LoginCredential, LoginData, ResponseBody, SuccessResponseBody } from '@shared/interfaces'
import { loginUserSchema } from '@shared/schemas/auth'
import { UAParser } from 'ua-parser-js'
import { translate } from '~~/server/utils/translate'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const user: LoginCredential = await readValidatedBody(event, loginUserSchema.parse)

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

    const loginData = res.data as LoginData

    await setUserSession(event, {
      user: loginData.user,
      secure: {
        accessToken: loginData.accessToken.token,
        refreshToken: loginData.refreshToken.token,
        sessionId: loginData.sessionId,
      },
    })

    return { success: true, message: 'AUTH.LOGIN.SUCCESS' } as SuccessResponseBody<null>
  }
  catch (error: any) {
    logger.error('Login error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || await translate(event, 'INTERNAL_SERVER_ERROR'),
      message: error.data?.error?.message
        ? await translate(event, error.data?.error?.message)
        : await translate(event, 'INTERNAL_SERVER_ERROR'),
      data: { errorCode: error.data?.error?.message },
    })
  }
})
