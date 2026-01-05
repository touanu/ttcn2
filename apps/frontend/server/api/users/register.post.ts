import type { RequestVerifyEmailResponse, SuccessResponseBody, User } from '@shared/interfaces'
import { createUserSchema } from '@shared/schemas/user'

export default defineEventHandler(async (event) => {
  const user: User = await readValidatedBody(event, createUserSchema.parse)

  await useAPI<void>(event, '/users', {
    method: 'POST',
    body: user,
  })

  const res = await useAPI<SuccessResponseBody<{ email: string }>>(
    event,
    '/users/request-verify-email',
    {
      method: 'POST',
      body: {
        email: user.email,
      },
    },
  )

  return {
    success: true,
    message: await translate(event, 'AUTH.REGISTER.SUCCESS'),
    data: { email: res.data?.email },
  } as RequestVerifyEmailResponse
})
