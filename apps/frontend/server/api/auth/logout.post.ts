import type { SuccessResponseBody } from '@shared/types'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  const accessToken = session.secure?.accessToken
  const sessionId = session.secure?.sessionId

  if (!session || !session.user || !accessToken || !sessionId) {
    throw createError({ status: 401, message: 'AUTH.UNAUTHORIZED' })
  }

  await useAPI<undefined>(event, '/auth/logout', {
    method: 'POST',
    body: { sessionId },
  })

  await clearUserSession(event)
  return { success: true } as SuccessResponseBody<null>
})
