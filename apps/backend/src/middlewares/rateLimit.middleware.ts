import { NODE_ENV } from '@shared/config'
import { RATE_LIMIT_WINDOW_MS } from '@shared/constants'
import rateLimit from 'express-rate-limit'

export function rateLimitMiddleware(
  limit = 100,
  skipSuccessfulRequests = false,
) {
  return rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    max: limit,
    standardHeaders: true, // Gửi thông tin giới hạn tốc độ trong header `RateLimit-*`
    legacyHeaders: false, // Tắt header `X-RateLimit-*`
    message: 'RATE_LIMIT_REACHED',
    skipSuccessfulRequests,
    skip: req => NODE_ENV !== 'production' || ['127.0.0.1', '::1', '::ffff:127.0.0.1']
      .includes(req.ip ?? ''),
  })
}
