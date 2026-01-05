import type { Document, InferSchemaType } from 'mongoose'
import { SESSION_EXPIRATION_TIME } from '@shared/constants'
import { model, Schema, Types } from 'mongoose'

const SessionSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  refreshTokenHash: {
    type: String,
    required: true,
    trim: true,
  },
  ipAddress: {
    type: String,
    required: false,
  },
  userAgent: {
    type: String,
    required: false,
  },
  deviceInfo: {
    type: String,
    default: '',
  },
  revoked: {
    type: Boolean,
    default: false,
  },
  revokedAt: {
    type: Date,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 1000 * SESSION_EXPIRATION_TIME),
    expires: 0,
  },
}, {
  timestamps: true,
})

export type Session = InferSchemaType<typeof SessionSchema>
export const SessionModel = model<Session & Document>('Session', SessionSchema)
