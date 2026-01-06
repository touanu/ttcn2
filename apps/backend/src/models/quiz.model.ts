import type { Question, Quiz } from '@shared/interfaces'
import { QUESTION_TYPES } from '@shared/types'
import { model, Schema } from 'mongoose'

const QuizSchema = new Schema<Quiz>({
  lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  questionIds: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

QuizSchema.index({ lessonId: 1 })

const QuestionSchema = new Schema<Question>({
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  type: { type: String, enum: QUESTION_TYPES, required: true },
  prompt: { type: String, required: true },
  choices: [{ type: String }],
  correctAnswer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

QuestionSchema.index({ quizId: 1 })

export const QuizModel = model<Quiz>('Quiz', QuizSchema)
export const QuestionModel = model<Question>('Question', QuestionSchema)
