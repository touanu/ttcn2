import z from 'zod'

export const courseSchema = z.object({
  title: z.string().min(1, 'FORMS.COURSE.TITLE_REQUIRED').max(200, 'FORMS.COURSE.TITLE_MAX_LENGTH'),
  description: z.string().min(1, 'FORMS.COURSE.DESCRIPTION_REQUIRED'),
  thumbnail: z.string(),
})

export const createCourseSchema = courseSchema

export const updateCourseSchema = courseSchema.partial()

export type CreateCourseDto = z.infer<typeof createCourseSchema>
export type UpdateCourseDto = z.infer<typeof updateCourseSchema>
