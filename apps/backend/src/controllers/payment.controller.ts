import type { Request, Response } from 'express'
import { PaymentService } from '@services/payment.service'
import { inject, injectable } from 'tsyringe'

@injectable()
export class PaymentController {
  constructor(
    @inject(PaymentService) private readonly paymentService: PaymentService,
  ) {}

  public createPaymentUrl = async (req: Request, res: Response) => {
    const { amount, orderId, orderInfo } = req.body
    const transactionDate = new Date().toISOString().replace(/[T\-:Z]/g, '')

    try {
      const paymentUrl = await this.paymentService.createPaymentUrl(
        Number(amount),
        String(orderId),
        String(orderInfo),
        transactionDate,
      )
      return res.json({ url: paymentUrl })
    }
    catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return res.status(500).json({ message })
    }
  }

  public handleVNPayReturn = async (req: Request, res: Response) => {
    try {
      await this.paymentService.handleVNPayReturn(req.query)
      return res.json({ message: 'Payment processed successfully' })
    }
    catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      return res.status(500).json({ message })
    }
  }
}
