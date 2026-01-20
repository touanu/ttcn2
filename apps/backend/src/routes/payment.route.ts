import { PaymentController } from '@controllers/payment.controller'
import { Router } from 'express'
import { inject, injectable } from 'tsyringe'

@injectable()
export class PaymentRoute {
  public router: Router = Router()
  public path = '/payment'

  constructor(
    @inject(PaymentController) private readonly paymentController: PaymentController,
  ) {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/create-payment-url`,
      this.paymentController.createPaymentUrl,
    )

    this.router.get(
      `${this.path}/vnpay-return`,
      this.paymentController.handleVNPayReturn,
    )
  }
}
