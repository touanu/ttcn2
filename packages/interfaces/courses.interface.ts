import type { CourseLevel } from '@shared/types/course'
import type { ObjectId } from 'mongoose'

export interface Course {
  _id?: ObjectId
  title: string
  description: string
  thumbnail: string
  authorId: ObjectId
  level: CourseLevel
  lessonIds: ObjectId[]
  createdAt: Date
  updatedAt: Date
}
