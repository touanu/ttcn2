import type { Lesson } from '@shared/types'
import type { ObjectId } from 'mongoose'

export interface LessonDB extends Omit<Lesson, '_id' | 'courseId' | 'mediaIds' | 'quizId'> {
  _id?: ObjectId
  courseId: ObjectId
  mediaIds: ObjectId[]
  quizId?: ObjectId
}
