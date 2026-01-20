import type { RequestVerifyEmailResponse, SuccessResponseBody, User } from '@shared/types'
import { createUserSchema } from '@shared/schemas/user'

export default defineEventHandler(async (event) => {
  const user: User = await readValidatedBody(event, createUserSchema.parse)

  // Không cho phép đăng ký với vai trò admin hoặc superadmin
  user.role = user.role === 'admin' || user.role === 'superadmin' ? 'student' : user.role

  await useAPI<void>(event, '/register', {
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
    data: { email: res?.data?.email },
  } as RequestVerifyEmailResponse
})
