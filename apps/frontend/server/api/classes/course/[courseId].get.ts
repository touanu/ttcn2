export default defineEventHandler(async (event) => {
  const courseId = getRouterParam(event, 'courseId')

  if (!courseId) {
    throw createError({
      statusCode: 400,
      message: 'Course ID is required',
    })
  }

  const result = await useAPI<any[]>(
    event,
    `/classes/course/${courseId}`,
    { method: 'GET' },
  )

  return result || []
})
