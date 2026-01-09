import type { SuccessResponseBody } from '@shared/types'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: await translate(event, 'ADMIN.USERS.USER_ID_REQUIRED'),
    })
  }

  // Delete user via backend API
  await useAPI<void>(event, `/users/${id}`, {
    method: 'DELETE',
  })

  return {
    success: true,
    message: await translate(event, 'ADMIN.USERS.USER_DELETED'),
  } as SuccessResponseBody<null>
})
