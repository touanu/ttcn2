import type { Question, Quiz } from '@shared/interfaces'
import type { QuestionDB, QuizDB } from '@shared/types'
import { HttpException } from '@exceptions/HttpException'
import { QuestionModel, QuizModel } from '@models/quiz.model'
import { logger } from '@utils/logger'
import { injectable } from 'tsyringe'

@injectable()
export class QuizzesService {
  public async createQuiz(lessonId: string, quizData: Partial<Quiz>): Promise<QuizDB> {
    const quiz = new QuizModel({
      ...quizData,
      lessonId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const savedQuiz = await quiz.save().catch((error) => {
      logger.error(`Lỗi khi tạo bài kiểm tra: ${error.message}`)
      throw new HttpException(500, 'QUIZZES.CREATION_FAILED')
    })

    return savedQuiz.toObject() as QuizDB
  }

  public async getQuizById(quizId: string): Promise<QuizDB> {
    const quiz = await QuizModel.findById(quizId).populate('questionIds')

    if (!quiz)
      throw new HttpException(404, 'QUIZZES.NOT_FOUND')

    return quiz.toObject() as QuizDB
  }

  public async getQuizByLessonId(lessonId: string): Promise<QuizDB | null> {
    const quiz = await QuizModel.findOne({ lessonId } as any)
      .populate('questionIds')
      .lean<QuizDB>()
      .exec()

    if (!quiz)
      return null

    return quiz
  }

  public async updateQuiz(quizId: string, updateData: Partial<Quiz>): Promise<QuizDB> {
    const quiz = await QuizModel.findByIdAndUpdate(
      quizId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    )

    if (!quiz)
      throw new HttpException(404, 'QUIZZES.NOT_FOUND')

    return quiz.toObject() as QuizDB
  }

  public async deleteQuiz(quizId: string): Promise<void> {
    await QuestionModel.deleteMany({ quizId } as any).exec()

    const result = await QuizModel.findByIdAndDelete(quizId)

    if (!result)
      throw new HttpException(404, 'QUIZZES.NOT_FOUND')
  }

  public async createQuestion(quizId: string, questionData: Partial<Question>): Promise<QuestionDB> {
    const question = new QuestionModel({
      ...questionData,
      quizId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const savedQuestion = await question.save().catch((error) => {
      logger.error(`Lỗi khi tạo câu hỏi: ${error.message}`)
      throw new HttpException(500, 'QUESTIONS.CREATION_FAILED')
    })

    await QuizModel.findByIdAndUpdate(quizId, {
      $push: { questionIds: savedQuestion._id },
      updatedAt: new Date(),
    })

    return savedQuestion.toObject() as QuestionDB
  }

  public async getQuestionById(questionId: string): Promise<QuestionDB> {
    const question = await QuestionModel.findById(questionId)

    if (!question)
      throw new HttpException(404, 'QUESTIONS.NOT_FOUND')

    return question.toObject() as QuestionDB
  }

  public async updateQuestion(questionId: string, updateData: Partial<Question>): Promise<QuestionDB> {
    const question = await QuestionModel.findByIdAndUpdate(
      questionId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true },
    )

    if (!question)
      throw new HttpException(404, 'QUESTIONS.NOT_FOUND')

    return question.toObject() as QuestionDB
  }

  public async deleteQuestion(questionId: string): Promise<void> {
    const question = await QuestionModel.findById(questionId)

    if (!question)
      throw new HttpException(404, 'QUESTIONS.NOT_FOUND')

    await QuizModel.findByIdAndUpdate(question.quizId, {
      $pull: { questionIds: questionId },
      updatedAt: new Date(),
    })

    await QuestionModel.findByIdAndDelete(questionId)
  }
}
