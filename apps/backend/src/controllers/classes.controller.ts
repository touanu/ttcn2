import type { Class, TimeTable } from '@shared/types/class'
import type { SuccessResponseBody } from '@shared/types/index'
import type { Request, RequestHandler, Response } from 'express'
import { HttpException } from '@exceptions/HttpException'
import { ClassService } from '@services/classes.service'
import { CoursesService } from '@services/courses.service'
import { TimeTableService } from '@services/timeTable.service'
import { UsersService } from '@services/users.service'
import { asyncHandler } from '@utils/asyncHandler'
import { convertClassToResponse, convertStringToObjectId, convertTimeTableToResponse } from '@utils/convertToResponse'
import { Types } from 'mongoose'
import { inject, injectable } from 'tsyringe'

@injectable()
export class ClassController {
  constructor(
    @inject(ClassService) private classService: ClassService,
    @inject(TimeTableService) private timeTableService: TimeTableService,
    @inject(UsersService) private userService: UsersService,
    @inject(CoursesService) private courseService: CoursesService,
  ) {}

  /**
   * Tạo lớp học mới
   */
  public createClass: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const classData: Partial<Class> = req.body
    const newClass = await this.classService.createClass({ ...classData })
    await this.courseService.addClass(newClass.courseId, newClass._id)
    const response = convertClassToResponse(newClass)

    res.status(201).json({
      success: true,
      message: 'CLASS.CREATED',
      data: response,
    } as SuccessResponseBody<Class>)
  })

  /**
   * Lấy tất cả lớp học
   */
  public getAllClasses: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const classes = await this.classService.getAllClasses()
    const response = classes.map(convertClassToResponse)

    res.status(200).json({
      success: true,
      data: response,
    } as SuccessResponseBody<Class[]>)
  })

  /**
   * Lấy lớp học theo ID
   */
  public getClassById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const classData = await this.classService.getClassById(id)
    const response = convertClassToResponse(classData)

    res.status(200).json({
      success: true,
      data: response,
    } as SuccessResponseBody<Class>)
  })

  /**
   * Lấy các lớp của giáo viên
   */
  public getClassesByTeacher: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { teacherId } = req.params
    const teacher = await this.userService.findOne({
      _id: convertStringToObjectId(teacherId),
      role: 'teacher',
    })

    const classes = await this.classService.getClassesByTeacher(teacher._id)
    const response = classes.map(convertClassToResponse)

    res.status(200).json({
      success: true,
      data: response,
    } as SuccessResponseBody<Class[]>)
  })

  /**
   * Lấy các lớp của học sinh
   */
  public getClassesByStudent: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { studentId } = req.params
    const student = await this.userService.findOne({
      _id: convertStringToObjectId(studentId),
      role: 'teacher',
    })

    const classes = await this.classService.getClassesByStudent(student._id)
    const response = classes.map(convertClassToResponse)

    res.status(200).json({
      success: true,
      data: response,
    } as SuccessResponseBody<Class[]>)
  })

  /**
   * Lấy các lớp theo khóa học
   */
  public getClassesByCourse: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { courseId } = req.params

    const courseObjectId = convertStringToObjectId(courseId)
    if (!courseObjectId)
      throw new HttpException(400, 'COURSES.ID.REQUIRED')

    const classes = await this.classService.getClassesByCourse(courseObjectId)
    const response = classes.map(convertClassToResponse)

    res.status(200).json({
      success: true,
      data: response,
    } as SuccessResponseBody<Class[]>)
  })

  /**
   * Cập nhật lớp học
   */
  public updateClass: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const updateData = req.body
    const updatedClass = await this.classService.updateClass(id, updateData)
    const response = convertClassToResponse(updatedClass)

    res.status(200).json({
      success: true,
      message: 'CLASS.UPDATED',
      data: response,
    } as SuccessResponseBody<Class>)
  })

  /**
   * Thêm học sinh vào lớp
   */
  public addStudentToClass: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const { studentId } = req.body
    const student = await this.userService.findUserById(studentId)

    if (!student || student.role !== 'student' || !student._id)
      throw new HttpException(404, 'USERS.USER_NOT_FOUND')

    const updatedClass = await this.classService.addStudentToClass(id, student._id)
    const response = convertClassToResponse(updatedClass)

    res.status(200).json({
      success: true,
      message: 'CLASS.STUDENT_ADDED',
      data: response,
    } as SuccessResponseBody<Class>)
  })

  /**
   * Xóa học sinh khỏi lớp
   */
  public removeStudentFromClass: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id, studentId } = req.params
    const student = await this.userService.findUserById(studentId)

    if (!student || student.role !== 'student' || !student._id)
      throw new HttpException(404, 'USERS.USER_NOT_FOUND')

    const updatedClass = await this.classService.removeStudentFromClass(id, student._id)
    const response = convertClassToResponse(updatedClass)

    res.status(200).json({
      success: true,
      message: 'CLASS.STUDENT_REMOVED',
      data: response,
    } as SuccessResponseBody<Class>)
  })

  /**
   * Xóa lớp học
   */
  public deleteClass: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    await this.classService.deleteClass(id)

    res.status(200).json({
      success: true,
      message: 'CLASS.DELETED',
    } as SuccessResponseBody<null>)
  })

  /**
   * Lấy lịch học của lớp
   */
  public getTimeTablesByClass: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const timeTables = await this.timeTableService.getTimeTablesByClass(new Types.ObjectId(id))
    const response = timeTables.map(convertTimeTableToResponse)

    res.status(200).json({
      success: true,
      message: 'TIMETABLE.FOUND',
      data: response,
    } as SuccessResponseBody<TimeTable[]>)
  })

  /**
   * Xóa tất cả lịch học của lớp
   */
  public deleteTimeTablesByClass: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    await this.timeTableService.deleteTimeTablesByClass(new Types.ObjectId(id))

    res.status(200).json({
      success: true,
      message: 'TIMETABLE.DELETED',
    } as SuccessResponseBody<null>)
  })

  /**
   * Tạo lịch học mới
   */
  public createTimeTable: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const timeTableData = req.body
    const newTimeTable = await this.timeTableService.createTimeTable(timeTableData)
    const response = convertTimeTableToResponse(newTimeTable)

    res.status(201).json({
      success: true,
      message: 'TIMETABLE.CREATED',
      data: response,
    } as SuccessResponseBody<TimeTable>)
  })

  /**
   * Lấy tất cả lịch học
   */
  public getAllTimeTables: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const timeTables = await this.timeTableService.getAllTimeTables()
    const response = timeTables.map(convertTimeTableToResponse)

    res.status(200).json({
      success: true,
      message: 'TIMETABLE.FOUND',
      data: response,
    } as SuccessResponseBody<TimeTable[]>)
  })

  /**
   * Lấy lịch học theo ID
   */
  public getTimeTableById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { timeTableId } = req.params
    const timeTable = await this.timeTableService.getTimeTableById(timeTableId)
    const response = convertTimeTableToResponse(timeTable)

    res.status(200).json({
      success: true,
      message: 'TIMETABLE.FOUND',
      data: response,
    } as SuccessResponseBody<TimeTable>)
  })

  /**
   * Lấy lịch học theo ngày trong tuần
   */
  public getTimeTablesByDayOfWeek: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { dayOfWeek } = req.params
    const timeTables = await this.timeTableService.getTimeTablesByDayOfWeek(Number(dayOfWeek))
    const response = timeTables.map(convertTimeTableToResponse)

    res.status(200).json({
      success: true,
      message: 'TIMETABLE.FOUND',
      data: response,
    } as SuccessResponseBody<TimeTable[]>)
  })

  /**
   * Cập nhật lịch học
   */
  public updateTimeTable: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { timeTableId } = req.params
    const updateData = req.body
    const updatedTimeTable = await this.timeTableService.updateTimeTable(timeTableId, updateData)
    const response = convertTimeTableToResponse(updatedTimeTable)

    res.status(200).json({
      success: true,
      message: 'TIMETABLE.UPDATED',
      data: response,
    } as SuccessResponseBody<TimeTable>)
  })

  /**
   * Xóa lịch học
   */
  public deleteTimeTable: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { timeTableId } = req.params
    await this.timeTableService.deleteTimeTable(timeTableId)

    res.status(200).json({
      success: true,
      message: 'TIMETABLE.DELETED',
    } as SuccessResponseBody<null>)
  })
}
