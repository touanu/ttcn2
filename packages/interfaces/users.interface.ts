import type { UserRole } from '@shared/types'
import type { ObjectId } from 'mongoose'
import type { SuccessResponseBody } from './error.interface'

export interface User {
  _id?: ObjectId
  username: string
  email: string
  isEmailVerified?: boolean
  password: string
  fullName: string
  role?: UserRole
  profilePictureUrl?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface RequestVerifyEmailResponse extends SuccessResponseBody<{ email: string }> {
  data: { email: string }
}
