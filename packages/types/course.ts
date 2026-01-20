import type { Class } from './class'

export interface Course {
  _id?: string
  title: string
  description: string
  thumbnail: string
  classes: string[] | Class[]
  createdAt: Date
  updatedAt: Date
}
