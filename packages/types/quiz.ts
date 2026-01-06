import type { Attempt, Question, Quiz } from '@shared/interfaces/quizzes.interface'

export const QUESTION_TYPES = ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY'] as const

export type QuestionType = typeof QUESTION_TYPES[number]

export type QuizDB = Quiz & Required<Pick<Quiz, '_id'>>

export type QuestionDB = Question & Required<Pick<Question, '_id'>>

export type AttemptDB = Attempt & Required<Pick<Attempt, '_id'>>
