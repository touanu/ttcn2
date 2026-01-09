import type { User } from '@shared/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const users = await useAPI<User[]>(event, '/users', {
    query: {
      search: query.search,
      role: query.role,
      page: query.page,
      limit: query.limit || 10,
      sort: '-createdAt',
    },
  })

  return users
})
