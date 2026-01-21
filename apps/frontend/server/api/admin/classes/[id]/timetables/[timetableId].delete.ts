export default defineEventHandler(async (event) => {
  if (await denies(event, deleteTimetable)) {
    throw createError({
      status: 401,
      message: await translate(event, 'AUTH.FORBIDDEN_INSUFFICIENT_ROLE'),
    })
  }

  const timetableId = getRouterParam(event, 'timetableId')

  await useAPI(event, `/timetables/${timetableId}`, {
    method: 'DELETE',
  })

  return { success: true }
})
