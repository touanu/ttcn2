export default defineEventHandler(async (event) => {
  return await useAPI(event, '/classes', {
    method: 'GET',
  })
})
