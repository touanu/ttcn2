import type { RequestWithUser } from '@interfaces/auth.interface'
import type { Course, SuccessResponseBody } from '@shared/types'
import type { Request, RequestHandler, Response } from 'express'
import { HttpException } from '@exceptions/HttpException'
import { CoursesService } from '@services/courses.service'
import { UsersService } from '@services/users.service'
import { asyncHandler } from '@utils/asyncHandler'
import { convertCourseToResponse } from '@utils/convertToResponse'
import { inject, injectable } from 'tsyringe'

@injectable()
export class CoursesController {
  constructor(
    @inject(CoursesService) private readonly coursesService: CoursesService,
    @inject(UsersService) private readonly userService: UsersService,
  ) { }

  getCourseById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const courseId: string = req.params.id
    const course = await this.coursesService.getCourseById(courseId)

    const response: SuccessResponseBody<Course> = {
      success: true,
      data: convertCourseToResponse(course),
      message: 'COURSES.GET_SUCCESS',
    }

    res.status(200).json(response)
  })

  getAllCourses: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const courses = await this.coursesService.getAllCourses()

    const response: SuccessResponseBody<Course[]> = {
      success: true,
      data: courses.map(convertCourseToResponse),
      message: 'COURSES.GET_ALL_SUCCESS',
    }

    res.status(200).json(response)
  })

  getCoursesByAuthor: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const authorId: string = req.params.authorId
    const author = await this.userService.getUserById(authorId)
    if (!author)
      throw new HttpException(404, 'USERS.NOT_FOUND')

    const courses = await this.coursesService.getCoursesByAuthor(author._id)

    const response: SuccessResponseBody<Course[]> = {
      success: true,
      data: courses.map(convertCourseToResponse),
      message: 'COURSES.GET_BY_AUTHOR_SUCCESS',
    }

    res.status(200).json(response)
  })

  getCourses: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { search, status, page, limit, sort } = req.query

    const queryOptions: {
      search?: string
      status?: string
      page?: number
      limit?: number
      sort?: string
    } = {}

    if (search && typeof search === 'string')
      queryOptions.search = search

    if (status && typeof status === 'string')
      queryOptions.status = status

    if (page && typeof page === 'string') {
      const pageNum = Number.parseInt(page, 10)
      if (!Number.isNaN(pageNum) && pageNum > 0)
        queryOptions.page = pageNum
    }

    if (limit && typeof limit === 'string') {
      const limitNum = Number.parseInt(limit, 10)
      if (!Number.isNaN(limitNum) && limitNum > 0)
        queryOptions.limit = limitNum
    }

    if (sort && typeof sort === 'string')
      queryOptions.sort = sort

    const courses = await this.coursesService.getAllCourses(queryOptions)

    const response: SuccessResponseBody<Course[]> = {
      success: true,
      data: courses.map(convertCourseToResponse),
      message: 'COURSES.GET_ALL_SUCCESS',
    }

    res.status(200).json(response)
  })

  createCourse: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser
    const courseData: Course = req.body
    const { _id, ...dataToCreate } = courseData

    // Get authorId from authenticated user
    const authorId = userReq.user?._id
    if (!authorId)
      throw new HttpException(401, 'AUTH.UNAUTHORIZED')

    const course = await this.coursesService.createCourse({ ...dataToCreate, authorId: authorId.toString() } as any)

    const response: SuccessResponseBody<Course> = {
      success: true,
      data: convertCourseToResponse(course),
      message: 'COURSES.CREATE_SUCCESS',
    }

    res.status(201).json(response)
  })

  updateCourse: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const courseId: string = req.params.id
    const courseData: Partial<Course> = req.body
    const course = await this.coursesService.updateCourse(courseId, courseData)

    const response: SuccessResponseBody<Course> = {
      success: true,
      data: convertCourseToResponse(course),
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
