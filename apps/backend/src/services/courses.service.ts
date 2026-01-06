import type { Course } from '@shared/interfaces'
import type { CourseDB } from '@shared/types'
import type { ObjectId } from 'mongoose'
import { HttpException } from '@exceptions/HttpException'
import { CourseModel } from '@models/course.model'
import { injectable } from 'tsyringe'

@injectable()
export class CoursesService {
  async getCourseById(courseId: string) {
    const course = await CourseModel.findById(courseId).lean<CourseDB>().exec()
    if (!course)
      throw new HttpException(404, 'COURSE.NOT_FOUND')
    return course
  }

  async getAllCourses(): Promise<CourseDB[]> {
    const courses = await CourseModel.find().lean<CourseDB[]>().exec()
    return courses
  }

  async getCoursesByAuthor(authorId: ObjectId): Promise<CourseDB[]> {
    const courses = await CourseModel
      .find({ authorId })
      .lean<CourseDB[]>()
      .exec()
    return courses
  }

  async createCourse(courseData: Course): Promise<CourseDB> {
    const newCourse = await CourseModel.create(courseData)
    return newCourse.toObject()
  }

  async updateCourse(courseId: string, updateData: Partial<CourseDB>): Promise<CourseDB> {
    const updatedCourse = await CourseModel
      .findByIdAndUpdate(courseId, updateData, { new: true })
      .lean<CourseDB>()
      .exec()
    if (!updatedCourse)
      throw new HttpException(404, 'COURSE.NOT_FOUND')
    return updatedCourse
  }

  async deleteCourse(courseId: string): Promise<void> {
    const result = await CourseModel.findByIdAndDelete(courseId).exec()
    if (!result)
      throw new HttpException(404, 'COURSE.NOT_FOUND')
  }
}
