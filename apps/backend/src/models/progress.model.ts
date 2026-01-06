import type { Progress } from '@shared/interfaces'
import { model, Schema } from 'mongoose'

const ProgressSchema = new Schema<Progress>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessonIds: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  percentage: { type: Number, default: 0, min: 0, max: 100 },
  updatedAt: { type: Date, default: Date.now },
})

ProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true })

export const ProgressModel = model<Progress>('Progress', ProgressSchema)
