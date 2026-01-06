import type { MediaType } from '@shared/types/media'
import type { ObjectId } from 'mongoose'

export interface Media {
  _id?: ObjectId
  url: string
  type: MediaType
  ownerId: ObjectId
  createdAt: Date
}
