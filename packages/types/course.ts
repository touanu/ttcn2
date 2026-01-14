export const COURSE_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const
export const COURSE_STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const

export type CourseLevel = typeof COURSE_LEVELS[number]
export type CourseStatus = typeof COURSE_STATUSES[number]

export interface Course {
  _id?: string
  title: string
  description: string
  thumbnail: string
  authorId: string
  categoryId: string
  level: CourseLevel
  status: CourseStatus
  lessonIds: string[]
  classIds: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CourseCategory {
  _id?: string
  name: string
  description: string
  createdAt: Date
}
