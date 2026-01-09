export const QUESTION_TYPES = ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY'] as const

export type QuestionType = typeof QUESTION_TYPES[number]
export interface Quiz {
  _id?: string
  lessonId: string
  questionIds: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Question {
  _id?: string
  quizId: string
  type: QuestionType
  prompt: string
  choices: string[]
  correctAnswer: string
  createdAt: Date
  updatedAt: Date
}

export interface Attempt {
  _id?: string
  userId: string
  quizId: string
  score: number
  answers: Record<string, string>
  createdAt: Date
}
