import { emptyAsNull } from '@shared/utils/validation'
import { z } from 'zod'
import { otpVerificationSchema } from './otp'

// Schema chung
export const usernameSchema = z
  .string('FORMS.USERNAME.REQUIRED')
  .min(3, 'FORMS.USERNAME.MIN_LENGTH')
  .max(30, 'VALIDATION_USERNAME_MAX')
export const passwordSchema = z
  .string('FORMS.PASSWORD.REQUIRED')
  .min(8, 'FORMS.PASSWORD.MIN_LENGTH')
  .max(64, 'VALIDATION_PASSWORD_MAX')
  .regex(/[A-Z]/, 'FORMS.PASSWORD.UPPERCASE_REQUIRED')
  .regex(/[a-z]/, 'FORMS.PASSWORD.LOWERCASE_REQUIRED')
  .regex(/\d/, 'FORMS.PASSWORD.NUMBER_REQUIRED')
  .regex(/[\W_]/, 'FORMS.PASSWORD.SPECIAL_CHARACTER_REQUIRED')
export const emailSchema = z.email('FORMS.EMAIL.INVALID')

// DTO đăng ký thành viên (dùng chung cho signup và login)
export const createUserSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  email: emailSchema,
  fullName: z.string()
    .min(3, 'FORMS.FULLNAME.MIN_LENGTH')
    .max(100, 'FORMS.FULLNAME.MAX_LENGTH'),
})
export type CreateUserDto = z.infer<typeof createUserSchema>

// DTO chỉnh sửa (không bắt buộc tất cả trường)
export const updateUserSchema = createUserSchema.partial()
export type UpdateUserDto = z.infer<typeof updateUserSchema>

export const emailOnlySchema = z.object({
  email: emailSchema,
})
export type EmailOnlyDto = z.infer<typeof emailOnlySchema>

export const emailVerificationSchema = otpVerificationSchema.safeExtend({
  email: emailSchema,
})
export type EmailVerificationDto = z.infer<typeof emailVerificationSchema>

export const passwordResetSchema = emailVerificationSchema.safeExtend({
  newPassword: passwordSchema,
})
export type PasswordResetDto = z.infer<typeof passwordResetSchema>

export const passwordResetByTokenSchema = z.object({
  newPassword: passwordSchema,
})
export type PasswordResetByTokenDto = z.infer<typeof passwordResetByTokenSchema>

export const requestVerifyEmailSchema = z.object({
  email: emptyAsNull(emailSchema.nullish()),
  username: emptyAsNull(usernameSchema.nullish()),
}).check((ctx) => {
  if (!ctx.value.email && !ctx.value.username) {
    ctx.issues.push({
      code: 'custom',
      message: 'FORMS.EITHER_EMAIL_OR_USERNAME_REQUIRED',
      input: ctx.value,
    })
  }
})
export type RequestVerifyEmailDto = z.infer<typeof requestVerifyEmailSchema>
