import type { SuccessResponseBody } from '@shared/interfaces'
import { onlyPasswordResetSchema } from '@shared/schemas/user'

export default defineEventHandler(async (event) => {
  const { token } = event.context.params as { token: string }
  const { newPassword } = await readValidatedBody(event, onlyPasswordResetSchema.parse)
  await useAPI<void>(event, `/users/reset-password/${token}`, {
    method: 'POST',
    body: {
      newPassword,
    },
  })

  return {
    success: true,
    message: await translate(event, 'AUTH.PASSWORD_RESET.SUCCESS'),
  } as SuccessResponseBody<null>
})
