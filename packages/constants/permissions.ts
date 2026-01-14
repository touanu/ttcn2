import type { Permission } from '@shared/types'

/**
 * Lấy tất cả các quyền từ đối tượng PERMISSIONS
 * @param obj Đối tượng PERMISSIONS
 * @returns Mảng các quyền
 */
function getAllPermissions(obj: typeof PERMISSIONS): Permission[] {
  return Object.values(obj).flatMap(category =>
    typeof category === 'string' ? category : Object.values(category),
  ) as Permission[]
}

export const PERMISSIONS = {
  USERS: {
    VIEW: 'user:read',
    CREATE: 'user:write',
    UPDATE: 'user:write',
    DELETE: 'user:delete',
    DELETE_ADMIN: 'user:delete-admin',
    MANAGE_ROLES: 'user:manage-roles',
  },
  COURSES: {
    VIEW: 'course:read',
    CREATE: 'course:write',
    UPDATE: 'course:write',
    DELETE: 'course:delete',
    PUBLISH: 'course:publish',
  },
  LESSONS: {
    VIEW: 'lesson:read',
    CREATE: 'lesson:write',
    UPDATE: 'lesson:write',
    DELETE: 'lesson:delete',
  },
  QUIZZES: {
    VIEW: 'quiz:read',
    CREATE: 'quiz:write',
    UPDATE: 'quiz:write',
    DELETE: 'quiz:delete',
    GRADE: 'quiz:grade',
  },
  ENROLLMENTS: {
    VIEW: 'enrollment:read',
    READ_ALL: 'enrollment:read-all',
    CREATE: 'enrollment:write',
    UPDATE: 'enrollment:write',
    DELETE: 'enrollment:delete',
  },
  CLASS: {
    VIEW: 'class:read',
    CREATE: 'class:write',
    UPDATE: 'class:write',
    DELETE: 'class:delete',
  },
  TIMETABLE: {
    VIEW: 'timetable:read',
    CREATE: 'timetable:write',
    UPDATE: 'timetable:write',
    DELETE: 'timetable:delete',
  },
  SYSTEM: {
    SETTINGS: 'system:settings',
    LOGS: 'system:logs',
  },
} as const

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  student: [
    PERMISSIONS.USERS.VIEW,
    PERMISSIONS.COURSES.VIEW,
    PERMISSIONS.LESSONS.VIEW,
    PERMISSIONS.QUIZZES.VIEW,
    PERMISSIONS.ENROLLMENTS.VIEW,
    PERMISSIONS.ENROLLMENTS.CREATE,
    PERMISSIONS.CLASS.VIEW,
    PERMISSIONS.TIMETABLE.VIEW,
  ],
  teacher: [
    PERMISSIONS.USERS.VIEW,
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.COURSES.VIEW,
    PERMISSIONS.COURSES.CREATE,
    PERMISSIONS.LESSONS.VIEW,
    PERMISSIONS.LESSONS.CREATE,
    PERMISSIONS.LESSONS.DELETE,
    PERMISSIONS.QUIZZES.VIEW,
    PERMISSIONS.QUIZZES.CREATE,
    PERMISSIONS.QUIZZES.DELETE,
    PERMISSIONS.QUIZZES.GRADE,
    PERMISSIONS.ENROLLMENTS.VIEW,
    PERMISSIONS.ENROLLMENTS.READ_ALL,
    PERMISSIONS.ENROLLMENTS.CREATE,
    PERMISSIONS.CLASS.VIEW,
    PERMISSIONS.CLASS.CREATE,
    PERMISSIONS.CLASS.UPDATE,
    PERMISSIONS.TIMETABLE.VIEW,
    PERMISSIONS.TIMETABLE.CREATE,
    PERMISSIONS.TIMETABLE.UPDATE,
  ],
  admin: [
    PERMISSIONS.USERS.VIEW,
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.USERS.DELETE,
    PERMISSIONS.USERS.MANAGE_ROLES,
    PERMISSIONS.COURSES.VIEW,
    PERMISSIONS.COURSES.CREATE,
    PERMISSIONS.COURSES.DELETE,
    PERMISSIONS.COURSES.PUBLISH,
    PERMISSIONS.LESSONS.VIEW,
    PERMISSIONS.LESSONS.CREATE,
    PERMISSIONS.LESSONS.DELETE,
    PERMISSIONS.QUIZZES.VIEW,
    PERMISSIONS.QUIZZES.CREATE,
    PERMISSIONS.QUIZZES.DELETE,
    PERMISSIONS.QUIZZES.GRADE,
    PERMISSIONS.ENROLLMENTS.VIEW,
    PERMISSIONS.ENROLLMENTS.READ_ALL,
    PERMISSIONS.ENROLLMENTS.CREATE,
    PERMISSIONS.ENROLLMENTS.DELETE,
    PERMISSIONS.CLASS.VIEW,
    PERMISSIONS.CLASS.CREATE,
    PERMISSIONS.CLASS.UPDATE,
    PERMISSIONS.CLASS.DELETE,
    PERMISSIONS.TIMETABLE.VIEW,
    PERMISSIONS.TIMETABLE.CREATE,
    PERMISSIONS.TIMETABLE.UPDATE,
    PERMISSIONS.TIMETABLE.DELETE,
    PERMISSIONS.SYSTEM.LOGS,
  ],
  superadmin: getAllPermissions(PERMISSIONS),
}
