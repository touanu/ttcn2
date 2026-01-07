import type { UserRole } from '@shared/types'
import { defineAbility } from '#imports'
import { PERMISSIONS } from '@shared/constants'

/**
 * Define abilities based on backend permissions
 * These abilities integrate with the RBAC system from the backend
 */

// User management abilities
export const viewUsers = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.USERS.VIEW)
})

export const createUser = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.USERS.CREATE)
})

export const updateUser = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.USERS.UPDATE)
})

export const deleteUser = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.USERS.DELETE)
})

export const manageUserRoles = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.USERS.MANAGE_ROLES)
})

// Course management abilities
export const viewCourses = defineAbility({ allowGuest: true }, (user: { permissions: string[] } | null) => {
  // Guests can view courses, but may have limited access
  if (!user)
    return true
  return user.permissions.includes(PERMISSIONS.COURSES.VIEW)
})

export const createCourse = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.COURSES.CREATE)
})

export const updateCourse = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.COURSES.UPDATE)
})

export const deleteCourse = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.COURSES.DELETE)
})

export const publishCourse = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.COURSES.PUBLISH)
})

// Lesson management abilities
export const viewLessons = defineAbility({ allowGuest: true }, (user: { permissions: string[] } | null) => {
  if (!user)
    return true
  return user.permissions.includes(PERMISSIONS.LESSONS.VIEW)
})

export const createLesson = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.LESSONS.CREATE)
})

export const updateLesson = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.LESSONS.UPDATE)
})

export const deleteLesson = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.LESSONS.DELETE)
})

// Quiz management abilities
export const viewQuizzes = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.QUIZZES.VIEW)
})

export const createQuiz = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.QUIZZES.CREATE)
})

export const updateQuiz = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.QUIZZES.UPDATE)
})

export const deleteQuiz = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.QUIZZES.DELETE)
})

export const gradeQuiz = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.QUIZZES.GRADE)
})

// Enrollment abilities
export const viewEnrollments = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.ENROLLMENTS.VIEW)
})

export const createEnrollment = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.ENROLLMENTS.CREATE)
})

export const updateEnrollment = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.ENROLLMENTS.UPDATE)
})

export const deleteEnrollment = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.ENROLLMENTS.DELETE)
})

// System abilities
export const accessSystemSettings = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.SYSTEM.SETTINGS)
})

export const viewSystemLogs = defineAbility((user: { permissions: string[] }) => {
  return user.permissions.includes(PERMISSIONS.SYSTEM.LOGS)
})

// Role-based abilities
export const isStudent = defineAbility((user: { role: UserRole }) => {
  return user.role === 'student'
})

export const isTeacher = defineAbility((user: { role: UserRole }) => {
  return user.role === 'teacher'
})

export const isAdmin = defineAbility((user: { role: UserRole }) => {
  return user.role === 'admin' || user.role === 'superadmin'
})

export const isSuperAdmin = defineAbility((user: { role: UserRole }) => {
  return user.role === 'superadmin'
})

// Authentication check
export const isAuthenticated = defineAbility({ allowGuest: true }, (user: unknown | null) => {
  return user !== null
})
