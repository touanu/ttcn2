import type { QuestionType } from '@shared/types/quiz'
import type { ObjectId } from 'mongoose'

export interface Quiz {
  _id?: ObjectId
  lessonId: ObjectId
  questionIds: ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export interface Question {
  _id?: ObjectId
  quizId: ObjectId
  type: QuestionType
  prompt: string
  choices: string[]
  correctAnswer: string
  createdAt: Date
  updatedAt: Date
}

export interface Attempt {
  _id?: ObjectId
  userId: ObjectId
  quizId: ObjectId
  score: number
  answers: Record<string, string>
  createdAt: Date
}
