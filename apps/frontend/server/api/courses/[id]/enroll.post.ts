export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  const session = await requireUserSession(event)

  const courseId = getRouterParam(event, 'id')
  const body = await readBody(event)

  const { classId } = body

  if (!classId) {
    throw createError({
      statusCode: 400,
      message: 'Class ID is required',
    })
  }

  // Create enrollment via backend API
  const result = await useAPI(event, '/enrollments', {
    method: 'POST',
    body: {
      userId: session.user.id,
      courseId,
      paidMethod: 'free',
      price: 0,
      paidPrice: 0,
    },
  })

  // Add user to class studentIds
  await useAPI(event, `/classes/${classId}/students`, {
    method: 'POST',
    body: {
      studentId: session.user.id,
    },
  })

  return {
    success: true,
    message: translate(event, 'COURSES.ENROLLED_SUCCESSFULLY'),
    data: result,
  }
})
