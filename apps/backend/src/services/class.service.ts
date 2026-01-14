import type { ClassDB } from '@interfaces/class.interface'
import type { ObjectId } from 'mongoose'
import { HttpException } from '@exceptions/HttpException'
import { ClassModel } from '@models/class.model'
import { Types } from 'mongoose'
import { injectable } from 'tsyringe'

@injectable()
export class ClassService {
  /**
   * Tạo lớp học mới
   */
  public async createClass(classData: Partial<ClassDB>): Promise<ClassDB> {
    const newClass = await ClassModel.create(classData)
    return newClass
    // .populate(['teacherId', 'studentIds'])
  }

  /**
   * Lấy tất cả lớp học
   */
  public async getAllClasses(): Promise<ClassDB[]> {
    return ClassModel
      .find()
      // .populate(['teacherId', 'studentIds'])
      .lean<ClassDB[]>()
      .exec()
  }

  /**
   * Lấy lớp học theo ID
   */
  public async getClassById(classId: string): Promise<ClassDB> {
    if (!Types.ObjectId.isValid(classId)) {
      throw new HttpException(400, 'MESSAGES.INVALID_ID', { resource: 'class' })
    }

    const classData = await ClassModel
      .findById(classId)
      .populate(['teacherId', 'studentIds'])
      .lean<ClassDB>()
      .exec()

    if (!classData) {
      throw new HttpException(404, 'MESSAGES.NOT_FOUND', { resource: 'class' })
    }

    return classData
  }

  /**
   * Lấy các lớp của giáo viên
   */
  public async getClassesByTeacher(teacherId: Types.ObjectId): Promise<ClassDB[]> {
    return ClassModel.find({ teacherId } as any)
      .populate(['teacherId', 'studentIds'])
  }

  /**
   * Lấy các lớp của học sinh
   */
  public async getClassesByStudent(studentId: Types.ObjectId): Promise<ClassDB[]> {
    return ClassModel.find({ studentIds: studentId } as any)
      .populate(['teacherId', 'studentIds'])
  }

  /**
   * Lấy các lớp theo khóa học
   */
  public async getClassesByCourse(courseId: Types.ObjectId): Promise<ClassDB[]> {
    return ClassModel.find({ courseId } as any)
      .populate(['teacherId', 'studentIds', 'courseId'])
      .lean<ClassDB[]>()
      .exec()
  }

  /**
   * Cập nhật lớp học
   */
  public async updateClass(classId: string, updateData: Partial<ClassDB>): Promise<ClassDB> {
    if (!Types.ObjectId.isValid(classId)) {
      throw new HttpException(400, 'MESSAGES.INVALID_ID', { resource: 'class' })
    }

    const updatedClass = await ClassModel.findByIdAndUpdate(
      classId,
      { ...updateData, updatedAt: new Date() },
      { new: true },
    ).populate(['teacherId', 'studentIds'])

    if (!updatedClass) {
      throw new HttpException(404, 'MESSAGES.NOT_FOUND', { resource: 'class' })
    }

    return updatedClass
  }

  /**
   * Thêm học sinh vào lớp
   */
  public async addStudentToClass(classId: string, studentId: ObjectId): Promise<ClassDB> {
    if (!Types.ObjectId.isValid(classId)) {
      throw new HttpException(400, 'MESSAGES.INVALID_ID', { resource: 'class' })
    }

    const classData = await ClassModel.findById(classId)
    if (!classData) {
      throw new HttpException(404, 'MESSAGES.NOT_FOUND', { resource: 'class' })
    }

    if (classData.studentIds.some(id => id.toString() === studentId.toString())) {
      throw new HttpException(400, 'CLASS.STUDENT_ALREADY_IN_CLASS')
    }

    const updatedClass = await ClassModel.findByIdAndUpdate(
      classId,
      { $push: { studentIds: studentId }, updatedAt: new Date() },
      { new: true },
    ).populate(['teacherId', 'studentIds'])

    if (!updatedClass) {
      throw new HttpException(404, 'MESSAGES.NOT_FOUND', { resource: 'class' })
    }

    return updatedClass
  }

  /**
   * Xóa học sinh khỏi lớp
   */
  public async removeStudentFromClass(classId: string, studentId: ObjectId): Promise<ClassDB> {
    if (!Types.ObjectId.isValid(classId)) {
      throw new HttpException(400, 'MESSAGES.INVALID_ID', { resource: 'class' })
    }

    const classData = await ClassModel.findById(classId)
    if (!classData) {
      throw new HttpException(404, 'MESSAGES.NOT_FOUND', { resource: 'class' })
    }

    if (!classData.studentIds.some(id => id.toString() === studentId.toString())) {
      throw new HttpException(400, 'CLASS.STUDENT_NOT_IN_CLASS')
    }

    const updatedClass = await ClassModel.findByIdAndUpdate(
      classId,
      { $pull: { studentIds: studentId }, updatedAt: new Date() },
      { new: true },
    ).populate(['teacherId', 'studentIds'])

    if (!updatedClass) {
      throw new HttpException(404, 'MESSAGES.NOT_FOUND', { resource: 'class' })
    }

    return updatedClass
  }

  /**
   * Xóa lớp học
   */
  public async deleteClass(classId: string): Promise<void> {
    if (!Types.ObjectId.isValid(classId)) {
      throw new HttpException(400, 'MESSAGES.INVALID_ID', { resource: 'class' })
    }

    const result = await ClassModel.findByIdAndDelete(classId)
    if (!result) {
      throw new HttpException(404, 'MESSAGES.NOT_FOUND', { resource: 'class' })
    }
  }
}
