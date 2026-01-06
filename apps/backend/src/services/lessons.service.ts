import type { Lesson } from '@shared/interfaces'
import type { LessonDB } from '@shared/types'
import { HttpException } from '@exceptions/HttpException'
import { LessonModel } from '@models/lesson.model'
import { logger } from '@utils/logger'
import { injectable } from 'tsyringe'

@injectable()
export class LessonsService {
  public async createLesson(courseId: string, lessonData: Partial<Lesson>): Promise<LessonDB> {
    const lesson = new LessonModel({
      ...lessonData,
      courseId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const savedLesson = await lesson.save().catch((error) => {
      logger.error(`Lỗi khi tạo bài học: ${error.message}`)
      throw new HttpException(500, 'LESSONS.CREATION_FAILED')
    })

    return savedLesson.toObject() as LessonDB
  }

  public async getLessonById(lessonId: string): Promise<LessonDB> {
    const lesson = await LessonModel.findById(lessonId)
      .populate('mediaIds')
      .populate('quizId')
      .lean<LessonDB>()
      .exec()

    if (!lesson)
      throw new HttpException(404, 'LESSONS.NOT_FOUND')

    return lesson
  }

  public async getLessonsByCourseId(courseId: string): Promise<LessonDB[]> {
    const lessons = await LessonModel.find({ courseId } as any)
      .sort({ orderIndex: 1 })
      .populate('mediaIds')
      .lean<LessonDB[]>()
      .exec()

    return lessons
  }

  public async updateLesson(lessonId: string, updateData: Partial<Lesson>): Promise<LessonDB> {
    const lesson = await LessonModel.findByIdAndUpdate(
      lessonId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    )
      .lean<LessonDB>()
      .exec()

    if (!lesson)
      throw new HttpException(404, 'LESSONS.NOT_FOUND')

    return lesson
  }

  public async deleteLesson(lessonId: string): Promise<void> {
    const result = await LessonModel.findByIdAndDelete(lessonId)

    if (!result)
      throw new HttpException(404, 'LESSONS.NOT_FOUND')
  }

  public async reorderLessons(courseId: string, lessonOrders: { lessonId: string, orderIndex: number }[]): Promise<void> {
    const bulkOps = lessonOrders.map(({ lessonId, orderIndex }) => ({
      updateOne: {
        filter: { _id: lessonId, courseId } as any,
        update: { orderIndex, updatedAt: new Date() },
      },
    }))

    await LessonModel.bulkWrite(bulkOps).catch((error) => {
      logger.error(`Lỗi khi sắp xếp lại bài học: ${error.message}`)
      throw new HttpException(500, 'LESSONS.REORDER_FAILED')
    })
  }
}
