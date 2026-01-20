export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')
  const courseId = getRouterParam(event, 'courseId')

  if (!userId || userId === 'guest') {
    return {
      isEnrolled: false,
      enrollment: null,
    }
  }

  try {
    const result = await useAPI<{ isEnrolled: boolean, enrollment?: any }>(
      event,
      `/enrollments/check/${userId}/${courseId}`,
      { method: 'GET' },
    )

    return result
  }
  catch {
    return {
      isEnrolled: false,
      enrollment: null,
    }
  }
})
