import type { Course } from '@shared/types'
import type { ObjectId } from 'mongoose'

export interface CourseDB extends Omit<Course, '_id' | 'authorId' | 'lessonIds'> {
  _id?: ObjectId
  authorId: ObjectId
  lessonIds: ObjectId[]
}
