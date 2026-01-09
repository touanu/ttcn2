export interface Lesson {
  _id?: string
  courseId: string
  title: string
  content: string
  mediaIds: string[]
  quizId?: string
  orderIndex: number
  createdAt: Date
  updatedAt: Date
}
