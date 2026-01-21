import { z } from 'zod'

// TimeTable schema
export const createTimeTableSchema = z.object({
  classId: z.string().min(1, 'Class is required'),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
}).refine(data => data.endTime > data.startTime, {
  message: 'End time must be after start time',
  path: ['endTime'],
})

export type CreateTimeTableDto = z.infer<typeof createTimeTableSchema>

// Update TimeTable schema
export const updateTimeTableSchema = createTimeTableSchema.partial().omit({ classId: true })

export type UpdateTimeTableDto = z.infer<typeof updateTimeTableSchema>
