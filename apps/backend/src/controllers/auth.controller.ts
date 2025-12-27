import type { LoginCredential, LoginData, RefreshTokenData, SuccessResponseBody, User } from '@shared/interfaces'
import type { Request, RequestHandler, Response } from 'express'
import { HttpException } from '@exceptions/HttpException'
import { AuthService } from '@services/auth.service'
import { UsersService } from '@services/users.service'
import { asyncHandler } from '@utils/asyncHandler'
import { inject, injectable } from 'tsyringe'

@injectable()
export class AuthController {
  constructor(
    @inject(AuthService) private readonly authService: AuthService,
    @inject(UsersService) private readonly userService: UsersService,
  ) { }

  public signUp: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userData: User = req.body
    const signUpUserData = await this.userService.createUser(userData)

    const response: SuccessResponseBody<User> = {
      success: true,
      data: signUpUserData,
      message: 'REGISTER_SUCCESS',
    }

    res.status(201).json(response)
  })

  public logIn: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const loginData: LoginCredential = req.body
    const findUser = await this.userService.findUserByUsername(loginData.username)

    if (!findUser)
      throw new HttpException(401, 'WRONG_USERNAME_OR_PASSWORD')

    const data: LoginData = await this.authService.login(loginData, findUser)

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
    const session = await this.authService.getSessionById(sessionId)
    const user = await this.userService.getUserById(session.userId.toString())
    const data: RefreshTokenData = await this.authService.refreshSession(user, session, refreshToken)

    const response: SuccessResponseBody<RefreshTokenData> = {
      success: true,
      data,
      message: 'ACCESS_TOKEN_REFRESHED',
    }

    res.status(200).json(response)
  })
}
