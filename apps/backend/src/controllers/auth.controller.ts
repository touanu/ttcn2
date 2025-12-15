import type { LoginResponse, User } from '@shared/interfaces'
import type { Request, RequestHandler, Response } from 'express'
import { AuthService } from '@services/auth.service'
import { asyncHandler } from '@utils/asyncHandler'
import { inject, injectable } from 'tsyringe'

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) { }

  public signUp: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userData: User = req.body
    userData.role = 'student'
    const signUpUserData = await this.authService.signup(userData)

    res.status(201).json({ data: signUpUserData, message: 'REGISTER_SUCCESS' })
  })

  public logIn: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const loginData: User = req.body
    const response = await this.authService.login(loginData)

    res.status(200).json({ data: response, message: 'LOGIN_SUCCESS' })
  })

  public logOut: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.body
    await this.authService.logout(sessionId)

    res.status(200).json({ message: 'LOGGED_OUT' })
  })

  public refreshSession: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId, refreshToken } = req.body
    const response: LoginResponse = await this.authService.refreshSession(sessionId, refreshToken)

    res.status(200).json({ data: response, message: 'ACCESS_TOKEN_REFRESHED' })
  })

  public requestEmailVerificationOTP: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body
    await this.authService.requestOTP(email)

    res.status(200).json({ message: 'EMAIL_VERIFICATION_OTP_SENT' })
  })

  public verifyEmailWithOTP: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body
    await this.authService.verifyEmailWithOTP(email, otp)

    res.status(200).json({ message: 'EMAIL_VERIFIED' })
  })

  public verifyEmailWithToken: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { verificationToken } = req.body
    await this.authService.verifyEmailWithToken(verificationToken)

    res.status(200).json({ message: 'EMAIL_VERIFIED' })
  })

  public requestPasswordReset: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body
    await this.authService.requestPasswordReset(email)

    res.status(200).json({ message: 'PASSWORD_RESET_OTP_SENT' })
  })

  public resetPassword: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body
    await this.authService.resetPassword(email, otp, newPassword)

    res.status(200).json({ message: 'PASSWORD_RESET_SUCCESS' })
  })
}
