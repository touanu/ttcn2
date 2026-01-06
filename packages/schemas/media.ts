import z from 'zod'

export const mediaTypeSchema = z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT'])

export const mediaSchema = z.object({
  url: z.string().url('FORMS.MEDIA.INVALID_URL'),
  type: mediaTypeSchema,
})

export const createMediaSchema = mediaSchema

export type MediaTypeDto = z.infer<typeof mediaTypeSchema>
export type CreateMediaDto = z.infer<typeof createMediaSchema>
