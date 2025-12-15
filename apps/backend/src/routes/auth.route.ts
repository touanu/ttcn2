import type { Routes } from '@interfaces/routes.interface'
import { AuthController } from '@controllers/auth.controller'
import { emailOTPVerificationSchema, emailTokenVerificationSchema, loginUserSchema, logOutSchema, refreshTokenSchema, requestEmailVerificationSchema, resetPasswordSchema } from '@dtos/auth.dto'
import { createUserSchema } from '@dtos/users.dto'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import { ValidationMiddleware } from '@middlewares/validation.middleware'
import { Router } from 'express'
import { inject, injectable } from 'tsyringe'

@injectable()
export class AuthRoute implements Routes {
  public router: Router = Router()
  public path = '/auth'

  constructor(@inject(AuthController) private authController: AuthController) {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      ValidationMiddleware(createUserSchema),
      this.authController.signUp,
    )
    this.router.post(
      `${this.path}/login`,
      ValidationMiddleware(loginUserSchema),
      this.authController.logIn,
    )
    this.router.post(
      `${this.path}/logout`,
      AuthMiddleware,
      ValidationMiddleware(logOutSchema),
      this.authController.logOut,
    )
    this.router.post(
      `${this.path}/refresh`,
      AuthMiddleware,
      ValidationMiddleware(refreshTokenSchema),
      this.authController.refreshSession,
    )
    this.router.post(
      `${this.path}/request-verify-email`,
      ValidationMiddleware(requestEmailVerificationSchema),
      this.authController.requestEmailVerificationOTP,
    )
    this.router.post(
      `${this.path}/verify-email-otp`,
      ValidationMiddleware(emailOTPVerificationSchema),
      this.authController.verifyEmailWithOTP,
    )
    this.router.post(
      `${this.path}/verify-email-token`,
      ValidationMiddleware(emailTokenVerificationSchema),
      this.authController.verifyEmailWithToken,
    )
    this.router.post(
      `${this.path}/forgot-password`,
      ValidationMiddleware(requestEmailVerificationSchema),
      this.authController.requestPasswordReset,
    )
    this.router.post(
      `${this.path}/reset-password`,
      ValidationMiddleware(resetPasswordSchema),
      this.authController.resetPassword,
    )
  }
}
