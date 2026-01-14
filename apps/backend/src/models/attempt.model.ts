import type { AttemptDB } from '@interfaces/attempts.interface'
import { model, Schema } from 'mongoose'

const AttemptSchema = new Schema<AttemptDB>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  answers: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
})

AttemptSchema.index({ userId: 1, quizId: 1 })
AttemptSchema.index({ createdAt: -1 })

export const AttemptModel = model<AttemptDB>('Attempt', AttemptSchema)
