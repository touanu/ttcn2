import type { User } from '@shared/interfaces'
import { model, Schema } from 'mongoose'

const UserSchema: Schema = new Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  emailVerificationToken: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    sparse: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  passwordResetToken: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    sparse: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  isPhoneNumberVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin', 'superadmin'],
    default: 'student',
  },
  profilePictureUrl: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

export const UserModel = model<User>('User', UserSchema)

UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ emailVerificationToken: 1 }, { unique: true, sparse: true })
UserSchema.index({ passwordResetToken: 1 }, { unique: true, sparse: true })
