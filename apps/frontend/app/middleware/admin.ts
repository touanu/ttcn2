export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, user } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo('/login')
  }

  // Check if user has admin or superadmin role
  if (user.value?.role !== 'admin' && user.value?.role !== 'superadmin') {
    return navigateTo('/')
  }
})
