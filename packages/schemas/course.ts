import z from 'zod'

export const courseLevelSchema = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
export const courseStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])

export const courseSchema = z.object({
  title: z.string().min(1, 'FORMS.COURSE.TITLE_REQUIRED').max(200, 'FORMS.COURSE.TITLE_MAX_LENGTH'),
  description: z.string().min(1, 'FORMS.COURSE.DESCRIPTION_REQUIRED'),
  thumbnail: z.string(),
  categoryId: z.string().min(1, 'FORMS.COURSE.CATEGORY_REQUIRED'),
  level: courseLevelSchema,
  status: courseStatusSchema.optional(),
  lessonIds: z.array(z.string()).optional(),
})

export const createCourseSchema = courseSchema

export const updateCourseSchema = courseSchema.partial()

export type CourseLevelDto = z.infer<typeof courseLevelSchema>
export type CreateCourseDto = z.infer<typeof createCourseSchema>
export type UpdateCourseDto = z.infer<typeof updateCourseSchema>
