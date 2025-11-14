import type { Request } from 'express'
import type { User } from './users.interface'

export interface DataStoredInToken {
  id: number | string
}

export interface TokenData {
  token: string
  expiresIn: number
}

export interface RequestWithUser extends Request {
  user: User
}
