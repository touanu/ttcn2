import type { CourseDB } from '@interfaces/courses.interface'
import { model, Schema } from 'mongoose'

const CourseSchema = new Schema<CourseDB>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  classes: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const CourseModel = model<CourseDB>('Course', CourseSchema)
