import type { CourseCategoryDB } from '@interfaces/courseCategory.interface'
import { model, Schema } from 'mongoose'

const CourseCategorySchema = new Schema<CourseCategoryDB>(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    createdAt: { type: Date, required: true, default: Date.now },
  },
  {
    collection: 'courseCategories',
  },
)

export const CourseCategoryModel = model<CourseCategoryDB>('CourseCategory', CourseCategorySchema)
