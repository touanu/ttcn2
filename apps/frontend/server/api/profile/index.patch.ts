import type { UpdateUserDto } from '@shared/schemas/user'
import type { User } from '@shared/types'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: await translate(event, 'AUTH.UNAUTHORIZED'),
    })
  }

  const body = await readBody<UpdateUserDto>(event)

  return await useAPI<User>(event, `/users/${session.user.id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    body,
  })
})
