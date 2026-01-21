import type { TimeTable } from '@shared/types'

export default defineEventHandler(async (event) => {
  if (await denies(event, createTimetable)) {
    throw createError({
      status: 401,
      message: await translate(event, 'AUTH.FORBIDDEN_INSUFFICIENT_ROLE'),
    })
  }

  const classId = getRouterParam(event, 'id')
  const body = await readBody(event)

  const data = await useAPI<TimeTable>(event, `/timetables`, {
    method: 'POST',
    body: {
      classId,
      ...body,
    },
  })

  return data
})
