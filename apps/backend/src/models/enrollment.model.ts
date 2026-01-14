import type { EnrollmentDB } from '@interfaces/enrollment.interface'
import { ENROLLMENT_STATUSES, PAYMENT_METHODS } from '@shared/types'
import { model, Schema } from 'mongoose'

const EnrollmentSchema = new Schema<EnrollmentDB>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  status: { type: String, enum: ENROLLMENT_STATUSES, default: 'in-progress' },
  price: { type: Number, required: true, default: 0 },
  paidPrice: { type: Number, required: true, default: 0 },
  paidMethod: { type: String, enum: PAYMENT_METHODS, required: true },
  enrolledAt: { type: Date, default: Date.now },
  progressPercentage: { type: Number, default: 0 },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true })
EnrollmentSchema.index({ userId: 1 })
EnrollmentSchema.index({ courseId: 1 })

export const EnrollmentModel = model<EnrollmentDB>('Enrollment', EnrollmentSchema)
