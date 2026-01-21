import type { Class, Course, Enrollment, TimeTable } from '@shared/types'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: await translate(event, 'AUTH.UNAUTHORIZED'),
    })
  }

  // Fetch user's enrollments
  const enrollments = await useAPI<Enrollment[]>(event, `/enrollments/user/${session.user.id}`, {
    method: 'GET',
  })

  if (!enrollments || enrollments.length === 0) {
    return []
  }

  // Extract course IDs from enrollments
  const courseIds = [...new Set(enrollments.map(e => e.courseId))]

  // Batch fetch all courses
  const courses = await useAPI<Course[]>(event, `/courses`, {
    method: 'GET',
    query: {
      ids: courseIds.join(','),
    },
  }).catch((error) => {
    console.error('Error fetching courses:', error)
    return []
  })

  if (!courses || courses.length === 0) {
    return []
  }

  // Create a map for quick course lookup
  const courseMap = new Map(courses.map(c => [c._id, c]))

  // Fetch course details, classes, and timetables for each enrollment
  const enrolledCourses = await Promise.all(
    enrollments.map(async (enrollment) => {
      try {
        // Get course from map
        const course = courseMap.get(enrollment.courseId)

        if (!course)
          return null

        // Fetch all classes for this course
        const allClasses = await useAPI<Class[]>(event, `/classes`, {
          method: 'GET',
          query: {
            courseId: course._id,
          },
        }).catch(() => [])

        // Fetch timetables for each class
        const classesWithTimetables = await Promise.all(
          (allClasses || []).map(async (classItem) => {
            const timetables = await useAPI<TimeTable[]>(event, `/classes/${classItem._id}/timetables`, {
              method: 'GET',
            }).catch(() => [])

            return {
              ...classItem,
              timetables: timetables || [],
            }
          }),
        )

        return {
          ...course,
          enrollment: {
            _id: enrollment._id,
            status: enrollment.status,
            enrolledAt: enrollment.enrolledAt,
            completedAt: enrollment.completedAt,
          },
          classes: classesWithTimetables,
        }
      }
      catch (error) {
        console.error(`Error fetching course ${enrollment.courseId}:`, error)
        return null
      }
    }),
  )

  return enrolledCourses.filter(Boolean)
})
