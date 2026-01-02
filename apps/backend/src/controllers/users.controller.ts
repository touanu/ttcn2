import type { RequestVerifyEmailResponse, SuccessResponseBody, User } from '@shared/interfaces'
import type { UserDB } from '@shared/types'
import type { Request, RequestHandler, Response } from 'express'
import { HttpException } from '@exceptions/HttpException'
import { OtpService } from '@services/otp.service'
import { UsersService } from '@services/users.service'
import { asyncHandler } from '@utils/asyncHandler'
import { inject, injectable } from 'tsyringe'

@injectable()
export class UsersController {
  constructor(
    @inject(UsersService) private readonly userService: UsersService,
    @inject(OtpService) private readonly otpService: OtpService,
  ) {}

  getUsers: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.userService.getAllUsers()
    const response: SuccessResponseBody<User[]> = {
      success: true,
      data: users,
      message: 'USERS.GET_ALL_SUCCESS',
    }

    res.status(200).json(response)
  })

  getUserById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id
    const user = await this.userService.getUserById(userId)

    const response: SuccessResponseBody<User> = {
      success: true,
      data: user,
      message: 'USERS.GET_SUCCESS',
    }

    res.status(200).json(response)
  })

  createUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userData: User = req.body
    const user = await this.userService.createUser(userData)

    const response: SuccessResponseBody<User> = {
      success: true,
      data: user,
      message: 'USERS.CREATE_SUCCESS',
    }

    res.status(201).json(response)
  })

  updateUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id
    const userData: User = req.body
    const user = await this.userService.updateUser(userId, userData)

    const response: SuccessResponseBody<User> = {
      success: true,
      data: user,
      message: 'USERS.UPDATE_SUCCESS',
    }

    res.status(200).json(response)
  })

  deleteUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id
    await this.userService.deleteUser(userId)

    const response: SuccessResponseBody<undefined> = {
      success: true,
      message: 'USERS.DELETE_SUCCESS',
    }
    res.status(204).json(response)
  })

  public requestEmailVerification: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    let { email, username } = req.body

    let user: UserDB
    if (username) {
      user = await this.userService.findUserByUsername(username)
      email = user.email
    }
    else {
      user = await this.userService.getUserByEmail(email)
    }

    if (user.isEmailVerified)
      throw new HttpException(409, 'AUTH.EMAIL_ALREADY_VERIFIED')

    const { otp, verificationToken } = await this.otpService.requestOTP(user._id, 'EMAIL_VERIFICATION', true)
    this.otpService.sendEmailVerificationMail(email, user.fullName, otp, verificationToken)

    const response: RequestVerifyEmailResponse = {
      success: true,
      message: 'AUTH.OTP.EMAIL_VERIFICATION_OTP_SENT',
      data: { email },
    }

    res.status(200).json(response)
  })

  public verifyEmail: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body
    const user = await this.userService.getUserByEmail(email)

    if (user.isEmailVerified)
      throw new HttpException(409, 'AUTH.EMAIL_ALREADY_VERIFIED')

    await this.otpService.verifyOTP(user._id, 'EMAIL_VERIFICATION', otp)
    await this.userService.updateUser(user._id.toString(), { isEmailVerified: true })

    const response: SuccessResponseBody<undefined> = {
      success: true,
      message: 'AUTH.OTP.EMAIL_VERIFIED',
    }

    res.status(200).json(response)
  })

  public requestPasswordReset: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body
    const user = await this.userService.getUserByEmail(email)

    const { otp, verificationToken } = await this.otpService.requestOTP(user._id, 'PASSWORD_RESET', true)
    this.otpService.sendPasswordResetMail(email, user.fullName, otp, verificationToken)

    const response: SuccessResponseBody<undefined> = {
      success: true,
      message: 'AUTH.PASSWORD_RESET.OTP_SENT',
    }

    res.status(200).json(response)
  })

  public resetPassword: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body
    const user = await this.userService.getUserByEmail(email)

    await this.otpService.verifyOTP(user._id, 'PASSWORD_RESET', otp)
    await this.userService.updateUser(user._id.toString(), { password: newPassword })

    const response: SuccessResponseBody<undefined> = {
      success: true,
      message: 'AUTH.PASSWORD_RESET.SUCCESS',
    }

    res.status(200).json(response)
  })

  public verifyEmailByToken: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params

    const userId = await this.otpService.verifyToken(token, 'EMAIL_VERIFICATION')
    await this.userService.updateUser(userId.toString(), { isEmailVerified: true })

    const response: SuccessResponseBody<undefined> = {
      success: true,
      message: 'AUTH.OTP.EMAIL_VERIFIED',
    }

    res.status(200).json(response)
  })

  public verifyPasswordResetToken: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params
    const { newPassword } = req.body

    const userId = await this.otpService.verifyToken(token, 'PASSWORD_RESET')
    await this.userService.updateUser(userId.toString(), { password: newPassword })

    const response: SuccessResponseBody<undefined> = {
      success: true,
      message: 'AUTH.PASSWORD_RESET.SUCCESS',
    }

    res.status(200).json(response)
  })
}
