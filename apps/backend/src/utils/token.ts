import type { AccessTokenData, ClientInfo, Token, TokenWithOTP, User } from '@shared/interfaces'
import type { ObjectId } from 'mongoose'
import { randomBytes, randomInt } from 'node:crypto'
import { SessionModel } from '@models/sessions.model'
import { ACCESS_TOKEN_SECRET } from '@shared/config'
import { OTP_LENGTH } from '@shared/constants'
import { hash } from 'bcryptjs'
import { sign, verify } from 'jsonwebtoken'
import { logger } from './logger'

/*
  * Tạo JWT token cho người dùng đã đăng nhập
  * @param user - Đối tượng người dùng
  * @returns TokenData - Dữ liệu token bao gồm token và thời gian hết hạn
  * @throws Error - Nếu không tìm thấy SECRET_KEY trong biến môi trường
  * @throws Error - Nếu người dùng không có ID
*/
export function createAccessToken(user: User): Token {
  if (!ACCESS_TOKEN_SECRET)
    throw new Error('Không tìm thấy SECRET_KEY trong biến môi trường')

  if (user._id === undefined) {
    throw new Error('Không thể tạo token cho người dùng không có ID')
  }

  const dataStoredInToken: AccessTokenData = { id: user._id.toString(), role: user.role }
  const expiresIn = 60 * 60 // 1h
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
export function createRefreshToken(user: User): Token {
  if (!ACCESS_TOKEN_SECRET)
    throw new Error('Không tìm thấy SECRET_KEY trong biến môi trường')

  if (user._id === undefined) {
    throw new Error('Không thể tạo token cho người dùng không có ID')
  }

  const token = randomBytes(64).toString('hex')
  const expiresIn = 7 * 24 * 60 * 60 // 7 ngày

  return { expiresIn, token }
}

export async function createSession(refreshToken: Token, userId: ObjectId, info: ClientInfo): Promise<void> {
  const session = new SessionModel({
    userId,
    refreshToken: await hash(refreshToken.token, 10),
    userAgent: info.userAgent || '',
    ipAddress: info.ipAddress || '',
    deviceInfo: info.deviceInfo || '',
    expiresAt: new Date(Date.now() + refreshToken.expiresIn * 1000),
  })

  session.save().catch((error) => {
    logger.error(`Lỗi khi tạo phiên đăng nhập: ${error}`)
    throw new Error('Không thể tạo phiên đăng nhập')
  })
}

/*
  * Tạo OTP và token chứa OTP
  * @returns TokenDataWithOTP - Dữ liệu token bao gồm token, OTP và thời gian hết hạn
  * @throws Error - Nếu không tìm thấy SECRET_KEY trong biến môi trường
*/
export function createOTP(): TokenWithOTP {
  if (!ACCESS_TOKEN_SECRET)
    throw new Error('Không tìm thấy SECRET_KEY trong biến môi trường')

  const expiresIn = 10 * 60 // 10 phút

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
export function verifyOTPToken(token: string): string {
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
