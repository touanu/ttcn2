import { OTP_LENGTH } from '@shared/constants'
import { emptyAsNull } from '@shared/utils'
import z from 'zod'

// Schema chung
export const otpSchema = z.string('OTP_REQUIRED')
  .min(OTP_LENGTH, 'OTP_LENGTH_REQUIRED')
  .max(OTP_LENGTH, 'OTP_LENGTH_REQUIRED')
  .regex(/^\d+$/, 'INVALID_OTP_FORMAT')

export const hashSchema = z.string('HASH_REQUIRED')
  .min(1, 'HASH_CANNOT_BE_EMPTY')

// Schema dùng cho xác thực OTP
export const otpOnlySchema = z.object({
  otp: otpSchema,
})
export type OtpOnlyDto = z.infer<typeof otpOnlySchema>

export const hashOnlySchema = z.object({
  hash: hashSchema,
})
export type HashOnlyDto = z.infer<typeof hashOnlySchema>

export const otpVerificationSchema = z.object({
  otp: emptyAsNull(otpSchema.nullish()),
  hash: emptyAsNull(hashSchema.nullish()),
}).check((ctx) => {
  if (!ctx.value.otp && !ctx.value.hash) {
    ctx.issues.push({
      code: 'custom',
      message: 'EITHER_OTP_OR_HASH_REQUIRED',
      input: ctx.value,
    })
  }
})
export type OtpVerificationDto = z.infer<typeof otpVerificationSchema>
