export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  const user = await requireUserSession(event)

  const courseId = getRouterParam(event, 'id')
  const body = await readBody(event)

  const { classId } = body

  if (!classId) {
    throw createError({
      statusCode: 400,
      message: 'Class ID is required',
    })
  }

  try {
    // Create enrollment via backend API
    const result = await useAPI(event, '/enrollments', {
      method: 'POST',
      body: {
        userId: user.id,
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
        studentId: user.id,
      },
    })

    return {
      success: true,
      message: translate(event, 'COURSES.ENROLLED_SUCCESSFULLY'),
      data: result,
    }
  }
  catch (error: any) {
    console.error('Enrollment error:', error)
    throw createError({
      statusCode: error?.status || 500,
      message: error?.message || 'COURSES.ENROLL_ERROR',
    })
  }
})
