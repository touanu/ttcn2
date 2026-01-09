export const MEDIA_TYPES = ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT'] as const

export type MediaType = typeof MEDIA_TYPES[number]

export interface Media {
  _id?: string
  url: string
  type: MediaType
  ownerId: string
  createdAt: Date
}
