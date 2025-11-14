import { z } from 'zod'

// Schema chung cho mật khẩu
export const passwordSchema = z
  .string()
  .min(9, { message: 'Mật khẩu phải có ít nhất 9 ký tự.' })
  .max(32, { message: 'Mật khẩu tối đa 32 ký tự.' })

// DTO đăng ký thành viên (dùng chung cho signup và login)
export const createUserSchema = z.object({
  email: z.email({ message: 'Định dạng email không hợp lệ.' }),
  password: passwordSchema,
})

export type CreateUserDto = z.infer<typeof createUserSchema>

// DTO chỉnh sửa (không bắt buộc tất cả trường)
export const updateUserSchema = createUserSchema.partial()

export type UpdateUserDto = z.infer<typeof updateUserSchema>
