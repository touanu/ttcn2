import type { User } from '@shared/interfaces'

export const USER_ROLES = ['student', 'teacher', 'admin', 'superadmin'] as const

export type UserRole = typeof USER_ROLES[number]

export type UserDB = User & Required<Pick<User, '_id'>>

export type SafeUser = User & Omit<UserDB, 'password'>
