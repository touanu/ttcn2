import z from 'zod'

export const lessonSchema = z.object({
  title: z.string().min(1, 'FORMS.LESSON.TITLE_REQUIRED').max(200, 'FORMS.LESSON.TITLE_MAX_LENGTH'),
  content: z.string().min(1, 'FORMS.LESSON.CONTENT_REQUIRED'),
  mediaIds: z.array(z.string()).optional(),
  quizId: z.string().optional(),
  orderIndex: z.number().int().min(0),
})

export const createLessonSchema = lessonSchema

export const updateLessonSchema = lessonSchema.partial()

export const reorderLessonsSchema = z.object({
  lessonOrders: z.array(
    z.object({
      lessonId: z.string(),
      orderIndex: z.number().int().min(0),
    }),
  ),
})

export type CreateLessonDto = z.infer<typeof createLessonSchema>
export type UpdateLessonDto = z.infer<typeof updateLessonSchema>
export type ReorderLessonsDto = z.infer<typeof reorderLessonsSchema>
