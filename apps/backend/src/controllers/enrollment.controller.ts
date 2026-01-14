import type { Enrollment } from '@shared/types/enrollment'
import type { SuccessResponseBody } from '@shared/types/index'
import type { Request, RequestHandler, Response } from 'express'
import { HttpException } from '@exceptions/HttpException'
import { EnrollmentService } from '@services/enrollment.service'
import { UsersService } from '@services/users.service'
import { asyncHandler } from '@utils/asyncHandler'
import { convertEnrollmentToResponse } from '@utils/convertToResponse'
import { Types } from 'mongoose'
import { inject, injectable } from 'tsyringe'

@injectable()
export class EnrollmentController {
  constructor(
    @inject(EnrollmentService) private enrollmentService: EnrollmentService,
    @inject(UsersService) private userService: UsersService,
  ) {}

  /**
   * Đăng ký khóa học
   */
  public createEnrollment: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const enrollmentData = req.body
    const newEnrollment = await this.enrollmentService.createEnrollment(enrollmentData)
    const response = convertEnrollmentToResponse(newEnrollment)

    res.status(201).json({
      success: true,
      message: 'ENROLLMENT.CREATED',
      data: response,
    } as SuccessResponseBody<Enrollment>)
  })

  /**
   * Lấy tất cả đăng ký
   */
  public getAllEnrollments: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { sort, limit } = req.query
    const options = {
      sort: sort as string,
      limit: limit ? Number(limit) : undefined,
    }
    const enrollments = await this.enrollmentService.getAllEnrollments(options)
    const response = enrollments.map(convertEnrollmentToResponse)

    res.status(200).json({
      success: true,
      message: 'ENROLLMENT.FOUND',
      data: response,
    } as SuccessResponseBody<Enrollment[]>)
  })

  /**
   * Lấy đăng ký theo ID
   */
  public getEnrollmentById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const enrollment = await this.enrollmentService.getEnrollmentById(id)
    const response = convertEnrollmentToResponse(enrollment)

    res.status(200).json({
      success: true,
      message: 'ENROLLMENT.FOUND',
      data: response,
    } as SuccessResponseBody<Enrollment>)
  })

  /**
   * Lấy các đăng ký của người dùng
   */
  public getEnrollmentsByUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params
    const student = await this.userService.getUserById(userId)

    if (!student || student.role !== 'student' || !student._id)
      throw new HttpException(404, 'USERS.USER_NOT_FOUND')

    const enrollments = await this.enrollmentService.getEnrollmentsByUser(student._id)
    const response = enrollments.map(convertEnrollmentToResponse)

    res.status(200).json({
      success: true,
      message: 'ENROLLMENT.FOUND',
      data: response,
    } as SuccessResponseBody<Enrollment[]>)
  })

  /**
   * Lấy các đăng ký của khóa học
   */
  public getEnrollmentsByCourse: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { courseId } = req.params

    if (!Types.ObjectId.isValid(courseId)) {
      throw new HttpException(400, 'ENROLLMENT.INVALID_COURSE_ID')
    }

    const enrollments = await this.enrollmentService.getEnrollmentsByCourse(new Types.ObjectId(courseId))
    const response = enrollments.map(convertEnrollmentToResponse)

    res.status(200).json({
      success: true,
      message: 'ENROLLMENT.FOUND',
      data: response,
    } as SuccessResponseBody<Enrollment[]>)
  })

  /**
   * Kiểm tra đăng ký
   */
  public checkEnrollment: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { userId, courseId } = req.params

    if (!Types.ObjectId.isValid(userId)) {
      throw new HttpException(400, 'ENROLLMENT.INVALID_USER_ID')
    }

    if (!Types.ObjectId.isValid(courseId)) {
      throw new HttpException(400, 'ENROLLMENT.INVALID_COURSE_ID')
    }

    const isEnrolled = await this.enrollmentService.checkEnrollment(new Types.ObjectId(userId), new Types.ObjectId(courseId))

    res.status(200).json({
      success: true,
      message: isEnrolled ? 'ENROLLMENT.IS_ENROLLED' : 'ENROLLMENT.NOT_ENROLLED',
      data: { isEnrolled },
    } as SuccessResponseBody<{ isEnrolled: boolean }>)
  })

  /**
   * Cập nhật đăng ký
   */
  public updateEnrollment: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const updateData = req.body
    const updatedEnrollment = await this.enrollmentService.updateEnrollment(id, updateData)
    const response = convertEnrollmentToResponse(updatedEnrollment)

    res.status(200).json({
      success: true,
      message: 'ENROLLMENT.UPDATED',
      data: response,
    } as SuccessResponseBody<Enrollment>)
  })

  /**
   * Cập nhật tiến độ
   */
  public updateProgress: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const { progressPercentage } = req.body
    const updatedEnrollment = await this.enrollmentService.updateProgress(id, progressPercentage)
    const response = convertEnrollmentToResponse(updatedEnrollment)

    res.status(200).json({
      success: true,
      message: 'ENROLLMENT.PROGRESS_UPDATED',
      data: response,
    } as SuccessResponseBody<Enrollment>)
  })

  /**
   * Xóa đăng ký
   */
  public deleteEnrollment: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    await this.enrollmentService.deleteEnrollment(id)

    res.status(200).json({
      success: true,
      message: 'ENROLLMENT.DELETED',
    } as SuccessResponseBody<null>)
  })

  /**
   * Đếm số đăng ký của khóa học
   */
  public countEnrollmentsByCourse: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { courseId } = req.params
    const count = await this.enrollmentService.countEnrollmentsByCourse(new Types.ObjectId(courseId))

    res.status(200).json({
      success: true,
      message: 'ENROLLMENT.COUNT',
      data: { count },
    } as SuccessResponseBody<{ count: number }>)
  })
}
