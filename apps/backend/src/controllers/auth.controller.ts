import type { RequestWithUser, User } from '@shared/interfaces'
import type { Request, RequestHandler, Response } from 'express'
import { AuthService } from '@services/auth.service'
import { NODE_ENV } from '@shared/config'
import { asyncHandler } from '@utils/asyncHandler'
import { inject, injectable } from 'tsyringe'

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  public signUp: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userData: User = req.body
    const signUpUserData = await this.authService.signup(userData)

    res.status(201).json({ data: signUpUserData, message: 'Đăng ký thành công' })
  })

  public logIn: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const loginData: User = req.body
    const { cookie, user } = await this.authService.login(loginData)

    res.setHeader('Set-Cookie', [cookie])
    res.status(200).json({ data: user, message: 'Đăng nhập thành công' })
  })

  public logOut: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser
    const user = userReq.user
    await this.authService.logout(user)

    res.clearCookie('Authorization', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: NODE_ENV === 'production',
    })
    res.status(200).json({ message: 'Đã đăng xuất' })
  })
}
