export const USER_ROLES = ['student', 'teacher', 'admin', 'superadmin'] as const

export type UserRole = typeof USER_ROLES[number]
