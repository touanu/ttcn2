import type { Class, TimeTable } from '@shared/types/class'
import type { SuccessResponseBody } from '@shared/types/index'
import type { Request, RequestHandler, Response } from 'express'
import { ClassService } from '@services/classes.service'
import { TimeTableService } from '@services/timeTable.service'
import { asyncHandler } from '@utils/asyncHandler'
import { convertClassToResponse, convertTimeTableToResponse } from '@utils/convertToResponse'
import { Types } from 'mongoose'
import { inject, injectable } from 'tsyringe'

@injectable()
export class TimeTableController {
  constructor(
    @inject(TimeTableService) private timeTableService: TimeTableService,
    @inject(ClassService) private classService: ClassService,
  ) {}

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
    const { id } = req.params
    const timeTable = await this.timeTableService.getTimeTableById(id)
    const response = convertTimeTableToResponse(timeTable)

    res.status(200).json({
      success: true,
      message: 'TIMETABLE.FOUND',
      data: response,
    } as SuccessResponseBody<TimeTable>)
  })

  /**
   * Lấy lịch học theo lớp
   */
  public getTimeTablesByClass: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params
    const timeTables = await this.timeTableService.getTimeTablesByClass(new Types.ObjectId(classId))
    const response = timeTables.map(convertTimeTableToResponse)

    res.status(200).json({
      success: true,
      message: 'TIMETABLE.FOUND',
      data: response,
    } as SuccessResponseBody<TimeTable[]>)
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
    const { id } = req.params
    const updateData = req.body
    const updatedTimeTable = await this.timeTableService.updateTimeTable(id, updateData)
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
    const { id } = req.params
    await this.timeTableService.deleteTimeTable(id)

    res.status(200).json({
      success: true,
      message: 'TIMETABLE.DELETED',
    } as SuccessResponseBody<null>)
  })

  /**
   * Xóa tất cả lịch học của lớp
   */
  public deleteTimeTablesByClass: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { classId } = req.params
    await this.timeTableService.deleteTimeTablesByClass(new Types.ObjectId(classId))

    res.status(200).json({
      success: true,
      message: 'TIMETABLE.DELETED',
    } as SuccessResponseBody<null>)
  })

  /**
   * Lấy thông tin lớp học của lịch học
   */
  public getClassByTimeTable: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const timeTable = await this.timeTableService.getTimeTableById(id)

    if (!timeTable.classId) {
      res.status(200).json({
        success: true,
        message: 'CLASS.NOT_FOUND',
        data: null,
      } as SuccessResponseBody<null>)
      return
    }

    const classData = await this.classService.getClassById(timeTable.classId.toString())
    const response = convertClassToResponse(classData)

    res.status(200).json({
      success: true,
      message: 'CLASS.FOUND',
      data: response,
    } as SuccessResponseBody<Class>)
  })
}
