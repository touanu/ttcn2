import type { TransportOptions } from 'nodemailer'
import { MAILER_HOST, MAILER_PASSWORD, MAILER_PORT, MAILER_USER } from '@shared/config'
import { createTransport } from 'nodemailer'
import { logger } from './logger'
import { renderMJMLTemplate, renderTemplate } from './renderTemplate'

export const mailer = createTransport({
  host: MAILER_HOST,
  port: MAILER_PORT,
  secure: MAILER_PORT === 465,
  auth: {
    user: MAILER_USER,
    pass: MAILER_PASSWORD,
  },
})

/**
 * Gửi email sử dụng mẫu đã cho và dữ liệu tương ứng.
 *
 * @param to Địa chỉ email người nhận
 * @param subject Tiêu đề email
 * @param mailTemplate Tên mẫu email (không bao gồm phần mở rộng)
 * @param mailData Dữ liệu để kết xuất mẫu email
 */
export async function sendMail(
  to: string,
  subject: string,
  mailTemplate: string,
  mailData: Record<string, any>,
): Promise<Error | void> {
  mailData.appName = 'Englearn'
  const htmlMail = await renderMJMLTemplate(`${mailTemplate}.eta`, mailData)
  const fallbackMail = await renderTemplate(`${mailTemplate}.txt.eta`, mailData)

  if (!htmlMail || !fallbackMail) {
    logger.error(`Không thể kết xuất mẫu email xác nhận cho ${to}`)
    logger.debug(`Template: ${mailTemplate}, Data: ${JSON.stringify(mailData)}`)
    logger.debug(`HTML Mail: ${htmlMail}, Fallback Mail: ${fallbackMail}`)
    return new Error(`EMAIL_TEMPLATE_RENDERING_ERROR`)
  }

  const mailOptions = {
    from: `"No Reply" <${MAILER_USER}>`,
    to,
    subject,
    html: htmlMail,
    text: fallbackMail,
  } as TransportOptions

  return new Promise<void>((resolve, reject) => {
    mailer.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(`Đã có lỗi trong khi gửi mail đến ${to}: ${error.message}`)
        reject(new Error(`EMAIL_SENDING_ERROR`))
        return
      }
      logger.info(`Mail được gửi đến ${to}, id: ${info.messageId}`)
      logger.debug(`Envelope: ${info.envelope}, accepted: ${info.accepted}, rejected: ${info.rejected}, nội dung mail: ${info.response}`)
      resolve()
    })
  })
}
