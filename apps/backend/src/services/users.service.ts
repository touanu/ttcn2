import type { UserDB } from '@interfaces/users.interface'
import type { Permission, User } from '@shared/types'
import type { QueryFilter } from 'mongoose'
import { HttpException } from '@exceptions/HttpException'
import { UserModel } from '@models/users.model'
import { getRolePermissions } from '@shared/utils'
import { compare, hash } from 'bcryptjs'
import { injectable } from 'tsyringe'

@injectable()
export class UsersService {
  async comparePassword(currentPassword: string, hashedPassword: string): Promise<boolean> {
    return await compare(currentPassword, hashedPassword)
  }

  async findUserById(id: string): Promise<UserDB> {
    const user = await UserModel.findById(id).lean<UserDB>().exec()
    if (!user)
      throw new HttpException(404, 'AUTH.USER_NOT_FOUND')
    return user
  }

  async findUserByUsername(username: string): Promise<UserDB> {
    const user = await UserModel.findOne({ username }).lean<UserDB>().exec()
    if (!user)
      throw new HttpException(404, 'AUTH.USER_NOT_FOUND')
    return user
  }

  async findUserByEmail(email: string): Promise<UserDB> {
    const user = await UserModel.findOne({ email }).lean<UserDB>().exec()
    if (!user)
      throw new HttpException(404, 'AUTH.USER_NOT_FOUND')
    return user
  }

  async findUsers(filter: QueryFilter<UserDB>): Promise<UserDB[]> {
    return await UserModel.find(filter).lean<UserDB[]>().exec()
  }

  async findOne(filter: QueryFilter<UserDB>): Promise<UserDB> {
    const user = await UserModel.findOne(filter).lean<UserDB>().exec()
    if (!user)
      throw new HttpException(404, 'AUTH.USER_NOT_FOUND')
    return user
  }

  async findAllUsers(options?: {
    sort?: string
    limit?: number
  }): Promise<UserDB[]> {
    const query = UserModel.find()

    // Apply sorting
    if (options?.sort) {
      // Format: 'field:order' e.g., 'createdAt:desc' or '-createdAt'
      const sortField = options.sort.startsWith('-')
        ? { [options.sort.substring(1)]: -1 as const }
        : options.sort.includes(':')
          ? { [options.sort.split(':')[0]]: options.sort.split(':')[1] === 'desc' ? -1 as const : 1 as const }
          : { [options.sort]: 1 as const }
      query.sort(sortField)
    }

    // Apply limit
    if (options?.limit && options.limit > 0) {
      query.limit(options.limit)
    }

    return await query.lean<UserDB[]>().exec()
  }

  async getUsersCount(): Promise<number> {
    return await UserModel.countDocuments().exec()
  }

  async createUser(user: User): Promise<UserDB> {
    const exists = await UserModel.exists({
      $or: [
        { email: user.email },
        { username: user.username },
      ],
    }).lean().exec()

    if (exists)
      throw new HttpException(409, 'AUTH.REGISTER.USER_EXISTS')

    const hashedPassword = await hash(user.password, 10)
    const { _id, ...userWithoutId } = user
    const created = await UserModel.create({ ...userWithoutId, password: hashedPassword })

    return created.toObject()
  }

  async updateUser(id: string, update: Partial<User>): Promise<UserDB> {
    if (typeof update.password === 'string' && update.password.length > 0) {
      update = { ...update, password: await hash(update.password, 10) }
    }

    const updated = await UserModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean<UserDB>()
      .exec()

    if (!updated)
      throw new HttpException(404, 'AUTH.USER_NOT_FOUND')

    return updated
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await UserModel.findByIdAndDelete(id)
    if (!deleted)
      throw new HttpException(404, 'AUTH.USER_NOT_FOUND')
  }

  async getUserPermissions(id: string): Promise<Permission[]> {
    const user = await this.findUserById(id)
    const role = user.role || 'student'
    return getRolePermissions(role)
  }
}
