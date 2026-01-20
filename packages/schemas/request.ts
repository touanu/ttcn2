import { emptyAsNull } from '@shared/utils'
import { z } from 'zod'

const requestStringSchema = emptyAsNull(z.string().nullish())

export const getAllQuerySchema = z.object({
  search: requestStringSchema,
})
