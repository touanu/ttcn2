import type { ClassDB } from '@interfaces/class.interface'
import type { CourseDB } from '@interfaces/courses.interface'
import type { Course, GetAllQuery } from '@shared/types'
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

  async getAllCourses(options?: GetAllQuery): Promise<CourseDB[]> {
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

    let queryBuilder = CourseModel.find(query)

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

  async getClassesDetail(courseId: string): Promise<ClassDB[]> {
    const course = await CourseModel
      .findById(courseId)
      .populate('classIds')
      .lean<CourseDB>()
      .exec()

    if (!course)
      throw new HttpException(404, 'COURSE.NOT_FOUND')

    return course.classes as ClassDB[]
  }

  async getClassesCount(courseId: string): Promise<number> {
    const course = await CourseModel
      .findById(courseId)
      .lean<CourseDB>()
      .exec()

    if (!course)
      throw new HttpException(404, 'COURSE.NOT_FOUND')

    return course.classes.length
  }

  async addClass(courseId: string, classId: ObjectId): Promise<void> {
    const updatedCourse = await CourseModel
      .findByIdAndUpdate(
        courseId,
        { $push: { classes: classId } },
        { new: true },
      )
      .exec()

    if (!updatedCourse)
      throw new HttpException(404, 'COURSE.NOT_FOUND')
  }
}
