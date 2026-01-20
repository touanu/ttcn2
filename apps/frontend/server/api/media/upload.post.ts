import type { Media } from '@shared/types'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      message: await translate(event, 'MEDIA.NO_FILE_UPLOADED'),
    })
  }

  const file = formData[0]

  if (!file.filename) {
    throw createError({
      statusCode: 400,
      message: await translate(event, 'MEDIA.INVALID_FILE'),
    })
  }

  // Forward to backend
  const backendFormData = new FormData()
  const uint8Array = new Uint8Array(file.data)
  const blob = new Blob([uint8Array], { type: file.type })
  backendFormData.append('file', blob, file.filename)

  return await useAPI<Media>(event, '/media/upload/image', {
    method: 'POST',
    body: backendFormData,
  })
})
