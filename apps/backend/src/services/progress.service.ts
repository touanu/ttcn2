import type { ProgressDB } from '@interfaces/progress.interface'
import { HttpException } from '@exceptions/HttpException'
import { LessonModel } from '@models/lesson.model'
import { ProgressModel } from '@models/progress.model'
import { logger } from '@utils/logger'
import { injectable } from 'tsyringe'

@injectable()
export class ProgressService {
  public async getUserProgress(userId: string, courseId?: string): Promise<ProgressDB[]> {
    const filter: any = { userId }
    if (courseId) {
      filter.courseId = courseId
    }

    const progressList = await ProgressModel.find(filter as any)
      .populate('courseId', 'title thumbnail')

    return progressList.map(progress => progress.toObject() as ProgressDB)
  }

  public async getCourseProgress(userId: string, courseId: string): Promise<ProgressDB> {
    let progress = await ProgressModel.findOne({ userId, courseId } as any)
      .populate('courseId', 'title thumbnail')
      .lean<ProgressDB>()
      .exec()

    if (!progress) {
      const newProgress = new ProgressModel({
        userId,
        courseId,
        completedLessonIds: [],
        percentage: 0,
        updatedAt: new Date(),
      })

      const saved = await newProgress.save().catch((error: Error) => {
        logger.error(`Lỗi khi tạo tiến độ: ${error.message}`)
        throw new HttpException(500, 'PROGRESS.CREATION_FAILED')
      })

      progress = saved.toObject() as ProgressDB
    }

    return progress
  }

  public async markLessonComplete(userId: string, lessonId: string): Promise<ProgressDB> {
    const lesson = await LessonModel.findById(lessonId)

    if (!lesson)
      throw new HttpException(404, 'LESSONS.NOT_FOUND')

    const courseId = lesson.courseId

    let progress = await ProgressModel.findOne({ userId, courseId } as any)

    if (!progress) {
      progress = new ProgressModel({
        userId,
        courseId,
        completedLessonIds: [lessonId],
        percentage: 0,
        updatedAt: new Date(),
      })
    }
    else {
      if (!progress.completedLessonIds.some(id => id.toString() === lessonId)) {
        progress.completedLessonIds.push(lessonId as any)
      }
    }

    const totalLessons = await LessonModel.countDocuments({ courseId } as any)
    progress.percentage = totalLessons > 0
      ? (progress.completedLessonIds.length / totalLessons) * 100
      : 0

    progress.updatedAt = new Date()

    const savedProgress = await progress.save().catch((error: Error) => {
      logger.error(`Lỗi khi cập nhật tiến độ: ${error.message}`)
      throw new HttpException(500, 'PROGRESS.UPDATE_FAILED')
    })

    return savedProgress.toObject() as ProgressDB
  }

  public async resetCourseProgress(userId: string, courseId: string): Promise<void> {
    await ProgressModel.findOneAndUpdate(
      { userId, courseId } as any,
      {
        completedLessonIds: [],
        percentage: 0,
        updatedAt: new Date(),
      },
    )
  }
}
