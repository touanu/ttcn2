import type { User } from '@shared/interfaces/users.interface'
import type { ObjectId } from 'mongoose'
import { HttpException } from '@exceptions/HttpException'
import { UserModel } from '@models/users.model'
import { hash } from 'bcryptjs'
import { injectable } from 'tsyringe'

@injectable()
export class UsersService {
  async getUserById(id: string): Promise<User> {
    const user = await UserModel.findById(id).lean<User>().exec()
    if (!user)
      throw new HttpException(404, 'USER_NOT_FOUND')
    return user
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await UserModel.findOne({ email }).lean<User>().exec()
    if (!user)
      throw new HttpException(404, 'USER_NOT_FOUND')
    return user
  }

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find().lean<User[]>().exec()
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
      throw new HttpException(409, 'USER_EMAIL_OR_USERNAME_EXISTED')

    const hashedPassword = await hash(user.password, 10)
    const created: User = { ...user, password: hashedPassword }
    await UserModel.create({ ...created })
    return created
  }

  async updateUserPassword(id: ObjectId, newPassword: string): Promise<void> {
    const hashedPassword = await hash(newPassword, 10)
    const updated = await UserModel
      .findByIdAndUpdate(id, { password: hashedPassword })
      .lean()
      .exec()

    if (!updated)
      throw new HttpException(404, 'USER_NOT_FOUND')
  }

  async updateUser(id: string, update: Partial<User>): Promise<User> {
    if (typeof update.password === 'string' && update.password.length > 0) {
      update = { ...update, password: await hash(update.password, 10) }
    }

    const updated = await UserModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean()
      .exec()

    if (!updated)
      throw new HttpException(404, 'USER_NOT_FOUND')

    return updated as User
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await UserModel.findByIdAndDelete(id)
    if (!deleted)
      throw new HttpException(404, 'USER_NOT_FOUND')
  }
}
