import type { Permission } from '@shared/constants'
import type { User } from '@shared/types'
import type { UserDB } from '@/interfaces'
import { HttpException } from '@exceptions/HttpException'
import { UserModel } from '@models/users.model'
import { getRolePermissions } from '@shared/utils'
import { convertUserToResponse } from '@utils/convertToResponse'
import { compare, hash } from 'bcryptjs'
import { injectable } from 'tsyringe'

@injectable()
export class UsersService {
  async comparePassword(currentPassword: string, hashedPassword: string): Promise<boolean> {
    return await compare(currentPassword, hashedPassword)
  }

  async getUserById(id: string): Promise<User> {
    const user = await UserModel.findById(id).lean<UserDB>().exec()
    if (!user)
      throw new HttpException(404, 'AUTH.USER_NOT_FOUND')
    return convertUserToResponse(user)
  }

  async getUserByIdInternal(id: string): Promise<UserDB> {
    const user = await UserModel.findById(id).lean<UserDB>().exec()
    if (!user)
      throw new HttpException(404, 'AUTH.USER_NOT_FOUND')
    return user
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await UserModel.findOne({ username }).lean<UserDB>().exec()
    if (!user)
      throw new HttpException(404, 'AUTH.USER_NOT_FOUND')
    return convertUserToResponse(user)
  }

  async findUserByUsernameInternal(username: string): Promise<UserDB> {
    const user = await UserModel.findOne({ username }).lean<UserDB>().exec()
    if (!user)
      throw new HttpException(404, 'AUTH.USER_NOT_FOUND')
    return user
  }

  async findUserByEmailInternal(email: string): Promise<UserDB> {
    const user = await UserModel.findOne({ email }).lean<UserDB>().exec()
    if (!user)
      throw new HttpException(404, 'AUTH.USER_NOT_FOUND')
    return user
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await UserModel.findOne({ email }).lean<UserDB>().exec()
    if (!user)
      throw new HttpException(404, 'AUTH.USER_NOT_FOUND')
    return convertUserToResponse(user)
  }

  async getAllUsers(options?: {
    sort?: string
    limit?: number
  }): Promise<User[]> {
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

    const users = await query.lean<UserDB[]>().exec()
    return users.map(convertUserToResponse)
  }

  async getUsersCount(): Promise<number> {
    return await UserModel.countDocuments().exec()
  }

  async createUser(user: User): Promise<User> {
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

    return convertUserToResponse(created.toObject())
  }

  async updateUser(id: string, update: Partial<User>): Promise<User> {
    if (typeof update.password === 'string' && update.password.length > 0) {
      update = { ...update, password: await hash(update.password, 10) }
    }

    const updated = await UserModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean<UserDB>()
      .exec()

    if (!updated)
      throw new HttpException(404, 'AUTH.USER_NOT_FOUND')

    return convertUserToResponse(updated)
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await UserModel.findByIdAndDelete(id)
    if (!deleted)
      throw new HttpException(404, 'AUTH.USER_NOT_FOUND')
  }

  async getUserPermissions(id: string): Promise<Permission[]> {
    const user = await this.getUserById(id)
    const role = user.role || 'student'
    return getRolePermissions(role)
  }
}
