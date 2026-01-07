import { isAuthenticated } from '~~/shared/utils/abilities'

export default defineNuxtRouteMiddleware(async (to) => {
  // Check if user is authenticated using the ability
  const authenticated = await allows(isAuthenticated)

  if (!authenticated) {
    // Redirect to login page with return URL
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
})
