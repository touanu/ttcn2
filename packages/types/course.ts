import type { Course } from '@shared/interfaces'

export const COURSE_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const

export type CourseLevel = typeof COURSE_LEVELS[number]

export type CourseDB = Course & Required<Pick<Course, '_id'>>
