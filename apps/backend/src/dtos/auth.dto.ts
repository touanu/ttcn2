import z from 'zod'
import { passwordSchema, usernameSchema } from './users.dto'

export const loginUserSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
})

export const emailOTPVerificationSchema = z.object({
  email: z.email('EMAIL_INVALID_FORMAT'),
  otp: z.string()
    .min(6, 'OTP_LENGTH_REQUIRED')
    .max(6, 'OTP_LENGTH_REQUIRED')
    .regex(/^\d+$/, 'INVALID_OTP_FORMAT'),
})

export const emailTokenVerificationSchema = z.object({
  verificationToken: z.string().min(1, 'VERIFICATION_TOKEN_REQUIRED'),
})

export const logOutSchema = z.object({
  sessionId: z.string().min(1, 'SESSION_ID_REQUIRED'),
})

export const refreshTokenSchema = logOutSchema.extend({
  refreshToken: z.string().min(1, 'REFRESH_TOKEN_REQUIRED'),
})

export const requestEmailVerificationSchema = z.object({
  email: z.email('EMAIL_INVALID_FORMAT'),
})

export const requestPasswordResetSchema = z.object({
  email: z.email('EMAIL_INVALID_FORMAT'),
})

export const resetPasswordSchema = z.object({
  email: z.email('EMAIL_INVALID_FORMAT'),
  otp: z.string()
    .min(6, 'OTP_LENGTH_REQUIRED')
    .max(6, 'OTP_LENGTH_REQUIRED')
    .regex(/^\d+$/, 'INVALID_OTP_FORMAT'),
  newPassword: passwordSchema,
})
