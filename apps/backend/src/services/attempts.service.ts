import type { AttemptDB } from '@shared/types'
import { HttpException } from '@exceptions/HttpException'
import { AttemptModel } from '@models/attempt.model'
import { QuestionModel, QuizModel } from '@models/quiz.model'
import { logger } from '@utils/logger'
import { injectable } from 'tsyringe'

@injectable()
export class AttemptsService {
  public async submitQuizAttempt(
    userId: string,
    quizId: string,
    answers: Record<string, string>,
  ): Promise<AttemptDB> {
    const quiz = await QuizModel.findById(quizId).populate('questionIds')

    if (!quiz)
      throw new HttpException(404, 'QUIZZES.NOT_FOUND')

    const questions = await QuestionModel.find({ quizId } as any)

    let correctCount = 0
    questions.forEach((question) => {
      const userAnswer = answers[question._id.toString()]
      if (userAnswer === question.correctAnswer) {
        correctCount++
      }
    })

    const score = questions.length > 0 ? (correctCount / questions.length) * 100 : 0

    const attempt = new AttemptModel({
      userId,
      quizId,
      answers,
      score,
      createdAt: new Date(),
    })

    const savedAttempt = await attempt.save().catch((error) => {
      logger.error(`Lỗi khi lưu bài làm: ${error.message}`)
      throw new HttpException(500, 'ATTEMPTS.SUBMISSION_FAILED')
    })

    return savedAttempt.toObject() as AttemptDB
  }

  public async getAttemptById(attemptId: string): Promise<AttemptDB> {
    const attempt = await AttemptModel.findById(attemptId)
      .populate('userId', 'username fullName')
      .populate('quizId')

    if (!attempt)
      throw new HttpException(404, 'ATTEMPTS.NOT_FOUND')

    return attempt.toObject() as AttemptDB
  }

  public async getUserAttempts(userId: string, quizId?: string): Promise<AttemptDB[]> {
    const filter: any = { userId }
    if (quizId) {
      filter.quizId = quizId
    }

    const attempts = await AttemptModel.find(filter as any)
      .sort({ createdAt: -1 })
      .populate('quizId')
      .lean<AttemptDB[]>()
      .exec()

    return attempts
  }

  public async getQuizAttempts(quizId: string): Promise<AttemptDB[]> {
    const attempts = await AttemptModel.find({ quizId } as any)
      .sort({ createdAt: -1 })
      .populate('userId', 'username fullName')
      .lean<AttemptDB[]>()
      .exec()

    return attempts
  }
}
