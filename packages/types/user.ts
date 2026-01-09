export const USER_ROLES = ['student', 'teacher', 'admin', 'superadmin'] as const

export type UserRole = typeof USER_ROLES[number]

export interface User {
  _id?: string
  username: string
  email: string
  isEmailVerified?: boolean
  password: string
  fullName: string
  role?: UserRole
  profilePictureUrl?: string
  createdAt?: Date
  updatedAt?: Date
}

export type SafeUser = Omit<User, 'password'>

export interface RequestVerifyEmailResponse {
  success: true
  data: { email: string }
  message?: string
}

export interface DashboardStats {
  totalUsers: number
  totalCourses: number
  activeCourses: number
  totalLessons: number
}
