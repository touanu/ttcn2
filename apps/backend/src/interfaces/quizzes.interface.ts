import type { Attempt, Question, Quiz } from '@shared/types'
import type { ObjectId } from 'mongoose'

export interface QuizDB extends Omit<Quiz, '_id' | 'lessonId' | 'questionIds'> {
  _id?: ObjectId
  lessonId: ObjectId
  questionIds: ObjectId[]
}

export interface QuestionDB extends Omit<Question, '_id' | 'quizId'> {
  _id?: ObjectId
  quizId: ObjectId
}

export interface AttemptDB extends Omit<Attempt, '_id' | 'userId' | 'quizId'> {
  _id?: ObjectId
  userId: ObjectId
  quizId: ObjectId
}
