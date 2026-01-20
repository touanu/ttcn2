import type { DAY_OF_WEEK } from '@shared/constants'

export type DayOfWeek = typeof DAY_OF_WEEK[keyof typeof DAY_OF_WEEK]

export type ClassStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED'

export interface Class {
  _id?: string
  name: string
  courseId: string
  teacherId: string
  studentIds: string[]
  room?: string
  maxStudents?: number
  status?: ClassStatus
  startDate?: Date
  endDate?: Date
  openedAt?: Date
  endedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface TimeTable {
  _id?: string
  classId: string
  dayOfWeek: DayOfWeek
  startTime: Date
  endTime: Date
  createdAt: Date
  updatedAt: Date
}
