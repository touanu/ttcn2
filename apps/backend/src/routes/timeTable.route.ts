import type { Routes } from '@interfaces/routes.interface'
import { TimeTableController } from '@controllers/timeTable.controller'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import { requirePermission } from '@middlewares/rbac.middleware'
import { PERMISSIONS } from '@shared/constants'
import { Router } from 'express'
import { inject, injectable } from 'tsyringe'

@injectable()
export class TimeTableRoute implements Routes {
  public router: Router = Router()
  public path = '/timetables'

  constructor(@inject(TimeTableController) private timeTableController: TimeTableController) {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // Get all timetables
    this.router.get(
      this.path,
      AuthMiddleware,
      this.timeTableController.getAllTimeTables,
    )

    // Create timetable - Teacher (own class), Admin, Superadmin
    this.router.post(
      this.path,
      AuthMiddleware,
      requirePermission([PERMISSIONS.TIMETABLE.CREATE]),
      this.timeTableController.createTimeTable,
    )

    // Get timetables by class
    this.router.get(
      `${this.path}/class/:classId`,
      AuthMiddleware,
      this.timeTableController.getTimeTablesByClass,
    )

    // Get timetables by day of week
    this.router.get(
      `${this.path}/day/:dayOfWeek`,
      AuthMiddleware,
      this.timeTableController.getTimeTablesByDayOfWeek,
    )

    // Get timetable by ID - must come after specific routes
    this.router.get(
      `${this.path}/:id`,
      AuthMiddleware,
      this.timeTableController.getTimeTableById,
    )

    // Update timetable - Teacher (own class), Admin, Superadmin
    this.router.patch(
      `${this.path}/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.TIMETABLE.UPDATE]),
      this.timeTableController.updateTimeTable,
    )

    // Delete timetable - Teacher (own class), Admin, Superadmin
    this.router.delete(
      `${this.path}/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.TIMETABLE.DELETE]),
      this.timeTableController.deleteTimeTable,
    )

    // Delete all timetables by class - Admin, Superadmin
    this.router.delete(
      `${this.path}/class/:classId`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.TIMETABLE.DELETE]),
      this.timeTableController.deleteTimeTablesByClass,
    )

    // Get class information from timetable
    this.router.get(
      `${this.path}/:id/class`,
      AuthMiddleware,
      this.timeTableController.getClassByTimeTable,
    )
  }
}
