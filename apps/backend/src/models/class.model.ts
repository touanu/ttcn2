import type { ClassDB } from '@interfaces/class.interface'
import { model, Schema } from 'mongoose'

const ClassSchema = new Schema<ClassDB>({
  name: { type: String, required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User' },
  studentIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  room: { type: String },
  description: { type: String },
  maxStudents: { type: Number, default: 30 },
  status: { type: String, enum: ['PENDING', 'ACTIVE', 'COMPLETED'], default: 'PENDING' },
  startDate: { type: Date },
  endDate: { type: Date },
  openedAt: { type: Date },
  endedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const ClassModel = model<ClassDB>('Class', ClassSchema)
