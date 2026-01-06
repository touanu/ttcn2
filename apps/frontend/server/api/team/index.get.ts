import type { User } from '@shared/interfaces'

export default defineEventHandler(async (event) => {
  try {
    const teamMembers = await useAPI<User[]>(event, '/users', {
      method: 'GET',
      query: {
        role: 'teacher',
        limit: 6,
      },
    })

    return teamMembers
  }
  catch (error: unknown) {
    const err = error as { statusCode?: number, message?: string }
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || await translate(event, 'TEAM.ERROR.FETCH_FAILED'),
    })
  }
})
