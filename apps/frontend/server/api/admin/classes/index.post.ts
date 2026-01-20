export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { user } = await getUserSession(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const result = await useAPI(event, '/classes', {
    method: 'POST',
    body,
  })

  return {
    success: true,
    message: translate(event, 'ADMIN.CLASSES.CLASS_CREATED', { name: body.name }),
    data: result,
  }
})
