import type { User } from '@shared/types'

export default defineEventHandler(async (event) => {
  const teamMembers = await useAPI<User[]>(event, '/users', {
    method: 'GET',
    query: {
      role: 'teacher',
      limit: 6,
    },
  })

  return teamMembers
})
