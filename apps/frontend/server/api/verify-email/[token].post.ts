import type { SuccessResponseBody } from '@shared/types'

export default defineEventHandler(async (event) => {
  const { token } = event.context.params as { token: string }
  await useAPI<void>(event, `/auth/verify-email/${token}`)

  return {
    success: true,
    message: await translate(event, 'AUTH.VERIFY_EMAIL.SUCCESS'),
  } as SuccessResponseBody<null>
})
