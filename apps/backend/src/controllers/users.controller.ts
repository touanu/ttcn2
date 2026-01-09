import type { Permission } from '@shared/constants'
import type { RequestVerifyEmailResponse, SuccessResponseBody, User, UserRole } from '@shared/types'
import type { Request, RequestHandler, Response } from 'express'
import type { RequestWithUser } from '@/interfaces/auth.interface'
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
    const { sort, limit } = req.query

    const options: { sort?: string, limit?: number } = {}

    if (sort && typeof sort === 'string') {
      options.sort = sort
    }

    if (limit) {
      const parsedLimit = Number.parseInt(limit as string, 10)
      if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
        options.limit = parsedLimit
      }
    }

    const users = await this.userService.getAllUsers(options)
    const response: SuccessResponseBody<User[]> = {
      success: true,
      data: users,
      message: 'USERS.GET_ALL_SUCCESS',
    }

    res.status(200).json(response)
  })

  getUsersCount: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const total = await this.userService.getUsersCount()
    const response: SuccessResponseBody<{ total: number }> = {
      success: true,
      data: { total },
      message: 'USERS.COUNT_SUCCESS',
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

  updateUserPassword: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id
    const { currentPassword, newPassword }: { currentPassword: string, newPassword: string } = req.body

    const user = await this.userService.getUserById(userId)
    const isMatch = await this.userService.comparePassword(currentPassword, user.password)
    if (!isMatch) {
      throw new HttpException(400, 'USERS.CURRENT_PASSWORD_INCORRECT')
    }
    await this.userService.updateUser(userId, { password: newPassword })

    const response: SuccessResponseBody<undefined> = {
      success: true,
      message: 'USERS.PASSWORD_UPDATE_SUCCESS',
    }

    res.status(200).json(response)
  })

  deleteUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id

    const userReq = req as RequestWithUser
    if (!userReq.user || !userReq.user._id) {
      throw new HttpException(401, 'AUTH.UNAUTHORIZED')
    }

    // Lấy thông tin người dùng cần xóa
    const targetUser = await this.userService.getUserByIdInternal(userId)
    const actorRole: UserRole = userReq.user.role ?? 'student'
    const targetRole: UserRole = targetUser.role ?? 'student'

    // Check if deleting self
    const isSelf = userReq.user._id.toString() === targetUser._id?.toString()

    // Apply role-based deletion rules
    // Rule 1: Admin cannot delete other admins or any superadmin (but can self-delete)
    if (actorRole === 'admin') {
      if (targetRole === 'admin' && !isSelf) {
        throw new HttpException(403, 'USERS.CANNOT_DELETE_ADMIN')
      }
      if (targetRole === 'superadmin') {
        throw new HttpException(403, 'USERS.CANNOT_DELETE_SUPERADMIN')
      }
    }

    // Rule 2: Superadmin can delete admins and can self-delete
    // For safety, block superadmin deleting other superadmins (can be relaxed if needed)
    if (actorRole === 'superadmin' && targetRole === 'superadmin' && !isSelf) {
      throw new HttpException(403, 'USERS.CANNOT_DELETE_OTHER_SUPERADMIN')
    }

    // Rule 3: Regular users (student, teacher) can only delete themselves
    if (actorRole !== 'admin' && actorRole !== 'superadmin') {
      if (!isSelf) {
        throw new HttpException(403, 'AUTH.FORBIDDEN')
      }
    }

    await this.userService.deleteUser(userId)

    const response: SuccessResponseBody<undefined> = {
      success: true,
      message: 'USERS.DELETE_SUCCESS',
    }
    res.status(200).json(response)
  })

  public requestEmailVerification: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    let { email, username } = req.body

    let user: User
    if (username) {
      user = await this.userService.findUserByUsername(username)
      email = user.email
    }
    else {
      user = await this.userService.getUserByEmail(email)
    }

    if (user.isEmailVerified)
      throw new HttpException(409, 'AUTH.EMAIL_ALREADY_VERIFIED')

    if (!user._id)
      throw new HttpException(400, 'AUTH.USER_NOT_FOUND')

    const { otp, verificationToken } = await this.otpService.requestOTP(user._id, 'EMAIL_VERIFICATION', true)
    await this.otpService.sendEmailVerificationMail(email, user.fullName, otp, verificationToken)

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

    if (!user._id)
      throw new HttpException(400, 'AUTH.USER_NOT_FOUND')

    await this.otpService.verifyOTP(user._id, 'EMAIL_VERIFICATION', otp)
    await this.userService.updateUser(user._id, { isEmailVerified: true })

    const response: SuccessResponseBody<undefined> = {
      success: true,
      message: 'AUTH.OTP.EMAIL_VERIFIED',
    }

    res.status(200).json(response)
  })

  public requestPasswordReset: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body
    const user = await this.userService.getUserByEmail(email)

    if (!user._id)
      throw new HttpException(400, 'AUTH.USER_NOT_FOUND')

    const { otp, verificationToken } = await this.otpService.requestOTP(user._id, 'PASSWORD_RESET', true)
    await this.otpService.sendPasswordResetMail(email, user.fullName, otp, verificationToken)

    const response: SuccessResponseBody<undefined> = {
      success: true,
      message: 'AUTH.PASSWORD_RESET.OTP_SENT',
    }

    res.status(200).json(response)
  })

  public resetPassword: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body
    const user = await this.userService.getUserByEmail(email)

    if (!user._id)
      throw new HttpException(400, 'AUTH.USER_NOT_FOUND')

    await this.otpService.verifyOTP(user._id, 'PASSWORD_RESET', otp)
    await this.userService.updateUser(user._id, { password: newPassword })

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

  /**
   * Cập nhật vai trò người dùng (chỉ admin)
   */
  public updateUserRole: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id
    const { role }: { role: UserRole } = req.body

    if (!role)
      throw new HttpException(400, 'USERS.ROLE_REQUIRED')

    const user = await this.userService.updateUser(userId, { role })

    const response: SuccessResponseBody<User> = {
      success: true,
      data: user,
      message: 'USERS.ROLE_UPDATE_SUCCESS',
    }

    res.status(200).json(response)
  })

  /**
   * Lấy danh sách quyền của người dùng dựa trên vai trò
   */
  public getUserPermissions: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id
    const user = await this.userService.getUserById(userId)
    const permissions = await this.userService.getUserPermissions(userId)

    const response: SuccessResponseBody<{ role: UserRole, permissions: Permission[] }> = {
      success: true,
      data: {
        role: user.role || 'student',
        permissions,
      },
      message: 'USERS.PERMISSIONS_RETRIEVED',
    }

    res.status(200).json(response)
  })
}
