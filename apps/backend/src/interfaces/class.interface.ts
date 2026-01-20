import type { Class, TimeTable } from '@shared/types'
import type { ObjectId } from 'mongoose'

export interface ClassDB extends Omit<Class, '_id' | 'teacherId' | 'studentIds' | 'courseId'> {
  _id?: ObjectId
  courseId: ObjectId
  teacherId: ObjectId
  studentIds: ObjectId[]
}

export interface TimeTableDB extends Omit<TimeTable, '_id' | 'classId'> {
  _id?: ObjectId
  classId: ObjectId
}
