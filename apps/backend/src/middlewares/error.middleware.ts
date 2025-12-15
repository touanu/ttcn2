import type { ErrorResponseBody } from '@shared/interfaces/error.interface'
import type { NextFunction, Request, Response } from 'express'
import type { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import { HttpException } from '@exceptions/HttpException'
import { NODE_ENV } from '@shared/config'
import { logger } from '@utils/logger'
import { ZodError } from 'zod'

interface ValidationIssue { path: string, message: string }
type HttpExceptionWithData = HttpException & { data?: unknown }
interface WithStack { stack?: string }

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
    const data: ValidationIssue[] = err.issues.map(i => ({
      path: i.path.join('.'),
      message: i.message,
    }))
    return new HttpException(400, 'VALIDATION_FAILED', data)
  }

  if (isTokenExpiredError(err))
    return new HttpException(401, 'TOKEN_EXPIRED')
  if (isJsonWebTokenError(err))
    return new HttpException(401, 'INVALID_TOKEN')

  const e = err as Error | undefined
  return new HttpException(500, e?.message || 'INTERNAL_SERVER_ERROR')
}

function extractStack(err: unknown): string | undefined {
  if (err && typeof err === 'object' && 'stack' in err) {
    const s = (err as WithStack).stack
    return typeof s === 'string' ? s : undefined
  }
  return undefined
}

function formatResponseMessage(message: string): string {
  // Chỉ giữ phần mã lỗi, bỏ phần mô tả chi tiết
  // Ví dụ: "INVALID_INPUT: expected string, received undefined, PHONE_NUMBER_INVALID_FORMAT"
  // thành "INVALID_INPUT,PHONE_NUMBER_INVALID_FORMAT"

  const messageCodeRegex = /[A-Z0-9_]{3,}/g
  return message.match(messageCodeRegex)?.join(',') || message
}

export function ErrorMiddleware(error: unknown, req: Request, res: Response, _next: NextFunction) {
  const httpErr = toHttpException(error)
  const status = httpErr.status || 500
  const message = httpErr.message || 'INTERNAL_SERVER_ERROR'

  if (res.headersSent)
    return _next(httpErr)

  const stack = extractStack(httpErr)
  logger.error(`[${req.method}] ${req.originalUrl} | ${status} | ${message}${stack ? `\n${stack}` : ''}`)

  const body: ErrorResponseBody = {
    success: false,
    error: {
      code: status,
      message: formatResponseMessage(message),
    },
  }

  const maybeData = (httpErr as HttpExceptionWithData).data
  if (typeof maybeData !== 'undefined')
    body.error.data = maybeData
  if (NODE_ENV === 'development' && stack)
    body.error.stack = stack

  res.status(status).json(body)
}
