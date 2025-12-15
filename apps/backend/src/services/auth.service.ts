import type { AccessTokenData, ClientInfo, LoginCredential, LoginResponse, Token, TokenWithOTP, User } from '@shared/interfaces'
import type { ObjectId } from 'mongoose'
import { randomBytes, randomInt } from 'node:crypto'
import { HttpException } from '@exceptions/HttpException'
import { SessionModel } from '@models/sessions.model'
import { UserModel } from '@models/users.model'
import { ACCESS_TOKEN_SECRET, FE_URL } from '@shared/config'
import { ACCESS_TOKEN_EXPIRATION_TIME, OTP_EXPIRATION_TIME, OTP_LENGTH, REFRESH_TOKEN_EXPIRATION_TIME } from '@shared/constants'
import { logger } from '@utils/logger'
import { sendMail } from '@utils/mailer'
import { compare, hash } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import { injectable } from 'tsyringe'

@injectable()
export class AuthService {
  /*
    * Tạo JWT token cho người dùng đã đăng nhập
    * @param user - Đối tượng người dùng
    * @returns TokenData - Dữ liệu token bao gồm token và thời gian hết hạn
    * @throws Error - Nếu không tìm thấy SECRET_KEY trong biến môi trường
    * @throws Error - Nếu người dùng không có ID
  */
  private createAccessToken(user: User): Token {
    if (!ACCESS_TOKEN_SECRET)
      throw new HttpException(500, 'ACCESS_TOKEN_SECRET_NOT_FOUND')

    if (user._id === undefined) {
      throw new HttpException(500, 'CANNOT_CREATE_TOKEN_FOR_USER_WITHOUT_ID')
    }

    const dataStoredInToken: AccessTokenData = { id: user._id.toString(), role: user.role }
    const expiresIn = ACCESS_TOKEN_EXPIRATION_TIME
    const token = sign(dataStoredInToken, ACCESS_TOKEN_SECRET, { expiresIn })
    return { expiresIn, token }
  }

  /*
    * Tạo refresh token cho người dùng đã đăng nhập
    * @param user - Đối tượng người dùng
    * @returns TokenData - Dữ liệu token bao gồm token và thời gian hết hạn
    * @throws Error - Nếu không tìm thấy SECRET_KEY trong biến môi trường
    * @throws Error - Nếu người dùng không có ID
  */
  private createRefreshToken(user: User): Token {
    if (!ACCESS_TOKEN_SECRET)
      throw new HttpException(500, 'ACCESS_TOKEN_SECRET_NOT_FOUND')

    if (user._id === undefined) {
      throw new HttpException(500, 'CANNOT_CREATE_TOKEN_FOR_USER_WITHOUT_ID')
    }

    const token = randomBytes(64).toString('hex')

    return { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME, token }
  }

  /*
    * Tạo phiên đăng nhập mới và lưu vào cơ sở dữ liệu
    * @param refreshToken - Refresh token của người dùng
    * @param userId - ID của người dùng
    * @param info - Thông tin về thiết bị và địa chỉ IP của người dùng
    * @returns Promise<string> - ID của phiên đăng nhập mới
    * @throws HttpException - Nếu có lỗi trong quá trình lưu phiên đăng nhập
  */
  private async createSession(refreshToken: Token, userId: ObjectId, info: ClientInfo): Promise<string> {
    const session = new SessionModel({
      userId,
      refreshTokenHash: await hash(refreshToken.token, 10),
      userAgent: info.userAgent || '',
      ipAddress: info.ipAddress || '',
      deviceInfo: info.deviceInfo || '',
      expiresAt: new Date(Date.now() + refreshToken.expiresIn * 1000),
    })

    await session.save().catch((error) => {
      logger.error(`Lỗi khi lưu phiên đăng nhập: ${error.message}`)
      throw new HttpException(500, 'SESSION_CREATION_FAILED')
    })

    return session._id.toString()
  }

  /*
    * Tạo OTP và token chứa OTP
    * @returns TokenDataWithOTP - Dữ liệu token bao gồm token, OTP và thời gian hết hạn
    * @throws Error - Nếu không tìm thấy SECRET_KEY trong biến môi trường
  */
  private createOTP(): TokenWithOTP {
    if (!ACCESS_TOKEN_SECRET)
      throw new HttpException(500, 'ACCESS_TOKEN_SECRET_NOT_FOUND')

    const expiresIn = OTP_EXPIRATION_TIME

    // Tạo OTP ngẫu nhiên và token chứa OTP
    const otp: string = randomInt(0, 10 ** OTP_LENGTH)
      .toString()
      .padStart(OTP_LENGTH, '0')

    const token: string = sign({ otp }, ACCESS_TOKEN_SECRET as string, { expiresIn })

    return { expiresIn, token, otp }
  }

  /*
    * Giải mã và xác minh token OTP
    * @param token - Token OTP cần xác minh
    * @returns string - Mã OTP đã giải mã
    * @throws HttpException - Nếu token không hợp lệ hoặc đã hết hạn
  */
  private verifyOTPToken(token: string): string {
    let decodedOtp: string
    try {
      const decoded = verify(token, ACCESS_TOKEN_SECRET) as { otp: string }
      decodedOtp = decoded.otp
    }
    catch (error) {
      const errorMessage = (error as Error).message
      logger.warn(`Lỗi khi giải mã OTP: ${errorMessage}`)

      // Kiểm tra nếu token đã hết hạn
      if (errorMessage.includes('jwt expired')) {
        throw new HttpException(400, `OTP_EXPIRED`)
      }

      // Các lỗi khác (token không hợp lệ, sai định dạng, etc.)
      throw new HttpException(400, `INVALID_OTP_TOKEN`)
    }

    return decodedOtp
  }

  /*
    * Yêu cầu OTP để xác nhận email
    * @param email - Địa chỉ email của người dùng
    * @returns Promise<void>
    * @throws HttpException - Nếu không tìm thấy người dùng với email đã cho
    * @throws HttpException - Nếu có lỗi trong quá trình gửi email
  */
  public async requestOTP(email: string): Promise<void> {
    const findUser = await UserModel.findOne({ email }).lean().exec()
    if (!findUser)
      throw new HttpException(404, `USER_NOT_FOUND`)

    if (findUser.isEmailVerified)
      throw new HttpException(400, `EMAIL_ALREADY_VERIFIED`)

    const tokenData = this.createOTP()
    const verifyUrl = `${FE_URL}/verify-email?token=${tokenData.token}`

    const mailData = {
      verifyUrl,
      currentYear: new Date().getFullYear(),
      bannerUrl: `${FE_URL}/email-banner.png`,
      expiresInMinutes: tokenData.expiresIn / 60,
      username: findUser.fullName || 'Người dùng',
      otp: tokenData.otp,
    }

    const sendMailError = await sendMail(
      email,
      'Yêu cầu xác nhận email',
      'emailVerification',
      mailData,
    )

    if (sendMailError) {
      const errorMessage = sendMailError instanceof Error ? sendMailError.message : `EMAIL_SENDING_ERROR`
      throw new HttpException(500, errorMessage)
    }

    findUser.isEmailVerified = false
    findUser.emailVerificationToken = tokenData.token
    await UserModel.updateOne({ _id: findUser._id }, findUser).exec()
  }

  /*
    * Đăng ký người dùng mới
    * @param userData - Dữ liệu người dùng bao gồm email và mật khẩu
    * @return Promise<User> - Đối tượng người dùng đã đăng ký
    * @throws HttpException - Nếu email đã tồn tại
  */
  public async signup(userData: User): Promise<User> {
    const findUser = await UserModel.exists({ email: userData.email }).lean().exec()
    if (findUser)
      throw new HttpException(409, `USER_EMAIL_EXISTED`)

    userData.password = await hash(userData.password, 10)

    await UserModel.create({ ...userData })
    return userData
  }

  /*
    * Đăng nhập người dùng
    * @param loginData - Dữ liệu đăng nhập bao gồm username và mật khẩu
    * @return Promise<TokenData> - Dữ liệu token bao gồm token và thời gian hết hạn
    * @throws HttpException - Nếu email hoặc mật khẩu không đúng
    * @throws HttpException - Nếu email chưa được xác nhận
  */
  public async login(loginData: LoginCredential): Promise<LoginResponse> {
    const findUser = await UserModel.findOne({ username: loginData.username }).lean().exec()
    if (!findUser)
      throw new HttpException(401, 'WRONG_USERNAME_OR_PASSWORD')

    const isPasswordMatching = compare(loginData.password, findUser.password)
    if (!isPasswordMatching)
      throw new HttpException(401, 'WRONG_USERNAME_OR_PASSWORD')

    if (!findUser.isEmailVerified)
      throw new HttpException(401, 'EMAIL_NOT_VERIFIED')

    const refreshToken = this.createRefreshToken(findUser)
    const accessToken = this.createAccessToken(findUser)
    const sessionId = await this.createSession(
      refreshToken,
      findUser._id,
      loginData.info || {},
    )

    return { accessToken, refreshToken, sessionId }
  }

  /*
    * Đăng xuất người dùng bằng cách thu hồi refresh token
    * @param refreshToken - Refresh token của người dùng
    * @return Promise<void>
  */
  public async logout(sessionId: string): Promise<void> {
    const session = await SessionModel
      .findById(sessionId)
      .exec()

    if (!session)
      return

    session.revoked = true
    session.revokedAt = new Date()
    await session.save()

    logger.info(`Đã thu hồi phiên đăng nhập có id: ${session._id}`)
  }

  /*
    * Xác nhận email bằng token
    * @param token - Token xác nhận email
    * @return Promise<void>
    * @throws HttpException - Nếu không tìm thấy người dùng với token đã cho
    * @throws HttpException - Nếu token không hợp lệ hoặc đã hết hạn
  */
  public async verifyEmailWithToken(token: string): Promise<void> {
    const findUser = await UserModel.findOne({ emailVerificationToken: token }).exec()
    if (!findUser)
      throw new HttpException(404, `INVALID_VERIFICATION_TOKEN`)

    if (!findUser.emailVerificationToken)
      throw new HttpException(400, `NO_TOKEN_REQUESTED`)

    // Chắc chắn rằng token hợp lệ
    this.verifyOTPToken(findUser.emailVerificationToken)

    findUser.isEmailVerified = true
    findUser.emailVerificationToken = undefined
    findUser.save()
  }

  /*
    * Xác nhận email bằng OTP
    * @param email - Địa chỉ email của người dùng
    * @param otp - Mã OTP để xác nhận email
    * @return Promise<void>
    * @throws HttpException - Nếu không tìm thấy người dùng với email đã cho
    * @throws HttpException - Nếu không có yêu cầu OTP
    * @throws HttpException - Nếu OTP không hợp lệ
  */
  public async verifyEmailWithOTP(email: string, otp: string): Promise<void> {
    const findUser = await UserModel.findOne({ email }).exec()
    if (!findUser)
      throw new HttpException(404, `USER_NOT_FOUND`)

    if (!findUser.emailVerificationToken)
      throw new HttpException(400, `NO_OTP_REQUESTED`)

    const decodedOtp: string = this.verifyOTPToken(findUser.emailVerificationToken)
    if (decodedOtp !== otp)
      throw new HttpException(400, `INVALID_OTP`)

    findUser.isEmailVerified = true
    findUser.emailVerificationToken = undefined
    findUser.save()
  }

  /*
    * Tạo mới access token sử dụng refresh token
    * @param refreshToken - Refresh token của người dùng
    * @return Promise<TokenData> - Dữ liệu token bao gồm token và thời gian hết hạn
    * @throws HttpException - Nếu refresh token không hợp lệ hoặc đã bị thu hồi
    * @throws HttpException - Nếu không tìm thấy người dùng liên kết với phiên đăng nhập
  */
  public async refreshSession(sessionId: string, refreshToken: string): Promise<LoginResponse> {
    const session = await SessionModel.findById(sessionId).lean().exec()
    if (!session)
      throw new HttpException(401, 'INVALID_SESSION_ID')

    const isRefreshTokenMatching = compare(refreshToken, session.refreshTokenHash)
    if (!isRefreshTokenMatching) {
      logger.warn(`Phát hiện sử dụng refresh token không hợp lệ\nSessionID: ${session._id.toString()}\nRefreshToken: ${refreshToken}`)
      throw new HttpException(401, 'INVALID_REFRESH_TOKEN')
    }

    if (session.revoked) {
      logger.warn(`Phát hiện sử dụng lại refresh token đã bị thu hồi\nSessionID: ${session._id.toString()}\nRefreshToken: ${refreshToken}`)
      throw new HttpException(401, 'REVOKED_REFRESH_TOKEN')
    }

    const findUser = await UserModel.findById(session.userId).lean().exec()
    if (!findUser)
      throw new HttpException(404, `USER_NOT_FOUND`)

    // Tạo access token và refresh token mới
    const newAccessToken = this.createAccessToken(findUser)
    const newRefreshToken = this.createRefreshToken(findUser)
    const newSessionId = await this.createSession(
      newRefreshToken,
      findUser._id,
      {
        userAgent: session.userAgent || '',
        ipAddress: session.ipAddress || '',
        deviceInfo: session.deviceInfo || '',
      } as ClientInfo,
    )

    // Thu hồi phiên đăng nhập cũ
    session.revoked = true
    session.revokedAt = new Date()
    await SessionModel.updateOne({ _id: session._id }, session).exec()
    logger.info(`Đã thu hồi phiên đăng nhập cũ\nOld SessionID: ${session._id.toString()}\nNew SessionID: ${newSessionId}`)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      sessionId: newSessionId,
    }
  }

  /*
    * Yêu cầu đặt lại mật khẩu
    * @param email - Địa chỉ email của người dùng
    * @return Promise<void>
    * @throws HttpException - Nếu không tìm thấy người dùng với email đã cho
    * @throws HttpException - Nếu có lỗi trong quá trình gửi email
  */
  public async requestPasswordReset(email: string): Promise<void> {
    const findUser = await UserModel.findOne({ email }).lean().exec()
    if (!findUser)
      throw new HttpException(404, `USER_NOT_FOUND`)

    const tokenData = this.createOTP()
    const resetUrl = `${FE_URL}/reset-password?token=${tokenData.token}`
    const mailData = {
      resetUrl,
      currentYear: new Date().getFullYear(),
      logoUrl: `${FE_URL}/logo.png`,
      bannerUrl: `${FE_URL}/email-banner.png`,
      expiresInMinutes: tokenData.expiresIn / 60,
      username: findUser.fullName || 'Người dùng',
      otp: tokenData.otp,
    }

    const sendMailError = await sendMail(
      email,
      'Yêu cầu đặt lại mật khẩu',
      'passwordReset',
      mailData,
    )

    if (sendMailError) {
      const errorMessage = sendMailError instanceof Error ? sendMailError.message : `EMAIL_SENDING_ERROR`
      throw new HttpException(500, errorMessage)
    }

    findUser.passwordResetToken = tokenData.token
    await UserModel.updateOne({ _id: findUser._id }, findUser).exec()
  }

  /*
    * Đặt lại mật khẩu bằng OTP
    * @param email - Địa chỉ email của người dùng
    * @param otp - Mã OTP để đặt lại mậresetPasswordt khẩu
    * @param newPassword - Mật khẩu mới
    * @return Promise<void>
    * @throws HttpException - Nếu không tìm thấy người dùng với email đã cho
    * @throws HttpException - Nếu không có yêu cầu đặt lại mật khẩu
    * @throws HttpException - Nếu OTP không hợp lệ
  */
  public async resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
    const findUser = await UserModel.findOne({ email }).lean().exec()
    if (!findUser)
      throw new HttpException(404, `USER_NOT_FOUND`)

    if (!findUser.passwordResetToken)
      throw new HttpException(400, `NO_PASSWORD_RESET_REQUESTED`)

    const decodedOtp: string = this.verifyOTPToken(findUser.passwordResetToken)
    if (decodedOtp !== otp)
      throw new HttpException(400, `INVALID_OTP`)

    const hashedPassword = await hash(newPassword, 10)
    findUser.password = hashedPassword
    findUser.passwordResetToken = undefined
    await UserModel.updateOne({ _id: findUser._id }, findUser).exec()
  }
}
