import type { Media } from '@shared/interfaces'
import { MEDIA_TYPES } from '@shared/types'
import { model, Schema } from 'mongoose'

const MediaSchema = new Schema<Media>({
  url: { type: String, required: true },
  type: { type: String, enum: MEDIA_TYPES, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
})

MediaSchema.index({ ownerId: 1 })

export const MediaModel = model<Media>('Media', MediaSchema)
