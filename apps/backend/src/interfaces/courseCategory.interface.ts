import type { CourseCategory } from '@shared/types'
import type { ObjectId } from 'mongoose'

export interface CourseCategoryDB extends Omit<CourseCategory, '_id'> {
  _id: ObjectId
}
