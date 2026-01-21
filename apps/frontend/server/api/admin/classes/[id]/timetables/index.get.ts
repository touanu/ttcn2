import type { TimeTable } from '@shared/types'

export default defineEventHandler(async (event) => {
  if (await denies(event, viewTimetable)) {
    throw createError({
      status: 401,
      message: await translate(event, 'AUTH.FORBIDDEN_INSUFFICIENT_ROLE'),
    })
  }

  const classId = getRouterParam(event, 'id')

  const data = await useAPI<TimeTable[]>(event, `/classes/${classId}/timetables`, {
    method: 'GET',
  })

  return data
})
