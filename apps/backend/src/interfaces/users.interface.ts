import type { User } from '@shared/types'
import type { ObjectId } from 'mongoose'

export interface UserDB extends Omit<User, '_id'> {
  _id: ObjectId
}
