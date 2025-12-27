import { OTP_LENGTH } from '@shared/constants'
import { emptyAsNull } from '@shared/utils'
import z from 'zod'
import { emailOnlySchema, passwordSchema } from './users.dto'

export const otpVerificationSchema = z.object({
  otp: emptyAsNull(z.string()
    .min(OTP_LENGTH, 'OTP_LENGTH_REQUIRED')
    .max(OTP_LENGTH, 'OTP_LENGTH_REQUIRED')
    .regex(/^\d+$/, 'INVALID_OTP_FORMAT')
    .nullish()),
  hash: emptyAsNull(z.string().min(1, 'HASH_CANNOT_BE_EMPTY').nullish()),
}).check((ctx) => {
  if (!ctx.value.otp && !ctx.value.hash) {
    ctx.issues.push({
      code: 'custom',
      message: 'EITHER_OTP_OR_HASH_REQUIRED',
      input: ctx.value,
    })
  }
})

export const emailVerificationSchema = otpVerificationSchema.safeExtend({
  email: emailOnlySchema,
})

export const passwordResetSchema = emailVerificationSchema.safeExtend({
  newPassword: passwordSchema,
})
