import type { PopulateOptions } from 'mongoose'

export interface GetAllQuery {
  search?: string
  status?: string
  page?: number
  limit?: number
  sort?: string
  populate?: PopulateOptions[]
}
