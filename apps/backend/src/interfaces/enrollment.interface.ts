import type { Enrollment } from '@shared/types'
import type { ObjectId } from 'mongoose'

export interface EnrollmentDB extends Omit<Enrollment, '_id' | 'userId' | 'courseId'> {
  _id?: ObjectId
  userId: ObjectId
  courseId: ObjectId
}
