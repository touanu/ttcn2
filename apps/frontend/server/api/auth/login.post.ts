import type { LoginCredential, LoginData, SuccessResponseBody } from '@shared/types'
import { loginUserSchema } from '@shared/schemas/auth'
import { UAParser } from 'ua-parser-js'

export default defineEventHandler(async (event) => {
  const user: LoginCredential = await readValidatedBody(event, loginUserSchema.parse)

  const userAgent = event.node.req.headers['user-agent'] || ''
  const parsedUA = UAParser(userAgent)
  user.info = {
    ipAddress: event.node.req.socket.remoteAddress || event.node.req.socket.localAddress || 'Unknown IP',
    userAgent,
    deviceInfo: `${parsedUA.browser.name || 'Unknown Browser'} on ${parsedUA.os.name || 'Unknown OS'}`,
  }

  const loginData = await useAPI<LoginData>(event, '/auth/login', {
    body: user,
    method: 'POST',
  })

  await setUserSession(event, {
    user: loginData.user,
    secure: {
      accessToken: loginData.accessToken.token,
      refreshToken: loginData.refreshToken.token,
      sessionId: loginData.sessionId,
    },
  })

  return {
    success: true,
    message: await translate(event, 'AUTH.LOGIN.SUCCESS'),
  } as SuccessResponseBody<null>
})
