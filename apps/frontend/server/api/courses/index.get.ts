import type { Course } from '@shared/types'

export default defineEventHandler(async (event) => {
  const courses = await useAPI<Course[]>(event, '/courses', {
    method: 'GET',
  })

  return courses
})
