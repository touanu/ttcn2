import type { User } from '@shared/interfaces'
import { USER_ROLES } from '@shared/types'
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
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: USER_ROLES,
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
