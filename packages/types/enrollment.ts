export const ENROLLMENT_STATUSES = ['in-progress', 'completed', 'dropped'] as const
export const PAYMENT_METHODS = ['credit-card', 'paypal', 'free'] as const

export type EnrollmentStatus = typeof ENROLLMENT_STATUSES[number]
export type PaymentMethod = typeof PAYMENT_METHODS[number]

export interface Enrollment {
  _id?: string
  userId: string
  courseId: string
  status: EnrollmentStatus
  price: number
  paidPrice: number
  paidMethod: PaymentMethod
  enrolledAt: Date
  progressPercentage: number
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}
