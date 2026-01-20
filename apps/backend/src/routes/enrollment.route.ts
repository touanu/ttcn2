import type { Routes } from '@interfaces/routes.interface'
import { EnrollmentController } from '@controllers/enrollment.controller'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import { requirePermission } from '@middlewares/rbac.middleware'
import { PERMISSIONS } from '@shared/constants'
import { Router } from 'express'
import { inject, injectable } from 'tsyringe'

@injectable()
export class EnrollmentRoute implements Routes {
  public router: Router = Router()
  public path = '/enrollments'

  constructor(@inject(EnrollmentController) private enrollmentController: EnrollmentController) {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // Get all enrollments - Admin, Superadmin
    this.router.get(
      this.path,
      AuthMiddleware,
      requirePermission([PERMISSIONS.ENROLLMENTS.READ_ALL]),
      this.enrollmentController.getAllEnrollments,
    )

    // Create enrollment - Student (own), Admin, Superadmin
    this.router.post(
      this.path,
      AuthMiddleware,
      requirePermission([PERMISSIONS.ENROLLMENTS.CREATE]),
      this.enrollmentController.createEnrollment,
    )

    // Get enrollments by user
    this.router.get(
      `${this.path}/user/:userId`,
      AuthMiddleware,
      this.enrollmentController.getEnrollmentsByUser,
    )

    // Get enrollments by course - Teacher, Admin, Superadmin
    this.router.get(
      `${this.path}/course/:courseId`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.ENROLLMENTS.READ_ALL]),
      this.enrollmentController.getEnrollmentsByCourse,
    )

    // Count enrollments by course
    this.router.get(
      `${this.path}/course/:courseId/count`,
      AuthMiddleware,
      this.enrollmentController.countEnrollmentsByCourse,
    )

    // Check enrollment status
    this.router.get(
      `${this.path}/check/:userId/:courseId`,
      AuthMiddleware,
      this.enrollmentController.checkEnrollment,
    )

    // Get enrollment by ID
    this.router.get(
      `${this.path}/:id`,
      AuthMiddleware,
      this.enrollmentController.getEnrollmentById,
    )

    // Update enrollment - Admin, Superadmin
    this.router.patch(
      `${this.path}/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.ENROLLMENTS.UPDATE]),
      this.enrollmentController.updateEnrollment,
    )

    // Update progress - Student (own), Teacher, Admin, Superadmin
    this.router.patch(
      `${this.path}/:id/progress`,
      AuthMiddleware,
      this.enrollmentController.updateProgress,
    )

    // Delete enrollment - Admin, Superadmin
    this.router.delete(
      `${this.path}/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.ENROLLMENTS.DELETE]),
      this.enrollmentController.deleteEnrollment,
    )
  }
}
