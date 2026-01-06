import type { Routes } from '@interfaces/routes.interface'
import { AttemptsController } from '@controllers/attempts.controller'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import { requirePermission } from '@middlewares/rbac.middleware'
import { ValidationMiddleware } from '@middlewares/validation.middleware'
import { PERMISSIONS } from '@shared/constants'
import { submitQuizSchema } from '@shared/schemas'
import { Router } from 'express'
import { inject, injectable } from 'tsyringe'

@injectable()
export class AttemptsRoute implements Routes {
  public router: Router = Router()
  public path = '/submissions'

  constructor(@inject(AttemptsController) private attemptsController: AttemptsController) {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      `/quizzes/:id/submissions`,
      AuthMiddleware,
      ValidationMiddleware(submitQuizSchema),
      this.attemptsController.submitQuizAttempt,
    )
    this.router.get(
      `${this.path}/:id`,
      AuthMiddleware,
      this.attemptsController.getAttemptById,
    )
    this.router.get(
      `/users/me/submissions`,
      AuthMiddleware,
      this.attemptsController.getUserAttempts,
    )
    this.router.get(
      `/quizzes/:quizId/submissions`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.QUIZZES.VIEW]),
      this.attemptsController.getQuizAttempts,
    )
  }
}
