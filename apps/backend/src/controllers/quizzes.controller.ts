import type { SuccessResponseBody } from '@shared/interfaces'
import type { QuestionDB, QuizDB } from '@shared/types'
import type { Request, RequestHandler, Response } from 'express'
import { QuizzesService } from '@services/quizzes.service'
import { asyncHandler } from '@utils/asyncHandler'
import { inject, injectable } from 'tsyringe'

@injectable()
export class QuizzesController {
  constructor(
    @inject(QuizzesService) private readonly quizzesService: QuizzesService,
  ) {}

  public createQuiz: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params
    const quizData = req.body
    const quiz = await this.quizzesService.createQuiz(lessonId, quizData)

    const response: SuccessResponseBody<QuizDB> = {
      success: true,
      data: quiz,
      message: 'QUIZ.CREATED',
    }

    res.status(201).json(response)
  })

  public getQuizById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const quiz = await this.quizzesService.getQuizById(id)

    const response: SuccessResponseBody<QuizDB> = {
      success: true,
      data: quiz,
      message: 'QUIZ.FOUND',
    }

    res.status(200).json(response)
  })

  public getLessonQuiz: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params
    const quiz = await this.quizzesService.getQuizByLessonId(lessonId)

    const response: SuccessResponseBody<QuizDB | null> = {
      success: true,
      data: quiz,
      message: quiz ? 'QUIZ.FOUND' : 'QUIZ.NOT_FOUND',
    }

    res.status(200).json(response)
  })

  public updateQuiz: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const updateData = req.body
    const quiz = await this.quizzesService.updateQuiz(id, updateData)

    const response: SuccessResponseBody<QuizDB> = {
      success: true,
      data: quiz,
      message: 'QUIZ.UPDATED',
    }

    res.status(200).json(response)
  })

  public deleteQuiz: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    await this.quizzesService.deleteQuiz(id)

    const response: SuccessResponseBody<null> = {
      success: true,
      data: null,
      message: 'QUIZ.DELETED',
    }

    res.status(200).json(response)
  })

  public createQuestion: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id: quizId } = req.params
    const questionData = req.body
    const question = await this.quizzesService.createQuestion(quizId, questionData)

    const response: SuccessResponseBody<QuestionDB> = {
      success: true,
      data: question,
      message: 'QUESTION.CREATED',
    }

    res.status(201).json(response)
  })

  public getQuestionById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const question = await this.quizzesService.getQuestionById(id)

    const response: SuccessResponseBody<QuestionDB> = {
      success: true,
      data: question,
      message: 'QUESTION.FOUND',
    }

    res.status(200).json(response)
  })

  public updateQuestion: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const updateData = req.body
    const question = await this.quizzesService.updateQuestion(id, updateData)

    const response: SuccessResponseBody<QuestionDB> = {
      success: true,
      data: question,
      message: 'QUESTION.UPDATED',
    }

    res.status(200).json(response)
  })

  public deleteQuestion: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    await this.quizzesService.deleteQuestion(id)

    const response: SuccessResponseBody<null> = {
      success: true,
      data: null,
      message: 'QUESTION.DELETED',
    }

    res.status(200).json(response)
  })
}
