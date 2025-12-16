import type { User } from '@shared/interfaces/users.interface'
import { HttpException } from '@exceptions/HttpException'
import { UserModel } from '@models/users.model'
import { hash } from 'bcryptjs'
import { injectable } from 'tsyringe'

@injectable()
export class UsersService {
  async getUserById(id: string): Promise<User> {
    const user = await UserModel.findById(id).lean<User>().exec()
    if (!user)
      throw new HttpException(404, 'Không tìm thấy người dùng')
    return user
  }

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find().lean<User[]>().exec()
    return users
  }

  async createUser(user: User): Promise<User> {
    const exists = await UserModel.findOne({ email: user.email }).lean().exec()
    if (exists)
      throw new HttpException(409, 'Email đã tồn tại')

    const hashedPassword = await hash(user.password, 10)
    const created: User = { ...user, password: hashedPassword }
    await UserModel.create({ ...created })
    return created
  }

  async updateUser(id: string, update: User): Promise<User> {
    // Hash password if provided
    if (typeof update.password === 'string' && update.password.length > 0) {
      update = { ...update, password: await hash(update.password, 10) }
    }

    // Use findByIdAndUpdate atomically to prevent race conditions
    const updated = await UserModel
      .findByIdAndUpdate(id, update, { new: true })
      .lean()
      .exec()

    if (!updated)
      throw new HttpException(404, 'Không tìm thấy người dùng')
    return updated as User
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await UserModel.findByIdAndDelete(id)
    if (!deleted)
      throw new HttpException(404, 'Không tìm thấy người dùng')
  }
}
