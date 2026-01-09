export interface Progress {
  _id?: string
  userId: string
  courseId: string
  completedLessonIds: string[]
  percentage: number
  updatedAt: Date
}
