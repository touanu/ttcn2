import type { Course } from '@shared/types'
import type { ObjectId } from 'mongoose'
import type { ClassDB } from './class.interface'

export interface CourseDB extends Omit<Course, '_id' | 'classes' | 'teacher'> {
  _id?: ObjectId
  classes: ObjectId[] | ClassDB[]
}
