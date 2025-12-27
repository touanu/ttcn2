import type { OTPType } from '@shared/types'
import type { ObjectId } from 'mongoose'
import { randomInt } from 'node:crypto'
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
   * @returns string - Mã OTP đã tạo
   */
  public async requestOTP(
    userId: ObjectId,
    type: OTPType,
  ): Promise<{ otp: string, hashedOTP: string }> {
    const otp: string = randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH).toString()
    const hashedOTP: string = await hash(otp, 10)
    const otpRecord = new OTPModel({
      userId,
      otpHash: hashedOTP,
      otpType: type,
    })

    await otpRecord.save()

    return { otp, hashedOTP }
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
    otp?: string,
    hashedOtp?: string,
  ): Promise<void> {
    const otpRecord = await OTPModel
      .findOne({ userId, otpType: type, used: false })
      .sort({ createdAt: -1 })

    if (!otpRecord)
      throw new HttpException(400, 'INVALID_OR_EXPIRED_OTP')

    let isValid: boolean
    if (otp) {
      isValid = await compare(otp, otpRecord.otpHash)
    }
    else if (hashedOtp) {
      isValid = otpRecord.otpHash === hashedOtp
    }
    else {
      throw new HttpException(400, 'OTP_NOT_PROVIDED')
    }

    if (!isValid)
      throw new HttpException(400, 'INVALID_OR_EXPIRED_OTP')

    otpRecord.used = true
    await otpRecord.save()
  }

  /**
   * Gửi email chứa mã OTP đến người dùng
   * @param email - Địa chỉ email của người dùng
   * @param fullName - Họ tên của người dùng
   * @param otp - Mã OTP
   * @param hashedOTP - Mã OTP đã được băm
   * @returns void
   */
  public async sendEmailVerificationMail(
    email: string,
    fullName: string,
    otp: string,
    hashedOTP: string,
  ): Promise<void> {
    const verifyUrl = `${FE_URL}/verify-email?hash=${hashedOTP}&email=${encodeURIComponent(email)}`

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
    hashedOTP: string,
  ): Promise<void> {
    const resetUrl = `${FE_URL}/reset-password?hash=${hashedOTP}&email=${encodeURIComponent(email)}`

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
