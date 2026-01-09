import type { Media } from '@shared/types'
import type { ObjectId } from 'mongoose'

export interface MediaDB extends Omit<Media, '_id' | 'ownerId'> {
  _id?: ObjectId
  ownerId: ObjectId
}
