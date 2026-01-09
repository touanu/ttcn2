import type { UserRole } from '@shared/types'

/**
 * Composable for checking user abilities based on role
 */
export function useUserAbilities() {
  const { user } = useUserSession()

  /**
   * Check if current user can delete a target user based on roles
   * @param targetRole Role of the user to be deleted
   * @returns true if current user can delete the target user
   */
  function canDeleteUser(targetRole?: UserRole): boolean {
    const currentRole = user.value?.role

    // Superadmin can delete anyone (including other superadmins and themselves)
    if (currentRole === 'superadmin') {
      return true
    }

    // Admin can only delete students and teachers, not admins or superadmins
    if (currentRole === 'admin') {
      return targetRole !== 'admin' && targetRole !== 'superadmin'
    }

    // Other roles cannot delete users
    return false
  }

  /**
   * Check if current user can manage roles for a target user
   * @param targetRole Role of the target user
   * @returns true if current user can manage the target user's role
   */
  function canManageUserRole(targetRole?: UserRole): boolean {
    const currentRole = user.value?.role

    // Only superadmin and admin can manage roles
    if (currentRole === 'superadmin') {
      return true
    }

    if (currentRole === 'admin') {
      // Admin cannot change roles of other admins or superadmins
      return targetRole !== 'admin' && targetRole !== 'superadmin'
    }

    return false
  }

  return {
    canDeleteUser,
    canManageUserRole,
  }
}
