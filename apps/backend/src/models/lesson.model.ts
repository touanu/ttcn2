import type { Lesson } from '@shared/interfaces'
import { model, Schema } from 'mongoose'

const LessonSchema = new Schema<Lesson>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  mediaIds: [{ type: Schema.Types.ObjectId, ref: 'Media' }],
  quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
  orderIndex: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

LessonSchema.index({ courseId: 1, orderIndex: 1 })

export const LessonModel = model<Lesson>('Lesson', LessonSchema)
