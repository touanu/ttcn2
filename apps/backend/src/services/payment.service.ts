// apps/backend/src/services/payment.service.ts

import crypto from 'node:crypto'
import process from 'node:process'
import { TransactionModel } from '@models/transaction.model'
import { injectable } from 'tsyringe'

type VnpParams = Record<string, string>

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value || value.trim() === '') {
    throw new Error(`Missing env variable: ${name}`)
  }
  return value
}

function toVnpString(value: unknown): string {
  // VNPay thường nhận string, nên mình ép về string cho chắc
  if (value === null || value === undefined)
    return ''
  return String(value)
}

function sortObject(obj: Record<string, string>): Record<string, string> {
  const sorted: Record<string, string> = {}
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = obj[key]
    })
  return sorted
}

function buildQueryString(params: Record<string, string>): string {
  // Nhiều dự án VNPay ở VN dùng encode cho value (đặc biệt OrderInfo).
  const sorted = sortObject(params)
  return Object.keys(sorted)
    .map(key => `${key}=${encodeURIComponent(sorted[key])}`)
    .join('&')
}

function signSha512(data: string, secretKey: string): string {
  // crypto.createHmac nhận secretKey là string là OK, khỏi Buffer.from
  return crypto.createHmac('sha512', secretKey).update(data, 'utf-8').digest('hex')
}

@injectable()
export class PaymentService {
  // Lưu thông tin giao dịch vào cơ sở dữ liệu
  async saveTransaction(transactionData: any) {
    return await TransactionModel.create(transactionData)
  }

  // Tạo URL thanh toán VNPay
  async createPaymentUrl(
    amount: number,
    orderId: string,
    orderInfo: string,
    transactionDate: string,
    ipAddr = '127.0.0.1',
  ): Promise<string> {
    const vnp_TmnCode = requireEnv('VNPAY_MERCHANT_CODE')
    const vnp_ReturnUrl = requireEnv('VNPAY_RETURN_URL')
    const vnp_PaymentUrl = requireEnv('VNPAY_PAYMENT_URL')
    const secretKey = requireEnv('VNPAY_API_KEY')

    // VNPay: amount * 100 (đơn vị nhỏ nhất)
    const vnpAmount = Math.round(Number(amount) * 100)

    const vnp_Params: VnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: toVnpString(vnp_TmnCode),
      vnp_Amount: toVnpString(vnpAmount),
      vnp_CurrCode: 'VND',
      vnp_TxnRef: toVnpString(orderId),
      vnp_OrderInfo: toVnpString(orderInfo),
      vnp_OrderType: 'billpayment',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: toVnpString(vnp_ReturnUrl),
      vnp_IpAddr: toVnpString(ipAddr),
      vnp_CreateDate: toVnpString(transactionDate),
    }

    // 1) build query string để ký
    const dataToSign = buildQueryString(vnp_Params)

    // 2) tạo chữ ký
    const signature = signSha512(dataToSign, secretKey)

    // 3) thêm signature
    const finalParams: VnpParams = {
      ...vnp_Params,
      vnp_SecureHash: signature,
    }

    // 4) tạo URL cuối cùng
    const finalQuery = buildQueryString(finalParams)
    const vnpUrl = `${vnp_PaymentUrl}?${finalQuery}`

    return vnpUrl
  }

  // Xử lý kết quả thanh toán từ VNPay (callback)
  async handleVNPayReturn(queryParams: any): Promise<void> {
    const secretKey = requireEnv('VNPAY_API_KEY')

    // Copy về object string-string
    const params: Record<string, string> = {}
    Object.keys(queryParams || {}).forEach((k) => {
      params[k] = toVnpString(queryParams[k])
    })

    const secureHash = params.vnp_SecureHash
    delete params.vnp_SecureHash
    delete params.vnp_SecureHashType // đôi khi VNPay có field này

    if (!secureHash) {
      throw new Error('Missing vnp_SecureHash')
    }

    const dataToSign = buildQueryString(params)
    const computedSignature = signSha512(dataToSign, secretKey)

    if (computedSignature !== secureHash) {
      throw new Error('Invalid signature')
    }

    const transactionData = {
      transactionId: params.vnp_TxnRef,
      status: params.vnp_ResponseCode === '00' ? 'success' : 'failed',
      amount: params.vnp_Amount,
      paymentMethod: 'VNPay',
      transactionDate: new Date(),
      orderInfo: params.vnp_OrderInfo,
      responseCode: params.vnp_ResponseCode,
      bankCode: params.vnp_BankCode,
      transactionNo: params.vnp_TransactionNo,
      payDate: params.vnp_PayDate,
    }

    await this.saveTransaction(transactionData)
  }
}
