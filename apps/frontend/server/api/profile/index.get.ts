import type { User } from '@shared/interfaces'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: await translate(event, 'AUTH.UNAUTHORIZED'),
    })
  }

  return await useAPI<User>(event, `/users/${session.user.id}`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  })
})
