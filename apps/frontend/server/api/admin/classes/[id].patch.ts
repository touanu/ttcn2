export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const result = await useAPI(event, `/classes/${id}`, {
    method: 'PATCH',
    body,
  })

  return {
    success: true,
    message: translate(event, 'ADMIN.CLASSES.CLASS_UPDATED'),
    data: result,
  }
})
