import { z } from 'zod'

// Class status enum
export const classStatusSchema = z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'])

// Create class schema
export const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(100),
  courseId: z.string().min(1, 'Course is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
  studentIds: z.array(z.string()).default([]),
  room: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  maxStudents: z.number().int().min(1).max(200).default(30),
  status: classStatusSchema.default('PENDING'),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

export type CreateClassDto = z.infer<typeof createClassSchema>

// Update class schema
export const updateClassSchema = createClassSchema.partial()

export type UpdateClassDto = z.infer<typeof updateClassSchema>
