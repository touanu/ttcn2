import type { Session } from '@models/sessions.model'
import type {
  AccessTokenPayload,
  ClientInfo,
  LoginCredential,
  LoginData,
  RefreshTokenData,
  Token,
} from '@shared/interfaces'
import type { UserDB } from '@shared/types'
import type { ObjectId } from 'mongoose'
import { randomBytes } from 'node:crypto'
import { HttpException } from '@exceptions/HttpException'
import { SessionModel } from '@models/sessions.model'
import { ACCESS_TOKEN_SECRET } from '@shared/config'
import { ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME } from '@shared/constants'
import { logger } from '@utils/logger'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { injectable } from 'tsyringe'

@injectable()
export class AuthService {
  /**
   * Tạo JWT token cho người dùng đã đăng nhập
   * @param payload - Dữ liệu người dùng để lưu trong token
   * @returns TokenData - Dữ liệu token bao gồm token và thời gian hết hạn
   * @throws Error - Nếu không tìm thấy SECRET_KEY trong biến môi trường
   * @throws Error - Nếu người dùng không có ID
   */
  private createAccessToken(payload: AccessTokenPayload): Token {
    if (!ACCESS_TOKEN_SECRET)
      throw new HttpException(500, 'ACCESS_TOKEN_SECRET_NOT_FOUND')

    if (payload.id === undefined) {
      throw new HttpException(500, 'CANNOT_CREATE_TOKEN_FOR_USER_WITHOUT_ID')
    }

    const dataStoredInToken: AccessTokenPayload = { id: payload.id, role: payload.role }
    const expiresIn = ACCESS_TOKEN_EXPIRATION_TIME
    const token = sign(dataStoredInToken, ACCESS_TOKEN_SECRET, { expiresIn })
    return { expiresIn, token }
  }

  /**
   * Tạo refresh token ngẫu nhiên
   * @returns Token - Dữ liệu token bao gồm token và thời gian hết hạn
   */
  private createRefreshToken(): Token {
    const token = randomBytes(64).toString('hex')
    return { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME, token }
  }

  /**
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

  /**
   * Tạo dữ liệu refresh token mới
   * @param userPayload - Dữ liệu người dùng để lưu trong token
   * @param userId - ID của người dùng
   * @param clientInfo - Thông tin về thiết bị và địa chỉ IP của người dùng
   * @returns Dữ liệu refresh token bao gồm access token, refresh token và session ID
   */
  private async createRefreshTokenData(
    userPayload: AccessTokenPayload,
    userId: ObjectId,
    clientInfo: ClientInfo,
  ): Promise<RefreshTokenData> {
    // Tạo access token và refresh token mới
    const newAccessToken = this.createAccessToken(userPayload)
    const newRefreshToken = this.createRefreshToken()
    const newSessionId = await this.createSession(
      newRefreshToken,
      userId,
      clientInfo,
    )

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      sessionId: newSessionId,
    }
  }

  /**
   * Lấy thông tin phiên đăng nhập theo ID
   * @param sessionId - ID của phiên đăng nhập
   * @returns Promise<Session> - Thông tin phiên đăng nhập
   * @throws HttpException - Nếu không tìm thấy phiên đăng nhập
   */
  public async getSessionById(sessionId: string): Promise<Session> {
    const session = await SessionModel.findById(sessionId).lean().exec()
    if (!session)
      throw new HttpException(401, 'INVALID_SESSION_ID')
    return session
  }

  /**
   * Đăng nhập người dùng
   * @param loginData - Dữ liệu đăng nhập bao gồm username và mật khẩu
   * @return Promise<LoginData> - Dữ liệu đăng nhập bao gồm access token, refresh token và thông tin người dùng
   * @throws HttpException - Nếu email hoặc mật khẩu không đúng
   * @throws HttpException - Nếu email chưa được xác nhận
   */
  public async login(
    loginData: LoginCredential,
    user: UserDB,
  ): Promise<LoginData> {
    const isPasswordMatching = await compare(loginData.password, user.password)
    if (!isPasswordMatching)
      throw new HttpException(401, 'AUTH.LOGIN.WRONG_CREDENTIALS')

    if (!user.isEmailVerified)
      throw new HttpException(401, 'AUTH.EMAIL_NOT_VERIFIED')

    const userPayload: AccessTokenPayload = {
      id: user._id.toString(),
      role: user.role,
      name: user.fullName,
    }

    const refreshTokenData = await this.createRefreshTokenData(
      userPayload,
      user._id,
      loginData.info || {},
    )

    return { user: userPayload, ...refreshTokenData }
  }

  /**
   * Đăng xuất người dùng bằng cách thu hồi refresh token
   * @param sessionId - ID của phiên đăng nhập cần thu hồi
   * @return Promise<void>
   */
  public async logout(sessionId: string): Promise<void> {
    const session = await SessionModel
      .findById(sessionId)
      .exec()

    // Tránh cách thức tấn công thu hồi nhiều lần
    if (!session)
      return

    if (session.revoked) {
      logger.warn(`Phiên đăng nhập đã bị thu hồi trước đó, không cần thu hồi lại\nSessionID: ${session._id}`)
      return
    }

    session.revoked = true
    session.revokedAt = new Date()
    await session.save()

    logger.info(`Đã thu hồi phiên đăng nhập có id: ${session._id}`)
  }

  /**
   * Làm mới phiên đăng nhập bằng cách cấp phát access token và refresh token mới
   * @param user - Đối tượng người dùng
   * @param session - Đối tượng phiên đăng nhập
   * @param refreshToken - Refresh token hiện tại của người dùng
   * @returns Promise<RefreshTokenData> - Dữ liệu refresh token mới bao gồm access token, refresh token và session ID
   * @throws HttpException - Nếu refresh token không hợp lệ hoặc phiên đăng nhập đã bị thu hồi
   */
  public async refreshSession(user: UserDB, session: Session, refreshToken: string): Promise<RefreshTokenData> {
    const isRefreshTokenMatching = await compare(refreshToken, session.refreshTokenHash)
    if (!isRefreshTokenMatching || session.revoked) {
      logger.warn(`Phát hiện sử dụng refresh token không hợp lệ\nSessionID: ${session._id.toString()}`)
      throw new HttpException(401, 'INVALID_REFRESH_TOKEN')
    }

    const userPayload: AccessTokenPayload = {
      id: user._id.toString(),
      role: user.role,
      name: user.fullName,
    }

    // Tạo access token và refresh token mới
    const refreshTokenData = await this.createRefreshTokenData(
      userPayload,
      user._id,
      {
        ipAddress: session.ipAddress || '',
        userAgent: session.userAgent || '',
        deviceInfo: session.deviceInfo || '',
      },
    )

    // Thu hồi phiên đăng nhập cũ
    const revokeResult = await SessionModel.findOneAndUpdate(
      { _id: session._id, revoked: false },
      { $set: { revoked: true, revokedAt: new Date() } },
      { new: true },
    ).lean().exec()

    if (!revokeResult) {
      logger.warn(`Phiên đăng nhập đã thu hồi sẵn rồi!\nSessionID: ${session._id.toString()}`)
      throw new HttpException(401, 'REVOKED_REFRESH_TOKEN')
    }

    logger.info(`Đã thu hồi phiên đăng nhập cũ\nOld SessionID: ${session._id.toString()}\nNew SessionID: ${refreshTokenData.sessionId}`)

    return refreshTokenData
  }
}
