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
  const enrollments = await useAPI<Enrollment[]>(event, `/enrollments/user/${session.user.id}`, {
    method: 'GET',
  })

  if (!enrollments) {
    throw createError({
      statusCode: 500,
      message: await translate(event, 'ERRORS.INTERNAL_SERVER'),
    })
  }

  // Calculate statistics
  const coursesEnrolled = enrollments.length
  const activeEnrollments = enrollments.filter(e => e.status === 'in-progress').length
  const completedEnrollments = enrollments.filter(e => e.status === 'completed').length

  return {
    coursesEnrolled,
    activeEnrollments,
    completedEnrollments,
  }
})
