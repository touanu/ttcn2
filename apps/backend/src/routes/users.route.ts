import type { Routes } from '@interfaces/routes.interface'
import { UsersController } from '@controllers/users.controller'
import { rateLimitMiddleware } from '@middlewares/rateLimit.middleware'
import { ValidationMiddleware } from '@middlewares/validation.middleware'
import {
  createUserSchema,
  emailOnlySchema,
  emailVerificationSchema,
  passwordResetSchema,
  requestVerifyEmailSchema,
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
      this.userController.getUsers,
    )
    this.router.get(
      `${this.path}/:id`,
      this.userController.getUserById,
    )
    this.router.post(
      this.path,
      ValidationMiddleware(createUserSchema),
      this.userController.createUser,
    )
    this.router.put(
      `${this.path}/:id`,
      ValidationMiddleware(updateUserSchema),
      this.userController.updateUser,
    )
    this.router.delete(
      `${this.path}/:id`,
      this.userController.deleteUser,
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
  }
}
