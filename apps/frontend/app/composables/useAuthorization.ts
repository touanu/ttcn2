/**
 * Composable wrapper for nuxt-authorization functions
 * Provides convenient access to allows, denies, and authorize functions
 */
export function useAuthorization() {
  return {
    allows,
    denies,
    authorize,
  }
}
