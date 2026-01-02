import { emptyAsNull } from '@shared/utils/validation'
import { z } from 'zod'
import { otpVerificationSchema } from './otp'

// Schema chung
export const usernameSchema = z
  .string('VALIDATION_USERNAME_REQUIRED')
  .min(3, 'VALIDATION_USERNAME_MIN')
  .max(30, 'VALIDATION_USERNAME_MAX')
export const passwordSchema = z
  .string('VALIDATION_PASSWORD_REQUIRED')
  .min(8, 'VALIDATION_PASSWORD_MIN')
  .max(64, 'VALIDATION_PASSWORD_MAX')
  .regex(/[A-Z]/, 'VALIDATION_PASSWORD_UPPERCASE_REQUIRED')
  .regex(/[a-z]/, 'VALIDATION_PASSWORD_LOWERCASE_REQUIRED')
  .regex(/\d/, 'VALIDATION_PASSWORD_NUMBER_REQUIRED')
  .regex(/[\W_]/, 'VALIDATION_PASSWORD_SPECIAL_CHARACTER_REQUIRED')
export const emailSchema = z.email('EMAIL_INVALID_FORMAT')

// DTO đăng ký thành viên (dùng chung cho signup và login)
export const createUserSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  email: emailSchema,
  fullName: z.string()
    .min(3, 'VALIDATION_FULLNAME_MIN_LENGTH_REQUIRED')
    .max(100, 'VALIDATION_FULLNAME_MAX_LENGTH_REQUIRED'),
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
      message: 'VALIDATION_EITHER_EMAIL_OR_USERNAME_REQUIRED',
      input: ctx.value,
    })
  }
})
export type RequestVerifyEmailDto = z.infer<typeof requestVerifyEmailSchema>
