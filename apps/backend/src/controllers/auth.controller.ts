import type { LoginCredential, LoginData, RefreshTokenData, SuccessResponseBody, User } from '@shared/interfaces'
import type { Request, RequestHandler, Response } from 'express'
import { AuthService } from '@services/auth.service'
import { asyncHandler } from '@utils/asyncHandler'
import { inject, injectable } from 'tsyringe'

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) private readonly authService: AuthService,
  ) { }

  public signUp: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userData: User = req.body
    const signUpUserData = await this.authService.signup(userData)

    const response: SuccessResponseBody<User> = {
      success: true,
      data: signUpUserData,
      message: 'REGISTER_SUCCESS',
    }

    res.status(201).json(response)
  })

  public logIn: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const loginData: LoginCredential = req.body
    const data: LoginData = await this.authService.login(loginData)

    const response: SuccessResponseBody<LoginData> = {
      success: true,
      data,
      message: 'LOGIN_SUCCESS',
    }

    res.status(200).json(response)
  })

  public logOut: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.body
    await this.authService.logout(sessionId)

    const response: SuccessResponseBody<null> = {
      success: true,
      data: null,
      message: 'LOGOUT_SUCCESS',
    }

    res.status(200).json(response)
  })

  public refreshSession: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId, refreshToken } = req.body
    const data: RefreshTokenData = await this.authService.refreshSession(sessionId, refreshToken)

    const response: SuccessResponseBody<RefreshTokenData> = {
      success: true,
      data,
      message: 'ACCESS_TOKEN_REFRESHED',
    }

    res.status(200).json(response)
  })
}
