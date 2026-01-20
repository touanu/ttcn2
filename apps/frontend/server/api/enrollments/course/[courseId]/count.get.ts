export default defineEventHandler(async (event) => {
  const courseId = getRouterParam(event, 'courseId')

  if (!courseId) {
    throw createError({
      statusCode: 400,
      message: 'Course ID is required',
    })
  }

  try {
    const response = await useAPI<{ count: number }>(
      event,
      `/enrollments/course/${courseId}/count`,
      { method: 'GET' },
    )

    return response?.count
  }
  catch {
    return 0
  }
})
