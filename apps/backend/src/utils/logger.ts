import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { LOG_DIR, LOG_LEVEL, NODE_ENV } from '@shared/config'
import { backendDir } from '@shared/utils/currentDirectory'
import pino from 'pino'

// Thiết lập ghi log
const isProd = NODE_ENV === 'production'
const logRoot = LOG_DIR || 'logs'
const logLevel = LOG_LEVEL || 'info'

// Tạo thư mục để lưu log
const logDir = join(backendDir, logRoot)
if (!existsSync(logDir))
  mkdirSync(logDir, { recursive: true })

// Đường dẫn cho ghi log vào file
const prodFile = join(logDir, 'app')
const devFile = join(logDir, 'app.dev')
const errorFile = join(logDir, 'error')

// Cấu hình pino
const transport = pino.transport({
  targets: isProd
    ? [
        // prod: rolling theo ngày/dung lượng + lưu 30 ngày (toàn bộ log)
        {
          target: 'pino-roll',
          level: logLevel,
          options: {
            file: prodFile, // file cuối cùng: app.2025-08-29.log v.v
            frequency: 'daily', // 'daily' | 'hourly' | number(ms)
            size: '50m', // Chia file theo dung lượng
            dateFormat: 'yyyy-MM-dd',
            extension: '.log',
            mkdir: true,
            symlink: true, // Tạo symbolic link current.log
            limit: { count: 30 },
            // limit: { count: 30, removeOtherLogFiles: false }, // PM2/Chú ý nếu là cluster
          },
        },
        // prod: file chỉ ghi lỗi (chính sách lưu riêng, ví dụ 60 ngày)
        {
          target: 'pino-roll',
          level: 'error',
          options: {
            file: errorFile,
            frequency: 'daily',
            size: '50m',
            dateFormat: 'yyyy-MM-dd',
            extension: '.log',
            mkdir: true,
            symlink: true,
            limit: { count: 60 },
          },
        },
      ]
    : [
        // dev: đầu ra console đẹp
        {
          target: 'pino-pretty',
          level: logLevel,
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
        // dev: Nếu bạn muốn quay vòng file (tùy chọn)
        // bạn có thể xóa nếu không cần.
        {
          target: 'pino-roll',
          level: logLevel,
          options: {
            file: devFile,
            frequency: 'daily',
            size: '20m',
            dateFormat: 'yyyy-MM-dd',
            extension: '.log',
            mkdir: true,
            symlink: true,
            limit: { count: 7 },
          },
        },
      ],
})

export const logger = pino(
  {
    level: logLevel,
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: ['req.headers.authorization', 'password', 'token'],
      censor: '[REDACTED]',
    },
  },
  transport,
)

export const stream = { write: (msg: string) => logger.info(msg.trim()) }
