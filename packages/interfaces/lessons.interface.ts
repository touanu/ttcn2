import type { ObjectId } from 'mongoose'

export interface Lesson {
  _id?: ObjectId
  courseId: ObjectId
  title: string
  content: string
  mediaIds: ObjectId[]
  quizId?: ObjectId
  orderIndex: number
  createdAt: Date
  updatedAt: Date
}
