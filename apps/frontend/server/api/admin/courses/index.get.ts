import type { Course } from '@shared/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const response = await useAPI<Course[]>(event, '/courses', {
    method: 'GET',
    query: {
      search: query.search,
      status: query.status,
      page: query.page,
      limit: query.limit || 1000, // Get all courses for dropdowns
      sort: '-createdAt',
    },
  })

  return response
})
