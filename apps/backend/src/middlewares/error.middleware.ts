import type { NextFunction, Request, Response } from 'express'
import type { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import type { ZodIssue } from 'zod'
import { HttpException } from '@exceptions/HttpException'
import { NODE_ENV } from '@shared/config'
import { logger } from '@utils/logger'
import { ZodError } from 'zod'

interface ValidationIssue { path: string, message: string }
type HttpExceptionWithData = HttpException & { data?: unknown }
interface WithStack { stack?: string }

interface ErrorDetails {
  code: number
  message: string
  data?: unknown
  stack?: string
}
interface ErrorResponseBody {
  success: false
  error: ErrorDetails
}

/** hàm guard cho kiểu */
function isZodError(e: unknown): e is ZodError {
  return e instanceof ZodError
}

/**
 * Thư viện jsonwebtoken có thể gặp vấn đề biên giới lớp phụ thuộc vào runtime,
 * nên dùng guard dựa trên tên class.
 */
function isTokenExpiredError(e: unknown): e is TokenExpiredError {
  return e instanceof Error && (e as any).name === 'TokenExpiredError'
}
function isJsonWebTokenError(e: unknown): e is JsonWebTokenError {
  return e instanceof Error && (e as any).name === 'JsonWebTokenError'
}

function toHttpException(err: unknown): HttpException {
  if (err instanceof HttpException)
    return err

  if (isZodError(err)) {
    const data: ValidationIssue[] = err.issues.map((i: ZodIssue) => ({
      path: i.path.join('.'),
      message: i.message,
    }))
    return new HttpException(400, 'Validation failed', data)
  }

  if (isTokenExpiredError(err))
    return new HttpException(401, 'Token expired')
  if (isJsonWebTokenError(err))
    return new HttpException(401, 'Invalid token')

  const e = err as Error | undefined
  return new HttpException(500, e?.message || 'Internal Server Error')
}

function extractStack(err: unknown): string | undefined {
  if (err && typeof err === 'object' && 'stack' in err) {
    const s = (err as WithStack).stack
    return typeof s === 'string' ? s : undefined
  }
  return undefined
}

export function ErrorMiddleware(error: unknown, req: Request, res: Response, _next: NextFunction) {
  const httpErr = toHttpException(error)
  const status = httpErr.status || 500
  const message = httpErr.message || 'Something went wrong'

  if (res.headersSent)
    return _next(httpErr)

  const stack = extractStack(httpErr)
  logger.error(`[${req.method}] ${req.originalUrl} | ${status} | ${message}${stack ? `\n${stack}` : ''}`)

  const body: ErrorResponseBody = {
    success: false,
    error: { code: status, message },
  }

  const maybeData = (httpErr as HttpExceptionWithData).data
  if (typeof maybeData !== 'undefined')
    body.error.data = maybeData
  if (NODE_ENV === 'development' && stack)
    body.error.stack = stack

  res.status(status).json(body)
}
