export default defineEventHandler(async (event) => {
  const { ids } = await readBody<{ ids: string[] }>(event)

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request: ids array is required',
    })
  }

  await Promise.all(
    ids.map(id =>
      useAPI(event, `/classes/${id}`, {
        method: 'DELETE',
      }),
    ),
  )

  return {
    success: true,
    message: translate(event, 'ADMIN.CLASSES.CLASSES_DELETED_SUCCESS'),
  }
})
