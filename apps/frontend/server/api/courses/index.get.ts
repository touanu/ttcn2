import type { Course } from '@shared/interfaces'

export default defineEventHandler(async (event) => {
  try {
    const courses = await useAPI<Course[]>(event, '/courses', {
      method: 'GET',
    })

    return courses
  }
  catch (error: unknown) {
    const err = error as { statusCode?: number, message?: string }
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || await translate(event, 'COURSES.ERROR.FETCH_FAILED'),
    })
  }
})
