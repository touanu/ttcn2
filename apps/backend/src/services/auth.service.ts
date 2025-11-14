import type { DataStoredInToken, TokenData } from '@shared/interfaces/auth.interface'
import type { User } from '@shared/interfaces/users.interface'
import { HttpException } from '@exceptions/HttpException'
import { UserModel } from '@models/users.model'
import { NODE_ENV, SECRET_KEY } from '@shared/config'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { injectable } from 'tsyringe'

@injectable()
export class AuthService {
  private createToken(user: User): TokenData {
    if (!SECRET_KEY)
      throw new Error('Không tìm thấy SECRET_KEY trong biến môi trường')

    if (user.id === undefined) {
      throw new Error('Không thể tạo token cho người dùng không có ID')
    }

    const dataStoredInToken: DataStoredInToken = { id: user.id }
    const expiresIn = 60 * 60 // 1h
    const token = sign(dataStoredInToken, SECRET_KEY as string, { expiresIn })
    return { expiresIn, token }
  }

  private createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/; SameSite=Lax;${NODE_ENV === 'production' ? ' Secure;' : ''}`
  }

  public async signup(userData: User): Promise<User> {
    const findUser = await UserModel.findOne({ email: userData.email }).lean<User>().exec()
    if (findUser)
      throw new HttpException(409, 'Email đã được sử dụng')

    const hashedPassword = await hash(userData.password, 10)
    const newUser: User = { id: String(Date.now()), email: userData.email, password: hashedPassword }

    await UserModel.create(newUser)
    return newUser
  }

  public async login(loginData: User): Promise<{ cookie: string, user: User }> {
    const findUser = await UserModel.findOne({ email: loginData.email }).lean<User>().exec()
    if (!findUser)
      throw new HttpException(401, 'Email hoặc mật khẩu không hợp lệ.')

    const isPasswordMatching = compare(loginData.password, findUser.password)
    if (!isPasswordMatching)
      throw new HttpException(401, 'Mật khẩu không chính xác')

    const tokenData = this.createToken(findUser)
    const cookie = this.createCookie(tokenData)

    return { cookie, user: findUser }
  }

  public async logout(user: User): Promise<void> {
    // Trong thực tế, thao tác đăng xuất có thể được thực hiện bằng cách
    // đưa session/refresh token vào danh sách đen (blacklist) trên server.
    // Ở đây, việc xóa cookie phía client là đủ.

    // eslint-disable-next-line no-console
    console.log(`User with email ${user.email} logged out.`)
  }
}
