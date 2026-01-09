import type { Attempt, SuccessResponseBody } from '@shared/types'
import type { Request, RequestHandler, Response } from 'express'
import type { RequestWithUser } from '@/interfaces/auth.interface'
import { HttpException } from '@exceptions/HttpException'
import { AttemptsService } from '@services/attempts.service'
import { asyncHandler } from '@utils/asyncHandler'
import { convertAttemptToResponse } from '@utils/convertToResponse'
import { inject, injectable } from 'tsyringe'

@injectable()
export class AttemptsController {
  constructor(
    @inject(AttemptsService) private readonly attemptsService: AttemptsService,
  ) {}

  public submitQuizAttempt: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser
    const { id: quizId } = req.params
    const userId = userReq.user?._id?.toString()
    const { answers } = req.body

    if (!userId)
      throw new HttpException(401, 'AUTH.UNAUTHORIZED')

    const attempt = await this.attemptsService.submitQuizAttempt(userId, quizId, answers)

    const response: SuccessResponseBody<Attempt> = {
      success: true,
      data: convertAttemptToResponse(attempt),
      message: 'ATTEMPT.SUBMITTED',
    }

    res.status(201).json(response)
  })

  public getAttemptById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const attempt = await this.attemptsService.getAttemptById(id)

    const response: SuccessResponseBody<Attempt> = {
      success: true,
      data: convertAttemptToResponse(attempt),
      message: 'ATTEMPT.FOUND',
    }

    res.status(200).json(response)
  })

  public getUserAttempts: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser
    const userId = userReq.user?._id?.toString()

    if (!userId)
      throw new HttpException(401, 'AUTH.UNAUTHORIZED')

    const { quizId } = req.query
    const attempts = await this.attemptsService.getUserAttempts(userId, quizId as string | undefined)

    const response: SuccessResponseBody<Attempt[]> = {
      success: true,
      data: attempts.map(convertAttemptToResponse),
      message: 'ATTEMPTS.FOUND',
    }

    res.status(200).json(response)
  })

  public getQuizAttempts: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { quizId } = req.params
    const attempts = await this.attemptsService.getQuizAttempts(quizId)

    const response: SuccessResponseBody<Attempt[]> = {
      success: true,
      data: attempts.map(convertAttemptToResponse),
      message: 'ATTEMPTS.FOUND',
    }

    res.status(200).json(response)
  })
}
