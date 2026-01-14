import { emptyAsNull } from '@shared/utils/validation'
import z from 'zod'
import { emailSchema, passwordSchema, usernameSchema } from './base'
import { otpSchema } from './otp'

// Define user roles enum for validation
export const userRoleSchema = z.enum(
  ['student', 'teacher', 'admin', 'superadmin'],
  'FORMS.INVALID_USER_ROLE',
)
export type UserRoleDto = z.infer<typeof userRoleSchema>

export const createUserSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  email: emailSchema,
  fullName: z.string()
    .min(3, 'FORMS.FULLNAME.MIN_LENGTH')
    .max(100, 'FORMS.FULLNAME.MAX_LENGTH'),
  role: userRoleSchema.default('student'),
})
export type CreateUserDto = z.infer<typeof createUserSchema>

export const createUserWithRoleSchema = createUserSchema.extend({
  role: userRoleSchema,
})
export type CreateUserWithRoleDto = z.infer<typeof createUserWithRoleSchema>

// DTO chỉnh sửa (không bắt buộc tất cả trường)
export const updateUserSchema = createUserSchema.partial()
export type UpdateUserDto = z.infer<typeof updateUserSchema>

export const emailOnlySchema = z.object({
  email: emailSchema,
})
export type EmailOnlyDto = z.infer<typeof emailOnlySchema>

export const emailVerificationSchema = z.object({
  otp: otpSchema,
  email: emailSchema,
})
export type EmailVerificationDto = z.infer<typeof emailVerificationSchema>

export const passwordResetSchema = emailVerificationSchema.safeExtend({
  newPassword: passwordSchema,
})
export type PasswordResetDto = z.infer<typeof passwordResetSchema>

export const onlyPasswordResetSchema = z.object({
  newPassword: passwordSchema,
})
export type PasswordOnlyDto = z.infer<typeof onlyPasswordResetSchema>

export const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
})
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>

export const usernameOnlySchema = z.object({
  username: usernameSchema,
})
export type UsernameOnlyDto = z.infer<typeof usernameOnlySchema>

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

export const updateUserRoleSchema = z.object({
  role: userRoleSchema,
})
export type UpdateUserRoleDto = z.infer<typeof updateUserRoleSchema>
