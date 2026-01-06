import type { ObjectId } from 'mongoose'

export interface Progress {
  _id?: ObjectId
  userId: ObjectId
  courseId: ObjectId
  completedLessonIds: ObjectId[]
  percentage: number
  updatedAt: Date
}
