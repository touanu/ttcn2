import z from 'zod'

export const questionTypeSchema = z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY'])

export const questionSchema = z.object({
  type: questionTypeSchema,
  prompt: z.string().min(1, 'FORMS.QUESTION.PROMPT_REQUIRED'),
  choices: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1, 'FORMS.QUESTION.CORRECT_ANSWER_REQUIRED'),
})

export const createQuestionSchema = questionSchema

export const updateQuestionSchema = questionSchema.partial()

export const quizSchema = z.object({
  questionIds: z.array(z.string()).optional(),
})

export const createQuizSchema = quizSchema

export const updateQuizSchema = quizSchema.partial()

export const submitQuizSchema = z.object({
  answers: z.record(z.string(), z.string()),
})

export type QuestionTypeDto = z.infer<typeof questionTypeSchema>
export type CreateQuestionDto = z.infer<typeof createQuestionSchema>
export type UpdateQuestionDto = z.infer<typeof updateQuestionSchema>
export type CreateQuizDto = z.infer<typeof createQuizSchema>
export type UpdateQuizDto = z.infer<typeof updateQuizSchema>
export type SubmitQuizDto = z.infer<typeof submitQuizSchema>
