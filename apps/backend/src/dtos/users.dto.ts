import { z } from 'zod'

// Schema chung
export const usernameSchema = z.string()
  .min(3, 'USERNAME_MIN_LENGTH_REQUIRED')
  .max(30, 'USERNAME_MAX_LENGTH_REQUIRED')
export const passwordSchema = z.string()
  .min(8, 'PASSWORD_MIN_LENGTH')
  .max(64, 'PASSWORD_MAX_LENGTH')
  .regex(/[A-Z]/, 'PASSWORD_UPPERCASE_REQUIRED')
  .regex(/[a-z]/, 'PASSWORD_LOWERCASE_REQUIRED')
  .regex(/\d/, 'PASSWORD_NUMBER_REQUIRED')
  .regex(/[\W_]/, 'PASSWORD_SPECIAL_CHARACTER_REQUIRED')
export const emailSchema = z.email('EMAIL_INVALID_FORMAT')

// DTO đăng ký thành viên (dùng chung cho signup và login)
export const createUserSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  email: emailSchema,
  fullName: z.string()
    .min(3, 'FULLNAME_MIN_LENGTH_REQUIRED')
    .max(100, 'FULLNAME_MAX_LENGTH_REQUIRED'),
})

export type CreateUserDto = z.infer<typeof createUserSchema>

// DTO chỉnh sửa (không bắt buộc tất cả trường)
export const updateUserSchema = createUserSchema.partial()

export type UpdateUserDto = z.infer<typeof updateUserSchema>

export const emailOnlySchema = z.object({
  email: emailSchema,
})
export type EmailOnlyDto = z.infer<typeof emailOnlySchema>
