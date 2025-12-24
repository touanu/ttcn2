import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string('VALIDATION_USERNAME_REQUIRED')
    .min(3, 'VALIDATION_USERNAME_REQUIRED'),
  password: z
    .string('VALIDATION_PASSWORD_REQUIRED')
    .min(8, 'VALIDATION_PASSWORD_MIN_LENGTH'),
  rememberMe: z.boolean().optional(),
})

export type LoginSchema = z.output<typeof loginSchema>

export const registerSchema = z.object({
  fullName: z
    .string('VALIDATION_NAME_REQUIRED')
    .min(3, 'VALIDATION_NAME_REQUIRED'),
  username: z
    .string('VALIDATION_USERNAME_REQUIRED')
    .min(3, 'VALIDATION_USERNAME_REQUIRED'),
  email: z.email('VALIDATION_EMAIL_INVALID'),
  password: z
    .string('VALIDATION_PASSWORD_REQUIRED')
    .min(8, 'VALIDATION_PASSWORD_MIN_LENGTH'),
  confirmPassword: z
    .string('VALIDATION_CONFIRM_PASSWORD_REQUIRED')
    .min(8, 'VALIDATION_CONFIRM_PASSWORD_MIN_LENGTH'),
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'VALIDATION_PASSWORDS_DO_NOT_MATCH',
})

export type RegisterSchema = z.output<typeof registerSchema>

export const otpSchema = z.object({
  otp: z
    .string('VALIDATION_OTP_REQUIRED')
    .min(6, 'VALIDATION_OTP_LENGTH_REQUIRED')
    .max(6, 'VALIDATION_OTP_LENGTH_REQUIRED')
    .regex(/^\d{6}$/, 'VALIDATION_OTP_DIGITS_ONLY'),
})

export type OtpSchema = z.output<typeof otpSchema>
