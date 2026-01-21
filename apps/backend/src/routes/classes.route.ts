import type { Routes } from '@interfaces/routes.interface'
import { ClassController } from '@controllers/classes.controller'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import { requirePermission } from '@middlewares/rbac.middleware'
import { PERMISSIONS } from '@shared/constants'
import { Router } from 'express'
import { inject, injectable } from 'tsyringe'

@injectable()
export class ClassRoute implements Routes {
  public router: Router = Router()
  public path = '/classes'

  constructor(@inject(ClassController) private classController: ClassController) {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // Get all classes
    this.router.get(
      this.path,
      AuthMiddleware,
      this.classController.getAllClasses,
    )

    // Create class - Teacher, Admin, Superadmin
    this.router.post(
      this.path,
      AuthMiddleware,
      requirePermission([PERMISSIONS.CLASS.CREATE]),
      this.classController.createClass,
    )

    // Get classes by teacher
    this.router.get(
      `${this.path}/teacher/:teacherId`,
      AuthMiddleware,
      this.classController.getClassesByTeacher,
    )

    // Get classes by student
    this.router.get(
      `${this.path}/student/:studentId`,
      AuthMiddleware,
      this.classController.getClassesByStudent,
    )

    // Get classes by course
    this.router.get(
      `${this.path}/course/:courseId`,
      this.classController.getClassesByCourse,
    )

    // Get class by ID - must come after specific routes
    this.router.get(
      `${this.path}/:id`,
      AuthMiddleware,
      this.classController.getClassById,
    )

    // Update class - Teacher (own), Admin, Superadmin
    this.router.patch(
      `${this.path}/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.CLASS.UPDATE]),
      this.classController.updateClass,
    )

    // Add student to class - Teacher (own), Admin, Superadmin
    this.router.post(
      `${this.path}/:id/students`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.ENROLLMENTS.CREATE]),
      this.classController.addStudentToClass,
    )

    // Remove student from class - Teacher (own), Admin, Superadmin
    this.router.delete(
      `${this.path}/:id/students/:studentId`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.CLASS.UPDATE]),
      this.classController.removeStudentFromClass,
    )

    // Delete class - Teacher (own), Admin, Superadmin
    this.router.delete(
      `${this.path}/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.CLASS.DELETE]),
      this.classController.deleteClass,
    )

    // Get timetables by class
    this.router.get(
      `${this.path}/:id/timetables`,
      AuthMiddleware,
      this.classController.getTimeTablesByClass,
    )

    // Delete all timetables of a class - Teacher (own), Admin, Superadmin
    this.router.delete(
      `${this.path}/:id/timetables`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.CLASS.DELETE, PERMISSIONS.TIMETABLE.DELETE]),
      this.classController.deleteTimeTablesByClass,
    )

    // ============ TIMETABLE ROUTES ============

    // Get all timetables
    this.router.get(
      '/timetables',
      AuthMiddleware,
      this.classController.getAllTimeTables,
    )

    // Create timetable - Teacher (own class), Admin, Superadmin
    this.router.post(
      '/timetables',
      AuthMiddleware,
      requirePermission([PERMISSIONS.TIMETABLE.CREATE]),
      this.classController.createTimeTable,
    )

    // Get timetables by day of week
    this.router.get(
      '/timetables/day/:dayOfWeek',
      AuthMiddleware,
      this.classController.getTimeTablesByDayOfWeek,
    )

    // Get timetable by ID
    this.router.get(
      '/timetables/:timeTableId',
      AuthMiddleware,
      this.classController.getTimeTableById,
    )

    // Update timetable - Teacher (own class), Admin, Superadmin
    this.router.patch(
      '/timetables/:timeTableId',
      AuthMiddleware,
      requirePermission([PERMISSIONS.TIMETABLE.UPDATE]),
      this.classController.updateTimeTable,
    )

    // Delete timetable - Teacher (own class), Admin, Superadmin
    this.router.delete(
      '/timetables/:timeTableId',
      AuthMiddleware,
      requirePermission([PERMISSIONS.TIMETABLE.DELETE]),
      this.classController.deleteTimeTable,
    )
  }
}
