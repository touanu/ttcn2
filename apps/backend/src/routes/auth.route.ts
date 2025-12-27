import type { Routes } from '@interfaces/routes.interface'
import { AuthController } from '@controllers/auth.controller'
import {
  loginUserSchema,
  logOutSchema,
  refreshTokenSchema,
} from '@dtos/auth.dto'
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
  }
}
