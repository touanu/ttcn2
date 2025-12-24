import { z } from 'zod'

// Schema chung
export const usernameSchema = z.string()
  .min(3, 'USERNAME_MIN_LENGTH_REQUIRED')
  .max(30, 'USERNAME_MAX_LENGTH_REQUIRED')
export const passwordSchema = z.string()
  .min(9, 'PASSWORD_MIN_LENGTH_REQUIRED')
  .max(32, 'PASSWORD_MAX_LENGTH_REQUIRED')

// DTO đăng ký thành viên (dùng chung cho signup và login)
export const createUserSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  email: z.email('EMAIL_INVALID_FORMAT'),
  fullName: z.string()
    .min(3, 'FULLNAME_MIN_LENGTH_REQUIRED')
    .max(100, 'FULLNAME_MAX_LENGTH_REQUIRED'),
})

export type CreateUserDto = z.infer<typeof createUserSchema>

// DTO chỉnh sửa (không bắt buộc tất cả trường)
export const updateUserSchema = createUserSchema.partial()

export type UpdateUserDto = z.infer<typeof updateUserSchema>
