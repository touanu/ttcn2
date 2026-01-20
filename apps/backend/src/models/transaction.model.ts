import { model, Schema } from 'mongoose'

// Mô hình Transaction
const TransactionSchema = new Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
    paymentMethod: { type: String, required: true },
    transactionDate: { type: Date, default: Date.now },
    orderInfo: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export const TransactionModel = model('Transaction', TransactionSchema)
