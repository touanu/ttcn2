import type { User } from '@shared/interfaces'
import type { Request, RequestHandler, Response } from 'express'
import { UsersService } from '@services/users.service'
import { asyncHandler } from '@utils/asyncHandler'
import { inject, injectable } from 'tsyringe'

@injectable()
export class UsersController {
  constructor(@inject(UsersService) private readonly userService: UsersService) {}

  getUsers: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.userService.getAllUsers()

    res.json({ data: users, message: 'Lấy danh sách người dùng thành công' })
  })

  getUserById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id
    const user = await this.userService.getUserById(userId)

    res.json({ data: user, message: 'Lấy thông tin người dùng thành công' })
  })

  createUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userData: User = req.body
    const user = await this.userService.createUser(userData)

    res.status(201).json({ data: user, message: 'Tạo người dùng thành công' })
  })

  updateUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id
    const userData: User = req.body
    const user = await this.userService.updateUser(userId, userData)

    res.json({ data: user, message: 'Cập nhật người dùng thành công' })
  })

  deleteUser: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userId: string = req.params.id
    await this.userService.deleteUser(userId)

    res.status(204).json({ message: 'Xóa người dùng thành công' })
  })
}
