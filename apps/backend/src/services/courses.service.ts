import type { CourseDB } from '@interfaces/courses.interface'
import type { Course } from '@shared/types'
import type { ObjectId } from 'mongoose'
import { HttpException } from '@exceptions/HttpException'
import { CourseModel } from '@models/course.model'
import { injectable } from 'tsyringe'

@injectable()
export class CoursesService {
  async getCourseById(courseId: string): Promise<CourseDB> {
    const course = await CourseModel.findById(courseId).lean<CourseDB>().exec()
    if (!course)
      throw new HttpException(404, 'COURSE.NOT_FOUND')
    return course
  }

  async getAllCourses(options?: {
    search?: string
    status?: string
    page?: number
    limit?: number
    sort?: string
  }): Promise<CourseDB[]> {
    const query: any = {}

    // Filter by status
    if (options?.status) {
      query.status = options.status
    }

    // Search by title or description
    if (options?.search) {
      query.$or = [
        { title: { $regex: options.search, $options: 'i' } },
        { description: { $regex: options.search, $options: 'i' } },
      ]
    }

    let queryBuilder = CourseModel.find(query as any)

    // Apply sorting
    if (options?.sort) {
      const sortField = options.sort.startsWith('-') ? options.sort.slice(1) : options.sort
      const sortOrder = options.sort.startsWith('-') ? -1 as const : 1 as const
      queryBuilder = queryBuilder.sort({ [sortField]: sortOrder })
    }

    // Apply pagination
    if (options?.page && options?.limit) {
      const skip = (options.page - 1) * options.limit
      queryBuilder = queryBuilder.skip(skip).limit(options.limit)
    }
    else if (options?.limit) {
      queryBuilder = queryBuilder.limit(options.limit)
    }

    const courses = await queryBuilder.lean<CourseDB[]>().exec()
    return courses
  }

  async getCoursesByAuthor(authorId: ObjectId): Promise<CourseDB[]> {
    const courses = await CourseModel
      .find({ authorId })
      .lean<CourseDB[]>()
      .exec()
    return courses
  }

  async createCourse(courseData: Partial<CourseDB>): Promise<CourseDB> {
    const { _id, ...dataToCreate } = courseData
    const newCourse = await CourseModel.create(dataToCreate)
    return newCourse.toObject()
  }

  async updateCourse(courseId: string, updateData: Partial<Course>): Promise<CourseDB> {
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
