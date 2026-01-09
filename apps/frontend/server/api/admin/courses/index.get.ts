import type { Course } from '@shared/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const courses = await useAPI<Course[]>(event, '/courses', {
    query: {
      search: query.search,
      status: query.status,
      page: query.page,
      limit: query.limit || 10,
      sort: '-createdAt',
    },
  })

  return courses
})
