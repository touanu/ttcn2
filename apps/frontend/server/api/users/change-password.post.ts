import type { SuccessResponseBody } from '@shared/types'
import { changePasswordSchema } from '@shared/schemas/user'

export default defineEventHandler(async (event) => {
  const { currentPassword, newPassword } = await readValidatedBody(event, changePasswordSchema.parse)

  await useAPI<void>(event, `/users/change-password`, {
    method: 'POST',
    body: {
      currentPassword,
      newPassword,
    },
  })

  return {
    success: true,
    message: await translate(event, 'PROFILE.SECURITY.CHANGE_PASSWORD.SUCCESS'),
  } as SuccessResponseBody<undefined>
})
