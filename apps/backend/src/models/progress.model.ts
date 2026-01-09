import type { ProgressDB } from '@/interfaces/progress.interface'
import { model, Schema } from 'mongoose'

const ProgressSchema = new Schema<ProgressDB>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessonIds: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  percentage: { type: Number, default: 0, min: 0, max: 100 },
  updatedAt: { type: Date, default: Date.now },
})

ProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true })

export const ProgressModel = model<ProgressDB>('Progress', ProgressSchema)
