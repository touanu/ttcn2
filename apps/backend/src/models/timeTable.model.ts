import type { TimeTableDB } from '@interfaces/class.interface'
import { DAY_OF_WEEK } from '@shared/constants'
import { model, Schema } from 'mongoose'

const timeTableSchema = new Schema<TimeTableDB>({
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  dayOfWeek: { type: Number, enum: Object.values(DAY_OF_WEEK), required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export const TimeTableModel = model<TimeTableDB>('TimeTable', timeTableSchema)
