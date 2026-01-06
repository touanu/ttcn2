import type { SuccessResponseBody } from '@shared/interfaces'
import type { CourseDB } from '@shared/types'
import type { Request, RequestHandler, Response } from 'express'
import { CoursesService } from '@services/courses.service'
import { asyncHandler } from '@utils/asyncHandler'
import { inject, injectable } from 'tsyringe'

@injectable()
export class CoursesController {
  constructor(
    @inject(CoursesService) private readonly coursesService: CoursesService,
  ) { }

  getCourseById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const courseId: string = req.params.id
    const course = await this.coursesService.getCourseById(courseId)

    const response: SuccessResponseBody<CourseDB> = {
      success: true,
      data: course,
      message: 'COURSES.GET_SUCCESS',
    }

    res.status(200).json(response)
  })

  getAllCourses: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const courses = await this.coursesService.getAllCourses()

    const response: SuccessResponseBody<CourseDB[]> = {
      success: true,
      data: courses,
      message: 'COURSES.GET_ALL_SUCCESS',
    }

    res.status(200).json(response)
  })

  // getCoursesByAuthor: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
  //   const authorId: string = req.params.authorId
  //   const courses = await this.coursesService.getCoursesByAuthor(authorId)

  //   const response: SuccessResponseBody<CourseDB[]> = {
  //     success: true,
  //     data: courses,
  //     message: 'COURSES.GET_BY_AUTHOR_SUCCESS',
  //   }

  //   res.status(200).json(response)
  // }

  getCourses: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const courses = await this.coursesService.getAllCourses()

    const response: SuccessResponseBody<CourseDB[]> = {
      success: true,
      data: courses,
      message: 'COURSES.GET_ALL_SUCCESS',
    }

    res.status(200).json(response)
  })

  createCourse: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const courseData: CourseDB = req.body
    const course = await this.coursesService.createCourse(courseData)

    const response: SuccessResponseBody<CourseDB> = {
      success: true,
      data: course,
      message: 'COURSES.CREATE_SUCCESS',
    }

    res.status(201).json(response)
  })

  updateCourse: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const courseId: string = req.params.id
    const courseData: Partial<CourseDB> = req.body
    const course = await this.coursesService.updateCourse(courseId, courseData)

    const response: SuccessResponseBody<CourseDB> = {
      success: true,
      data: course,
      message: 'COURSES.UPDATE_SUCCESS',
    }

    res.status(200).json(response)
  })

  deleteCourse: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const courseId: string = req.params.id
    await this.coursesService.deleteCourse(courseId)

    const response: SuccessResponseBody<null> = {
      success: true,
      data: null,
      message: 'COURSES.DELETE_SUCCESS',
    }

    res.status(200).json(response)
  })
}
