import type { Course, SuccessResponseBody } from '@shared/types'
import { createCourseSchema } from '@shared/schemas'

export default defineEventHandler(async (event) => {
  // Get current user from session
  const { user } = await requireUserSession(event)
  if (!user.id) {
    throw createError({
      statusCode: 401,
      message: await translate(event, 'AUHT.UNAUTHORIZED'),
    })
  }

  // Validate request body
  const body = await readValidatedBody(event, createCourseSchema.parse)

  // Add authorId from current user
  const courseData = {
    ...body,
    authorId: user.id,
  }

  // Create course via backend API
  const course = await useAPI<Course>(event, '/courses', {
    method: 'POST',
    body: courseData,
  })

  return {
    success: true,
    message: await translate(event, 'ADMIN.COURSES.COURSE_CREATED', { course: 'coursetitle' }),
    data: course,
  } as SuccessResponseBody<Course>
})
