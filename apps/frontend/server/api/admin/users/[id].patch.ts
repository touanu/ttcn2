import type { SuccessResponseBody, User } from '@shared/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: await translate(event, 'ADMIN.USERS.USER_ID_REQUIRED'),
    })
  }

  const body = await readBody(event)

  // Update user via backend API
  const user = await useAPI<User>(event, `/users/${id}`, {
    method: 'PATCH',
    body,
  })

  return {
    success: true,
    data: user,
    message: await translate(event, 'USERS.UPDATE_SUCCESS'),
  } as SuccessResponseBody<User>
})
