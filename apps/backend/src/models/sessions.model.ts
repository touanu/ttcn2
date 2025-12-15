import type { Document, InferSchemaType } from 'mongoose'
import { model, Schema } from 'mongoose'

const SessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  refreshTokenHash: {
    type: String,
    required: true,
    unique: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 30, // Tự động xóa sau 30 ngày
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

export type SessionType = InferSchemaType<typeof SessionSchema>
export const SessionModel = model<SessionType & Document>('Session', SessionSchema)
