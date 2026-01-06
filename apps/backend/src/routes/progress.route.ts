import type { Routes } from '@interfaces/routes.interface'
import { ProgressController } from '@controllers/progress.controller'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import { Router } from 'express'
import { inject, injectable } from 'tsyringe'

@injectable()
export class ProgressRoute implements Routes {
  public router: Router = Router()
  public path = '/progress'

  constructor(@inject(ProgressController) private progressController: ProgressController) {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/me`,
      AuthMiddleware,
      this.progressController.getUserProgress,
    )
    this.router.get(
      `${this.path}/courses/:courseId`,
      AuthMiddleware,
      this.progressController.getCourseProgress,
    )
    this.router.post(
      `${this.path}/lessons/:id/complete`,
      AuthMiddleware,
      this.progressController.markLessonComplete,
    )
    this.router.post(
      `${this.path}/courses/:courseId/reset`,
      AuthMiddleware,
      this.progressController.resetCourseProgress,
    )
  }
}
