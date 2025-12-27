import type { Document, InferSchemaType } from 'mongoose'
import { OTP_EXPIRATION_TIME } from '@shared/constants'
import { otpTypes } from '@shared/types'
import { model, Schema } from 'mongoose'

const OTPSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  otpHash: {
    type: String,
    required: true,
    trim: true,
  },
  otpType: {
    type: String,
    enum: otpTypes,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: OTP_EXPIRATION_TIME,
  },
})

export type OTPType = InferSchemaType<typeof OTPSchema>
export const OTPModel = model<OTPType & Document>('OTP', OTPSchema)
