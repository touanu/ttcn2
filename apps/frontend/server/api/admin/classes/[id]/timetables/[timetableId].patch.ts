import type { TimeTable } from '@shared/types'

export default defineEventHandler(async (event) => {
  if (await denies(event, updateTimetable)) {
    throw createError({
      status: 401,
      message: await translate(event, 'AUTH.FORBIDDEN_INSUFFICIENT_ROLE'),
    })
  }

  const timetableId = getRouterParam(event, 'timetableId')
  const body = await readBody(event)

  const data = await useAPI<TimeTable>(event, `/timetables/${timetableId}`, {
    method: 'PATCH',
    body,
  })

  return data
})
