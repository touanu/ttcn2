import type { Course } from '@shared/types'

export default defineEventHandler(async (event) => {
  try {
    // Fetch users count
    const usersResponse = await useAPI<{ total: number }>(event, '/users/count')

    // Fetch courses
    const coursesResponse = await useAPI<Course[]>(event, '/courses')

    const totalCourses = coursesResponse?.length || 0
    // const activeCourses = coursesResponse?.filter((course: any) => course.status === 'published').length || 0

    return {
      totalUsers: usersResponse?.total || 0,
      totalCourses,
      activeCourses: 0,
      totalLessons: 0, // TODO: Implement lessons count when lessons feature is ready
    } satisfies DashboardStats
  }
  catch (error) {
    console.error('Error fetching admin stats:', error)
    // Return default stats on error
    return {
      totalUsers: 0,
      totalCourses: 0,
      activeCourses: 0,
      totalLessons: 0,
    } satisfies DashboardStats
  }
})
