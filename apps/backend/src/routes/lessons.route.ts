import type { Routes } from '@interfaces/routes.interface'
import { LessonsController } from '@controllers/lessons.controller'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import { requirePermission } from '@middlewares/rbac.middleware'
import { ValidationMiddleware } from '@middlewares/validation.middleware'
import { PERMISSIONS } from '@shared/constants'
import { createLessonSchema, reorderLessonsSchema, updateLessonSchema } from '@shared/schemas'
import { Router } from 'express'
import { inject, injectable } from 'tsyringe'

@injectable()
export class LessonsRoute implements Routes {
  public router: Router = Router()
  public path = '/lessons'

  constructor(@inject(LessonsController) private lessonsController: LessonsController) {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/:id`,
      this.lessonsController.getLessonById,
    )
    this.router.get(
      `/courses/:courseId/lessons`,
      this.lessonsController.getCourseLessons,
    )
    this.router.post(
      `/courses/:courseId/lessons`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.LESSONS.CREATE]),
      ValidationMiddleware(createLessonSchema),
      this.lessonsController.createLesson,
    )
    this.router.patch(
      `${this.path}/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.LESSONS.UPDATE]),
      ValidationMiddleware(updateLessonSchema),
      this.lessonsController.updateLesson,
    )
    this.router.delete(
      `${this.path}/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.LESSONS.DELETE]),
      this.lessonsController.deleteLesson,
    )
    this.router.post(
      `/courses/:courseId/lessons/reorder`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.LESSONS.UPDATE]),
      ValidationMiddleware(reorderLessonsSchema),
      this.lessonsController.reorderLessons,
    )
  }
}
