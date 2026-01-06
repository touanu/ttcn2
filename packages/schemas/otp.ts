import { OTP_LENGTH } from '@shared/constants'
import { emptyAsNull } from '@shared/utils/validation'
import z from 'zod'

// Schema chung
export const otpSchema = z.string('FORMS.OTP.REQUIRED')
  .min(OTP_LENGTH, 'FORMS.OTP.MIN_LENGTH')
  .max(OTP_LENGTH, 'FORMS.OTP.MAX_LENGTH')
  .regex(/^\d+$/, 'FORMS.OTP.DIGITS_ONLY')

export const hashSchema = z.string('FORMS.HASH.REQUIRED')
  .min(1, 'FORMS.HASH.CANNOT_BE_EMPTY')

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
      message: 'FORMS.EITHER_OTP_OR_HASH_REQUIRED',
      input: ctx.value,
    })
  }
})
export type OtpVerificationDto = z.infer<typeof otpVerificationSchema>
