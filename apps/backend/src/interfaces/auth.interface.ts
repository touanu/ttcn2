import type { Permission } from '@shared/constants'
import type { Request } from 'express'
import type { UserDB } from './users.interface'

export interface RequestWithUser extends Request {
  user: UserDB
  permissions?: Permission[]
}
