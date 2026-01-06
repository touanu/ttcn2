import type { Media } from '@shared/interfaces/media.interface'

export const MEDIA_TYPES = ['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT'] as const

export type MediaType = typeof MEDIA_TYPES[number]

export type MediaDB = Media & Required<Pick<Media, '_id'>>
