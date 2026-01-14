export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const result = await useAPI(event, `/courses/${id}`, {
    method: 'PATCH',
    body,
  })

  return {
    success: true,
    message: translate(event, 'ADMIN.COURSES.COURSE_UPDATED'),
    data: result,
  }
})
