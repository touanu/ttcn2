import type { DataStoredInToken, RequestWithUser, User } from '@shared/interfaces'
import type { NextFunction, Request, Response } from 'express'
import { HttpException } from '@exceptions/HttpException'
import { UserModel } from '@models/users.model'
import { SECRET_KEY } from '@shared/config'
import { JsonWebTokenError, TokenExpiredError, verify } from 'jsonwebtoken'

/**
 * Lấy token xác thực từ cookie hoặc header:
 * - Ưu tiên cookie `Authorization`
 * - Nếu không có, lấy header `Authorization: Bearer <token>`
 */
function getAuthorization(req: RequestWithUser) {
  const cookie = req.cookies.Authorization
  if (cookie)
    return cookie

  const header = req.header('Authorization')
  if (header && header.startsWith('Bearer ')) {
    return header.replace('Bearer ', '').trim()
  }
  return null
}

/**
 * Middleware xác thực người dùng.
 * - Kiểm tra token có tồn tại hay không
 * - Giải mã token và kiểm tra lỗi (hết hạn / không hợp lệ)
 * - Tìm người dùng tương ứng và gắn vào `req.user`
 */
export async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const userReq = req as RequestWithUser
    const token = getAuthorization(userReq)
    if (!token)
      return next(new HttpException(401, 'Thiếu token xác thực'))

    let payload: DataStoredInToken
    try {
      payload = verify(token, SECRET_KEY as string) as DataStoredInToken
    }
    catch (err) {
      if (err instanceof TokenExpiredError) {
        return next(new HttpException(401, 'Token xác thực đã hết hạn'))
      }
      if (err instanceof JsonWebTokenError) {
        return next(new HttpException(401, 'Token xác thực không hợp lệ'))
      }
      return next(new HttpException(401, 'Xác thực thất bại'))
    }

    const findUser = await UserModel.findById(String(payload.id)).lean<User>().exec()
    if (!findUser)
      return next(new HttpException(401, 'Không tìm thấy người dùng tương ứng với token này'))

    userReq.user = findUser
    next()
  }
  catch {
    next(new HttpException(500, 'Lỗi middleware xác thực'))
  }
}
