import type { RequestHandler } from 'express'
import { HttpException } from '@exceptions/HttpException'

export const NotFoundMiddleware: RequestHandler = (_req, _res, next) => {
  next(new HttpException(404, 'Không tìm thấy'))
}
