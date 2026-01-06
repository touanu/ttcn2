import type { SuccessResponseBody } from '@shared/interfaces'
import type { LessonDB } from '@shared/types'
import type { Request, RequestHandler, Response } from 'express'
import { LessonsService } from '@services/lessons.service'
import { asyncHandler } from '@utils/asyncHandler'
import { inject, injectable } from 'tsyringe'

@injectable()
export class LessonsController {
  constructor(
    @inject(LessonsService) private readonly lessonsService: LessonsService,
  ) {}

  public createLesson: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { courseId } = req.params
    const lessonData = req.body
    const lesson = await this.lessonsService.createLesson(courseId, lessonData)

    const response: SuccessResponseBody<LessonDB> = {
      success: true,
      data: lesson,
      message: 'LESSON.CREATED',
    }

    res.status(201).json(response)
  })

  public getLessonById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const lesson = await this.lessonsService.getLessonById(id)

    const response: SuccessResponseBody<LessonDB> = {
      success: true,
      data: lesson,
      message: 'LESSON.FOUND',
    }

    res.status(200).json(response)
  })

  public getCourseLessons: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { courseId } = req.params
    const lessons = await this.lessonsService.getLessonsByCourseId(courseId)

    const response: SuccessResponseBody<LessonDB[]> = {
      success: true,
      data: lessons,
      message: 'LESSONS.FOUND',
    }

    res.status(200).json(response)
  })

  public updateLesson: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const updateData = req.body
    const lesson = await this.lessonsService.updateLesson(id, updateData)

    const response: SuccessResponseBody<LessonDB> = {
      success: true,
      data: lesson,
      message: 'LESSON.UPDATED',
    }

    res.status(200).json(response)
  })

  public deleteLesson: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    await this.lessonsService.deleteLesson(id)

    const response: SuccessResponseBody<null> = {
      success: true,
      data: null,
      message: 'LESSON.DELETED',
    }

    res.status(200).json(response)
  })

  public reorderLessons: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { courseId } = req.params
    const { lessonOrders } = req.body
    await this.lessonsService.reorderLessons(courseId, lessonOrders)

    const response: SuccessResponseBody<null> = {
      success: true,
      data: null,
      message: 'LESSONS.REORDERED',
    }

    res.status(200).json(response)
  })
}
