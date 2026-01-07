export const PERMISSIONS = {
  USERS: {
    VIEW: 'user:read',
    CREATE: 'user:write',
    UPDATE: 'user:write',
    DELETE: 'user:delete',
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
    CREATE: 'enrollment:write',
    UPDATE: 'enrollment:write',
    DELETE: 'enrollment:delete',
  },
  SYSTEM: {
    SETTINGS: 'system:settings',
    LOGS: 'system:logs',
  },
} as const

// Kiểu Permission từ cấu trúc nested
type PermissionValues<T> = T extends Record<string, infer U>
  ? U extends string
    ? U
    : U extends Record<string, infer V>
      ? V
      : never
  : never

export type Permission = PermissionValues<typeof PERMISSIONS>

// Hàm helper để lấy tất cả permission values từ cấu trúc nested
function getAllPermissions(obj: typeof PERMISSIONS): Permission[] {
  return Object.values(obj).flatMap(category =>
    typeof category === 'string' ? category : Object.values(category),
  ) as Permission[]
}

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  student: [
    PERMISSIONS.USERS.VIEW,
    PERMISSIONS.COURSES.VIEW,
    PERMISSIONS.LESSONS.VIEW,
    PERMISSIONS.QUIZZES.VIEW,
    PERMISSIONS.ENROLLMENTS.VIEW,
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
    PERMISSIONS.ENROLLMENTS.CREATE,
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
    PERMISSIONS.ENROLLMENTS.CREATE,
    PERMISSIONS.ENROLLMENTS.DELETE,
    PERMISSIONS.SYSTEM.LOGS,
  ],
  superadmin: getAllPermissions(PERMISSIONS),
}
