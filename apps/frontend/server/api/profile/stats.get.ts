import type { Enrollment } from '@shared/types'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: await translate(event, 'AUTH.UNAUTHORIZED'),
    })
  }

  // Fetch user's enrollment data
  const enrollments = await useAPI<Enrollment[]>(event, `/enrollments/user/${session.user._id}`, {
    method: 'GET',
  })

  // Calculate statistics
  const coursesEnrolled = enrollments.length
  const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE').length
  const completedEnrollments = enrollments.filter(e => e.status === 'COMPLETED').length

  return {
    coursesEnrolled,
    activeEnrollments,
    completedEnrollments,
  }
})
