import z from 'zod'
import { passwordSchema, usernameSchema } from './user'

export const loginUserSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
})

export type LoginUserDto = z.infer<typeof loginUserSchema>

export const logOutSchema = z.object({
  sessionId: z
    .string()
    .min(1, 'SESSION_ID_REQUIRED')
    .regex(/^[0-9a-f]{24}$/, 'SESSION_ID_INVALID_FORMAT'),
})

export const refreshTokenSchema = logOutSchema.extend({
  refreshToken: z.string().min(1, 'REFRESH_TOKEN_REQUIRED'),
})
