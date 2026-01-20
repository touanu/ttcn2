import type { EnrollmentDB } from '@interfaces/enrollment.interface'
import type { ObjectId } from 'mongoose'
import { HttpException } from '@exceptions/HttpException'
import { EnrollmentModel } from '@models/enrollment.model'
import { Types } from 'mongoose'
import { injectable } from 'tsyringe'

@injectable()
export class EnrollmentService {
  /**
   * Tạo đăng ký mới
   */
  public async createEnrollment(enrollmentData: Partial<EnrollmentDB>): Promise<EnrollmentDB> {
    const newEnrollment = await EnrollmentModel.create(enrollmentData)
    return newEnrollment
  }

  /**
   * Lấy tất cả đăng ký
   */
  public async getAllEnrollments(options?: { sort?: string, limit?: number }): Promise<EnrollmentDB[]> {
    let query = EnrollmentModel.find()
      .populate('userId', 'fullName email')
      .populate('courseId', 'title')

    // Apply sorting
    if (options?.sort) {
      const sortOrder = options.sort.startsWith('-') ? -1 : 1
      const sortField = options.sort.replace(/^-/, '')
      query = query.sort({ [sortField]: sortOrder })
    }
    else {
      query = query.sort({ enrolledAt: -1 })
    }

    // Apply limit
    if (options?.limit) {
      query = query.limit(options.limit)
    }

    return query
  }

  /**
   * Lấy đăng ký theo ID
   */
  public async getEnrollmentById(enrollmentId: string): Promise<EnrollmentDB> {
    if (!Types.ObjectId.isValid(enrollmentId)) {
      throw new HttpException(400, 'MESSAGES.INVALID_ID', { resource: 'enrollment' })
    }

    const enrollment = await EnrollmentModel.findById(enrollmentId)
      .populate('userId', 'fullName email')
      .populate('courseId', 'title')

    if (!enrollment) {
      throw new HttpException(404, 'MESSAGES.NOT_FOUND', { resource: 'enrollment' })
    }

    return enrollment
  }

  /**
   * Lấy các đăng ký của người dùng
   */
  public async getEnrollmentsByUser(userId: ObjectId): Promise<EnrollmentDB[]> {
    return EnrollmentModel.find({ userId })
      .populate('userId', 'fullName email')
      .populate('courseId', 'title')
      .sort({ enrolledAt: -1 })
      .lean<EnrollmentDB[]>()
      .exec()
  }

  /**
   * Lấy các đăng ký của khóa học
   */
  public async getEnrollmentsByCourse(courseId: ObjectId): Promise<EnrollmentDB[]> {
    return EnrollmentModel.find({ courseId })
      .populate('userId', 'fullName email')
      .populate('courseId', 'title')
      .sort({ enrolledAt: -1 })
  }

  /**
   * Cập nhật đăng ký
   */
  public async updateEnrollment(enrollmentId: string, updateData: Partial<EnrollmentDB>): Promise<EnrollmentDB> {
    if (!Types.ObjectId.isValid(enrollmentId)) {
      throw new HttpException(400, 'MESSAGES.INVALID_ID', { resource: 'enrollment' })
    }

    const updatedEnrollment = await EnrollmentModel.findByIdAndUpdate(
      enrollmentId,
      { ...updateData, updatedAt: new Date() },
      { new: true },
    )
      .populate('userId', 'fullName email')
      .populate('courseId', 'title')

    if (!updatedEnrollment) {
      throw new HttpException(404, 'MESSAGES.NOT_FOUND', { resource: 'enrollment' })
    }

    return updatedEnrollment
  }

  /**
   * Kiểm tra đăng ký
   */
  public async checkEnrollment(userId: ObjectId, courseId: ObjectId): Promise<boolean> {
    const enrollment = await EnrollmentModel.countDocuments({ userId, courseId })
    return !!enrollment
  }

  /**
   * Cập nhật tiến độ
   */
  public async updateProgress(enrollmentId: string, progressPercentage: number): Promise<EnrollmentDB> {
    if (!Types.ObjectId.isValid(enrollmentId)) {
      throw new HttpException(400, 'MESSAGES.INVALID_ID', { resource: 'enrollment' })
    }

    const updateData: Partial<EnrollmentDB> = {
      progressPercentage,
      updatedAt: new Date(),
    }

    // Nếu tiến độ đạt 100%, cập nhật trạng thái và thời gian hoàn thành
    if (progressPercentage >= 100) {
      updateData.status = 'completed'
      updateData.completedAt = new Date()
    }

    const updatedEnrollment = await EnrollmentModel.findByIdAndUpdate(
      enrollmentId,
      updateData,
      { new: true },
    )
      .populate('userId', 'fullName email')
      .populate('courseId', 'title')

    if (!updatedEnrollment) {
      throw new HttpException(404, 'MESSAGES.NOT_FOUND', { resource: 'enrollment' })
    }

    return updatedEnrollment
  }

  /**
   * Xóa đăng ký
   */
  public async deleteEnrollment(enrollmentId: string): Promise<void> {
    if (!Types.ObjectId.isValid(enrollmentId)) {
      throw new HttpException(400, 'MESSAGES.INVALID_ID', { resource: 'enrollment' })
    }

    const result = await EnrollmentModel.findByIdAndDelete(enrollmentId)
    if (!result) {
      throw new HttpException(404, 'MESSAGES.NOT_FOUND', { resource: 'enrollment' })
    }
  }

  /**
   * Đếm số đăng ký của khóa học
   */
  public async countEnrollmentsByCourse(courseId: ObjectId): Promise<number> {
    return EnrollmentModel.countDocuments({ courseId })
  }

  /**
   * Lấy thống kê đăng ký theo trạng thái
   */
  public async getEnrollmentStats(): Promise<{ status: string, count: number }[]> {
    const stats = await EnrollmentModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ])

    return stats
  }
}
