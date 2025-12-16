import type { InternalTokenData, RequestWithUser } from '@shared/interfaces'
import type { NextFunction, Request, Response } from 'express'
import { HttpException } from '@exceptions/HttpException'
import { UserModel } from '@models/users.model'
import { INTERNAL_TOKEN_SECRET } from '@shared/config'
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
      return next(new HttpException(401, 'TOKEN_NOT_FOUND'))

    let payload: InternalTokenData
    try {
      payload = verify(token, INTERNAL_TOKEN_SECRET) as InternalTokenData
    }
    catch (err) {
      if (err instanceof TokenExpiredError) {
        return next(new HttpException(401, 'TOKEN_EXPIRED'))
      }
      if (err instanceof JsonWebTokenError) {
        return next(new HttpException(401, 'TOKEN_INVALID'))
      }
      return next(new HttpException(401, 'AUTHENTICATION_FAILED'))
    }

    if (payload.iss && payload.iss !== 'bff')
      return next(new HttpException(401, 'TOKEN_INVALID_ISSUER'))

    if (!payload.id)
      return next(new HttpException(401, 'TOKEN_INVALID'))

    const findUser = await UserModel.findById(String(payload.id)).lean().exec()
    if (!findUser)
      return next(new HttpException(401, 'USER_NOT_FOUND'))

    userReq.user = findUser
    next()
  }
  catch {
    next(new HttpException(500, 'INTERNAL_SERVER_ERROR'))
  }
}
