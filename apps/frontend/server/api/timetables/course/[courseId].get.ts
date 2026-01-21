import type { TimeTable } from '@shared/types'

export default defineEventHandler(async (event) => {
  const courseId = getRouterParam(event, 'courseId')

  // Fetch all classes for this course
  const classes = await useAPI<any[]>(event, `/classes/course/${courseId}`, {
    method: 'GET',
  })

  // Fetch timetables for each class
  const timetablesMap: Record<string, TimeTable[]> = {}

  if (classes && Array.isArray(classes)) {
    for (const classItem of classes) {
      if (classItem._id) {
        const timetables = await useAPI<TimeTable[]>(
          event,
          `/timetables/class/${classItem._id}`,
          { method: 'GET' },
        )
        timetablesMap[classItem._id] = timetables || []
      }
    }
  }

  return timetablesMap
})
