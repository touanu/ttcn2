import type { Routes } from '@interfaces/routes.interface'
import { UsersController } from '@controllers/users.controller'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import { rateLimitMiddleware } from '@middlewares/rateLimit.middleware'
import { requirePermission } from '@middlewares/rbac.middleware'
import { ValidationMiddleware } from '@middlewares/validation.middleware'
import { PERMISSIONS } from '@shared/constants'
import {
  changePasswordSchema,
  createUserSchema,
  emailOnlySchema,
  emailVerificationSchema,
  onlyPasswordResetSchema,
  passwordResetSchema,
  requestVerifyEmailSchema,
  updateUserRoleSchema,
  updateUserSchema,
} from '@shared/schemas'
import { Router } from 'express'
import { inject, injectable } from 'tsyringe'

@injectable()
export class UsersRoute implements Routes {
  public router: Router = Router()
  public path = '/users'

  constructor(@inject(UsersController) private userController: UsersController) {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      this.path,
      AuthMiddleware,
      requirePermission([PERMISSIONS.USERS.VIEW]),
      this.userController.getUsers,
    )
    this.router.get(
      `${this.path}/count`,
      this.userController.getUsersCount,
    )
    this.router.post(
      this.path,
      AuthMiddleware,
      requirePermission([PERMISSIONS.USERS.CREATE]),
      ValidationMiddleware(createUserSchema),
      this.userController.createUser,
    )
    this.router.post(
      '/register',
      ValidationMiddleware(createUserSchema),
      this.userController.registerStudent,
    )
    this.router.post(
      `${this.path}/request-verify-email`,
      ValidationMiddleware(requestVerifyEmailSchema),
      this.userController.requestEmailVerification,
    )
    this.router.post(
      `${this.path}/verify-email`,
      rateLimitMiddleware(10, true),
      ValidationMiddleware(emailVerificationSchema),
      this.userController.verifyEmail,
    )
    this.router.post(
      `${this.path}/forgot-password`,
      ValidationMiddleware(emailOnlySchema),
      this.userController.requestPasswordReset,
    )
    this.router.post(
      `${this.path}/reset-password`,
      rateLimitMiddleware(10, true),
      ValidationMiddleware(passwordResetSchema),
      this.userController.resetPassword,
    )
    this.router.get(
      `${this.path}/verify-email/:token`,
      rateLimitMiddleware(10, true),
      this.userController.verifyEmailByToken,
    )
    this.router.post(
      `${this.path}/reset-password/:token`,
      rateLimitMiddleware(10, true),
      ValidationMiddleware(onlyPasswordResetSchema),
      this.userController.verifyPasswordResetToken,
    )

    // Parameterized routes (:id)
    this.router.get(
      `${this.path}/:id/permissions`,
      AuthMiddleware,
      this.userController.getUserPermissions,
    )
    this.router.patch(
      `${this.path}/:id/role`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.USERS.MANAGE_ROLES]),
      ValidationMiddleware(updateUserRoleSchema),
      this.userController.updateUserRole,
    )
    this.router.patch(
      `${this.path}/:id/password`,
      ValidationMiddleware(changePasswordSchema),
      this.userController.updateUserPassword,
    )
    this.router.get(
      `${this.path}/:id`,
      this.userController.getUserById,
    )
    this.router.patch(
      `${this.path}/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.USERS.UPDATE]),
      ValidationMiddleware(updateUserSchema),
      this.userController.updateUser,
    )
    this.router.delete(
      `${this.path}/:id`,
      AuthMiddleware,
      requirePermission([PERMISSIONS.USERS.DELETE]),
      this.userController.deleteUser,
    )
  }
}
