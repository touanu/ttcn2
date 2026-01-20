import type { Routes } from '@interfaces/routes.interface'
import { CoursesController } from '@controllers/courses.controller'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import { requirePermission } from '@middlewares/rbac.middleware'
import { ValidationMiddleware } from '@middlewares/validation.middleware'
import { PERMISSIONS } from '@shared/constants'
import { createCourseSchema, updateCourseSchema } from '@shared/schemas'
import { Router } from 'express'
import { inject, injectable } from 'tsyringe'

@injectable()
export class CoursesRoute implements Routes {
  public router: Router = Router()
  public path = '/courses'

  constructor(@inject(CoursesController) private coursesController: CoursesController) {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      this.path,
      this.coursesController.getAllCourses,
    )
    this.router.get(
      `${this.path}/:id`,
      this.coursesController.getCourseById,
    )
    this.router.post(
      this.path,
      AuthMiddleware,
      requirePermission([PERMISSIONS.COURSES.CREATE]),
      ValidationMiddleware(createCourseSchema),
      this.coursesController.createCourse,
    )
    this.router.patch(
      `${this.path}/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.COURSES.UPDATE]),
      ValidationMiddleware(updateCourseSchema),
      this.coursesController.updateCourse,
    )
    this.router.delete(
      `${this.path}/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.COURSES.DELETE]),
      this.coursesController.deleteCourse,
    )
    this.router.get(
      `${this.path}/:id/classes/count`,
      this.coursesController.getClassesCount,
    )
    this.router.get(
      `${this.path}/:id/classes`,
      this.coursesController.getClassesDetail,
    )
  }
}
