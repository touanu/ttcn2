import type { Routes } from '@interfaces/routes.interface'
import { QuizzesController } from '@controllers/quizzes.controller'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import { requirePermission } from '@middlewares/rbac.middleware'
import { ValidationMiddleware } from '@middlewares/validation.middleware'
import { PERMISSIONS } from '@shared/constants'
import {
  createQuestionSchema,
  createQuizSchema,
  updateQuestionSchema,
  updateQuizSchema,
} from '@shared/schemas'
import { Router } from 'express'
import { inject, injectable } from 'tsyringe'

@injectable()
export class QuizzesRoute implements Routes {
  public router: Router = Router()
  public path = '/quizzes'

  constructor(@inject(QuizzesController) private quizzesController: QuizzesController) {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // Quiz routes
    this.router.get(
      `${this.path}/:id`,
      this.quizzesController.getQuizById,
    )
    this.router.get(
      `/lessons/:lessonId/quizzes`,
      this.quizzesController.getLessonQuiz,
    )
    this.router.post(
      `/lessons/:lessonId/quizzes`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.QUIZZES.CREATE]),
      ValidationMiddleware(createQuizSchema),
      this.quizzesController.createQuiz,
    )
    this.router.patch(
      `${this.path}/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.QUIZZES.UPDATE]),
      ValidationMiddleware(updateQuizSchema),
      this.quizzesController.updateQuiz,
    )
    this.router.delete(
      `${this.path}/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.QUIZZES.DELETE]),
      this.quizzesController.deleteQuiz,
    )

    // Question routes
    this.router.get(
      `/questions/:id`,
      this.quizzesController.getQuestionById,
    )
    this.router.post(
      `${this.path}/:id/questions`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.QUIZZES.CREATE]),
      ValidationMiddleware(createQuestionSchema),
      this.quizzesController.createQuestion,
    )
    this.router.patch(
      `/questions/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.QUIZZES.UPDATE]),
      ValidationMiddleware(updateQuestionSchema),
      this.quizzesController.updateQuestion,
    )
    this.router.delete(
      `/questions/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.QUIZZES.DELETE]),
      this.quizzesController.deleteQuestion,
    )
  }
}
