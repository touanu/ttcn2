import type { TimeTableDB } from '@interfaces/class.interface'
import { HttpException } from '@exceptions/HttpException'
import { TimeTableModel } from '@models/timeTable.model'
import { Types } from 'mongoose'
import { injectable } from 'tsyringe'

@injectable()
export class TimeTableService {
  /**
   * Tạo lịch học mới
   */
  public async createTimeTable(timeTableData: Partial<TimeTableDB>): Promise<TimeTableDB> {
    const newTimeTable = await TimeTableModel.create(timeTableData)
    return newTimeTable
  }

  /**
   * Lấy tất cả lịch học
   */
  public async getAllTimeTables(): Promise<TimeTableDB[]> {
    return TimeTableModel.find().populate('classId', 'name')
  }

  /**
   * Lấy lịch học theo ID
   */
  public async getTimeTableById(timeTableId: string): Promise<TimeTableDB> {
    if (!Types.ObjectId.isValid(timeTableId)) {
      throw new HttpException(400, 'MESSAGES.INVALID_ID', { resource: 'timetable' })
    }

    const timeTable = await TimeTableModel.findById(timeTableId).populate('classId', 'name')

    if (!timeTable) {
      throw new HttpException(404, 'MESSAGES.NOT_FOUND', { resource: 'timetable' })
    }

    return timeTable
  }

  /**
   * Lấy lịch học theo lớp
   */
  public async getTimeTablesByClass(classId: Types.ObjectId): Promise<TimeTableDB[]> {
    return TimeTableModel.find({ classId } as any)
      .populate('classId', 'name')
      .sort({ dayOfWeek: 1, startTime: 1 })
  }

  /**
   * Lấy lịch học theo ngày trong tuần
   */
  public async getTimeTablesByDayOfWeek(dayOfWeek: number): Promise<TimeTableDB[]> {
    return TimeTableModel.find({ dayOfWeek }).populate('classId', 'name')
  }

  /**
   * Cập nhật lịch học
   */
  public async updateTimeTable(timeTableId: string, updateData: Partial<TimeTableDB>): Promise<TimeTableDB> {
    if (!Types.ObjectId.isValid(timeTableId)) {
      throw new HttpException(400, 'MESSAGES.INVALID_ID', { resource: 'timetable' })
    }

    const updatedTimeTable = await TimeTableModel.findByIdAndUpdate(
      timeTableId,
      { ...updateData, updatedAt: new Date() },
      { new: true },
    ).populate('classId', 'name')

    if (!updatedTimeTable) {
      throw new HttpException(404, 'MESSAGES.NOT_FOUND', { resource: 'timetable' })
    }

    return updatedTimeTable
  }

  /**
   * Xóa lịch học
   */
  public async deleteTimeTable(timeTableId: string): Promise<void> {
    if (!Types.ObjectId.isValid(timeTableId)) {
      throw new HttpException(400, 'MESSAGES.INVALID_ID', { resource: 'timetable' })
    }

    const result = await TimeTableModel.findByIdAndDelete(timeTableId)
    if (!result) {
      throw new HttpException(404, 'MESSAGES.NOT_FOUND', { resource: 'timetable' })
    }
  }

  /**
   * Xóa tất cả lịch học của một lớp
   */
  public async deleteTimeTablesByClass(classId: Types.ObjectId): Promise<void> {
    await TimeTableModel.deleteMany({ classId } as any)
  }
}
