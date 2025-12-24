import type { ResponseBody, User } from '@shared/interfaces'
import { registerSchema } from '#shared/schemas/auth.schema'

export default defineEventHandler(async (event) => {
  const user: User = await readValidatedBody(event, registerSchema.parse)

  try {
    const res = await $fetch<ResponseBody>('/api/auth/register', {
      method: 'POST',
      body: user,
    })

    if (!res.success)
      throw new Error(res.message || 'REGISTER_FAILED')

    return { success: true, message: 'REGISTER_SUCCESS' }
  }
  catch (error) {
    console.error('Đăng ký thất bại:', error)
    throw createError({
      status: 400,
      message: 'REGISTER_FAILED',
    })
  }
})
