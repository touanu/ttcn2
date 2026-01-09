import type { SuccessResponseBody, User } from '@shared/types'
import { createUserWithRoleSchema } from '@shared/schemas'

export default defineEventHandler(async (event) => {
  // Validate request body
  const body = await readValidatedBody(event, createUserWithRoleSchema.parse)

  // Create user via backend API
  const user = await useAPI<User>(event, '/users', {
    method: 'POST',
    body,
  })

  return {
    success: true,
    message: await translate(event, 'ADMIN.USERS.USER_CREATED', [user.fullName]),
    data: user,
  } as SuccessResponseBody<User>
})
