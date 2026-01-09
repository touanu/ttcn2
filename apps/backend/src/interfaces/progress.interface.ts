import type { Progress } from '@shared/types'
import type { ObjectId } from 'mongoose'

export interface ProgressDB extends Omit<Progress, '_id' | 'userId' | 'courseId' | 'completedLessonIds'> {
  _id?: ObjectId
  userId: ObjectId
  courseId: ObjectId
  completedLessonIds: ObjectId[]
}
