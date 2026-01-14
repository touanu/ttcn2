export default defineNuxtRouteMiddleware(async (to) => {
  if (await denies(isAuthenticated)) {
    // Redirect to login page with return URL
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
})
