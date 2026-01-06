import type { Course } from '@shared/interfaces/courses.interface'
import { COURSE_LEVELS } from '@shared/types'
import { model, Schema } from 'mongoose'

const CourseSchema = new Schema<Course>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  level: {
    type: String,
    enum: COURSE_LEVELS,
    required: true,
  },
  lessonIds: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const CourseModel = model<Course>('Course', CourseSchema)
