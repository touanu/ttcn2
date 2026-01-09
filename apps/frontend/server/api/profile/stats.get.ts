import type { Progress } from '@shared/types'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: await translate(event, 'AUTH.UNAUTHORIZED'),
    })
  }

  // Fetch user's progress data
  const progress = await useAPI<Progress[]>(event, '/progress/me', {
    method: 'GET',
  })

  // Calculate statistics
  const coursesEnrolled = progress.length
  const lessonsCompleted = progress.reduce((total, course) => {
    return total + (course.completedLessonIds?.length || 0)
  }, 0)

  // Calculate achievements (example: 1 achievement per completed course)
  const achievements = progress.filter(course => course.percentage === 100).length

  // Calculate day streak (placeholder - would need to track login history)
  // For now, return 0 or implement basic logic
  const dayStreak = 0

  return {
    coursesEnrolled,
    lessonsCompleted,
    achievements,
    dayStreak,
  }
})
