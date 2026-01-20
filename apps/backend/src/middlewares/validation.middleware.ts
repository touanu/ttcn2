import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'
import { HttpException } from '@exceptions/HttpException'

export function ValidationMiddleware(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const message = result.error.issues.map(e => e.message).join(', ')
      return next(new HttpException(400, message))
    }
    req.body = result.data
    next()
  }
}

export function QueryValidationMiddleware(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      const message = result.error.issues.map(e => e.message).join(', ')
      return next(new HttpException(400, message))
    }

    req.query = {
      ...result.data as object,
    }
    next()
  }
}
