import type { OTPType } from '@shared/types'
import type { ObjectId, Types } from 'mongoose'
import { randomBytes, randomInt } from 'node:crypto'
import { HttpException } from '@exceptions/HttpException'
import { OTPModel } from '@models/otp.model'
import { FE_URL } from '@shared/config'
import { OTP_EXPIRATION_TIME, OTP_LENGTH } from '@shared/constants'
import { sendMail } from '@utils/mailer'
import { compare, hash } from 'bcryptjs'
import { injectable } from 'tsyringe'

@injectable()
export class OtpService {
  /**
   * Tạo và lưu mã OTP mới cho người dùng
   * @param userId - ID của người dùng
   * @param type - Loại OTP
   * @param generateToken - Có tạo token để xác thực qua URL không
   * @returns Mã OTP và token xác thực (nếu có)
   */
  public async requestOTP(
    userId: ObjectId,
    type: OTPType,
    generateToken: boolean = false,
  ): Promise<{ otp: string, verificationToken?: string }> {
    const otp: string = randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH).toString()
    const hashedOTP: string = await hash(otp, 10)
    const verificationToken = generateToken ? randomBytes(32).toString('hex') : undefined

    const otpRecord = new OTPModel({
      userId,
      otpHash: hashedOTP,
      verificationToken,
      otpType: type,
    })

    await otpRecord.save()

    return { otp, verificationToken }
  }

  /**
   * Xác thực mã OTP cho người dùng
   * @param userId - ID của người dùng
   * @param type - Loại OTP
   * @param otp - Mã OTP cần xác thực
   */
  public async verifyOTP(
    userId: ObjectId,
    type: OTPType,
    otp: string,
  ): Promise<void> {
    const otpRecord = await OTPModel
      .findOne({ userId, otpType: type, used: false })
      .sort({ createdAt: -1 })

    if (!otpRecord)
      throw new HttpException(400, 'INVALID_OR_EXPIRED_OTP')

    const isValid = await compare(otp, otpRecord.otpHash)

    if (!isValid)
      throw new HttpException(400, 'INVALID_OR_EXPIRED_OTP')

    otpRecord.used = true
    await otpRecord.save()
  }

  /**
   * Xác thực token cho xác thực qua URL
   * @param token - Token xác thực
   * @param type - Loại OTP
   */
  public async verifyToken(
    token: string,
    type: OTPType,
  ): Promise<Types.ObjectId> {
    const otpRecord = await OTPModel
      .findOne({ verificationToken: token, otpType: type, used: false })

    if (!otpRecord)
      throw new HttpException(400, 'INVALID_OR_EXPIRED_TOKEN')

    otpRecord.used = true
    await otpRecord.save()

    return otpRecord.userId
  }

  /**
   * Gửi email chứa mã OTP đến người dùng
   * @param email - Địa chỉ email của người dùng
   * @param fullName - Họ tên của người dùng
   * @param otp - Mã OTP
   * @param verificationToken - Token xác thực cho URL
   * @returns void
   */
  public async sendEmailVerificationMail(
    email: string,
    fullName: string,
    otp: string,
    verificationToken?: string,
  ): Promise<void> {
    const verifyUrl = verificationToken
      ? `${FE_URL}/verify-email?token=${verificationToken}`
      : `${FE_URL}/verify-email?email=${encodeURIComponent(email)}`

    const mailData = {
      verifyUrl,
      currentYear: new Date().getFullYear(),
      bannerUrl: `${FE_URL}/email-banner.png`,
      expiresInMinutes: OTP_EXPIRATION_TIME / 60,
      username: fullName || 'Người dùng',
      otp,
    }

    try {
      await sendMail(email, 'Yêu cầu xác nhận email', 'emailVerification', mailData)
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : `EMAIL_SENDING_ERROR`
      throw new HttpException(500, errorMessage)
    }
  }

  public async sendPasswordResetMail(
    email: string,
    fullName: string,
    otp: string,
    verificationToken?: string,
  ): Promise<void> {
    const resetUrl = verificationToken
      ? `${FE_URL}/reset-password?token=${verificationToken}`
      : `${FE_URL}/reset-password?email=${encodeURIComponent(email)}`

    const mailData = {
      resetUrl,
      currentYear: new Date().getFullYear(),
      bannerUrl: `${FE_URL}/email-banner.png`,
      expiresInMinutes: OTP_EXPIRATION_TIME / 60,
      username: fullName || 'Người dùng',
      otp,
    }

    try {
      await sendMail(email, 'Yêu cầu đặt lại mật khẩu', 'passwordReset', mailData)
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : `EMAIL_SENDING_ERROR`
      throw new HttpException(500, errorMessage)
    }
  }
}
