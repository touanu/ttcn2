import type { RequestWithUser, SuccessResponseBody } from '@shared/interfaces'
import type { ProgressDB } from '@shared/types'
import type { Request, RequestHandler, Response } from 'express'
import { HttpException } from '@exceptions/HttpException'
import { ProgressService } from '@services/progress.service'
import { asyncHandler } from '@utils/asyncHandler'
import { inject, injectable } from 'tsyringe'

@injectable()
export class ProgressController {
  constructor(
    @inject(ProgressService) private readonly progressService: ProgressService,
  ) {}

  public getUserProgress: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser
    const userId = userReq.user?._id?.toString()

    if (!userId)
      throw new HttpException(401, 'AUTH.UNAUTHORIZED')

    const { courseId } = req.query
    const progress = await this.progressService.getUserProgress(userId, courseId as string | undefined)

    const response: SuccessResponseBody<ProgressDB[]> = {
      success: true,
      data: progress,
      message: 'PROGRESS.FOUND',
    }

    res.status(200).json(response)
  })

  public getCourseProgress: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser
    const userId = userReq.user?._id?.toString()
    const { courseId } = req.params

    if (!userId)
      throw new HttpException(401, 'AUTH.UNAUTHORIZED')

    const progress = await this.progressService.getCourseProgress(userId, courseId)

    const response: SuccessResponseBody<ProgressDB> = {
      success: true,
      data: progress,
      message: 'PROGRESS.FOUND',
    }

    res.status(200).json(response)
  })

  public markLessonComplete: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser
    const userId = userReq.user?._id?.toString()
    const { id: lessonId } = req.params

    if (!userId)
      throw new HttpException(401, 'AUTH.UNAUTHORIZED')

    const progress = await this.progressService.markLessonComplete(userId, lessonId)

    const response: SuccessResponseBody<ProgressDB> = {
      success: true,
      data: progress,
      message: 'LESSON.COMPLETED',
    }

    res.status(200).json(response)
  })

  public resetCourseProgress: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser
    const userId = userReq.user?._id?.toString()
    const { courseId } = req.params

    if (!userId)
      throw new HttpException(401, 'AUTH.UNAUTHORIZED')

    await this.progressService.resetCourseProgress(userId, courseId)

    const response: SuccessResponseBody<null> = {
      success: true,
      data: null,
      message: 'PROGRESS.RESET',
    }

    res.status(200).json(response)
  })
}
