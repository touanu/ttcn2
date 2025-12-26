import type { Routes } from '@interfaces/routes.interface'
import { AuthController } from '@controllers/auth.controller'
import { emailOTPVerificationSchema, emailTokenVerificationSchema, loginUserSchema, logOutSchema, refreshTokenSchema, requestEmailVerificationSchema, resetPasswordSchema } from '@dtos/auth.dto'
import { createUserSchema } from '@dtos/users.dto'
import { AuthMiddleware } from '@middlewares/auth.middleware'
import { rateLimitMiddleware } from '@middlewares/rateLimit.middleware'
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
      rateLimitMiddleware(10, true),
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
      rateLimitMiddleware(30, true),
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
      rateLimitMiddleware(10, true),
      ValidationMiddleware(emailOTPVerificationSchema),
      this.authController.verifyEmailWithOTP,
    )
    this.router.post(
      `${this.path}/verify-email-token`,
      rateLimitMiddleware(10, true),
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
      rateLimitMiddleware(10, true),
      ValidationMiddleware(resetPasswordSchema),
      this.authController.resetPassword,
    )
  }
}
