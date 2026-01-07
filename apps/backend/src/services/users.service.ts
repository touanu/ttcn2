import type { Permission } from '@shared/constants'
import type { User } from '@shared/interfaces/users.interface'
import type { UserDB } from '@shared/types'
import { HttpException } from '@exceptions/HttpException'
import { UserModel } from '@models/users.model'
import { getRolePermissions } from '@shared/utils'
import { compare, hash } from 'bcryptjs'
import { injectable } from 'tsyringe'

@injectable()
export class UsersService {
  async comparePassword(currentPassword: string, password: string) {
    return await compare(currentPassword, password)
  }

  async getUserById(id: string): Promise<UserDB> {
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

  async getUserByEmail(email: string): Promise<UserDB> {
    const user = await UserModel.findOne({ email }).lean<UserDB>().exec()
    if (!user)
      throw new HttpException(404, 'AUTH.USER_NOT_FOUND')
    return user
  }

  async getAllUsers(): Promise<UserDB[]> {
    const users = await UserModel.find().lean<UserDB[]>().exec()
    return users
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
    const created: User = { ...user, password: hashedPassword }
    await UserModel.create({ ...created })

    const { password, ...safeUserData } = created
    return safeUserData as User
  }

  async updateUser(id: string, update: Partial<User>): Promise<UserDB> {
    if (typeof update.password === 'string' && update.password.length > 0) {
      update = { ...update, password: await hash(update.password, 10) }
    }

    const updated = await UserModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean()
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
    const user = await this.getUserById(id)
    const role = user.role || 'student'
    return getRolePermissions(role)
  }
}
