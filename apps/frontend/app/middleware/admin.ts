export default defineNuxtRouteMiddleware(async () => {
  if (await denies(isAdmin)) {
    return navigateTo('/')
  }
})
