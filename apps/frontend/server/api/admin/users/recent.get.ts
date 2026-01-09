import type { User } from '@shared/types'

export default defineEventHandler(async (event) => {
  const users = await useAPI<User[]>(event, '/users', {
    query: {
      sort: '-createdAt',
      limit: 5,
    },
  })

  return users
})
