export default defineNuxtRouteMiddleware(async () => {
  if (!isAuthenticated) {
    return navigateTo('/login')
  }

  if (!isAdmin) {
    return navigateTo('/')
  }
})
