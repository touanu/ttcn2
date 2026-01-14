export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const result = await useAPI(event, `/courses/${id}`, {
    method: 'DELETE',
  })

  return {
    success: true,
    message: translate(event, 'ADMIN.COURSES.COURSE_DELETED'),
    data: result,
  }
})
