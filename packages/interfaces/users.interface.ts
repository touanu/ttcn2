import type { ObjectId } from 'mongoose'

export interface User {
  _id?: ObjectId
  username: string
  email: string
  emailVerificationToken?: string
  isEmailVerified?: boolean
  password: string
  passwordResetToken?: string
  fullName: string
  role?: 'student' | 'teacher' | 'admin' | 'superadmin'
  profilePictureUrl?: string
  createdAt?: Date
  updatedAt?: Date
}
