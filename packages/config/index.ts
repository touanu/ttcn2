import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { configDir } from '@shared/utils/currentDirectory'
import { config } from 'dotenv'
import { z } from 'zod'

/**
 * 1) Thứ tự load dotenv
 * - .env (chung)
 * - .env.{NODE_ENV}.local (ghi đè theo môi trường nếu biến đã tồn tại)
 * Đảm bảo không trùng lặp các biến giữa các file .env
 */
const envPath = resolve(configDir, '.env')
config({ path: envPath }) // .env
const nodeEnv = process.env.NODE_ENV || 'development'
const layerPath = resolve(configDir, `.env.${nodeEnv}`)
if (existsSync(layerPath)) {
  config({ path: layerPath })
}

/**
 * 2) Định nghĩa schema Zod
 */
const EnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    BE_PORT: z.coerce.number().int().positive().optional(), // Mặc định được xử lý là 3000 trong app.ts
    FE_PORT: z.coerce.number().int().positive().optional(),

    ACCESS_TOKEN_SECRET: z.string().min(1),
    INTERNAL_TOKEN_SECRET: z.string().min(1),

    LOG_FORMAT: z.string().min(1).optional(), // Mặc định là 'dev' trong app.ts
    LOG_DIR: z.string().min(1),
    LOG_LEVEL: z.string().min(1),

    ORIGIN: z.string().min(1), // Có thể sắp xếp khi cần thiết
    CREDENTIALS: z.coerce.boolean(), // chuỗi 'true'/'false' → boolean
    CORS_ORIGINS: z.string().optional(), // "http://a.com,http://b.com"

    BE_URL: z.url().optional(),
    FE_URL: z.url().optional(),

    DB_NAME: z.string().min(1).default('englearn'),
    DB_HOST: z.string().min(1).default('localhost'),
    DB_PORT: z.coerce.number().int().positive().default(27017),
    DB_USERNAME: z.string().optional(),
    DB_PASSWORD: z.string().optional(),

    MAILDEV_ENABLED: z.coerce.boolean().optional().default(false),
    MAILER_HOST: z.string().min(1).optional(),
    MAILER_PORT: z.coerce.number().int().positive().optional(),
    MAILER_USER: z.string().min(1).optional(),
    MAILER_PASSWORD: z.string().min(1).optional(),
  })
  .strip()
  .superRefine((data, ctx) => {
    // Trong môi trường production, các field mailer là bắt buộc
    if (data.NODE_ENV === 'production') {
      if (!data.MAILER_HOST) {
        ctx.addIssue({
          code: 'custom',
          path: ['MAILER_HOST'],
          message: 'CONFIG.MAILER_HOST_REQUIRED',
        })
      }
      if (!data.MAILER_PORT) {
        ctx.addIssue({
          code: 'custom',
          path: ['MAILER_PORT'],
          message: 'CONFIG.MAILER_PORT_REQUIRED',
        })
      }
      if (!data.MAILER_USER) {
        ctx.addIssue({
          code: 'custom',
          path: ['MAILER_USER'],
          message: 'CONFIG.MAILER_USER_REQUIRED',
        })
      }
      if (!data.MAILER_PASSWORD) {
        ctx.addIssue({
          code: 'custom',
          path: ['MAILER_PASSWORD'],
          message: 'CONFIG.MAILER_PASSWORD_REQUIRED',
        })
      }
    }
  })

/**
 * 3) Kiểm tra (thực thi khi module được import)
 */
const parsed = EnvSchema.safeParse(process.env)
if (!parsed.success) {
  console.error('\n❌ Invalid environment variables:\n')
  console.error(z.treeifyError(parsed.error))
  process.exit(1)
}
const env = parsed.data

/**
 * 4) Xuất các hằng có kiểu an toàn
 * - Không sử dụng process.env trực tiếp ở các file khác, chỉ lấy giá trị từ đây.
 */
export const NODE_ENV = env.NODE_ENV
export const BE_PORT = env.BE_PORT
export const FE_PORT = env.FE_PORT

export const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET
export const INTERNAL_TOKEN_SECRET = env.INTERNAL_TOKEN_SECRET

export const LOG_FORMAT = env.LOG_FORMAT
export const LOG_DIR = env.LOG_DIR
export const LOG_LEVEL = env.LOG_LEVEL

export const ORIGIN = env.ORIGIN
export const CREDENTIALS = env.CREDENTIALS

export const BE_URL = env.BE_URL || `http://localhost:${env.BE_PORT || 3000}`
export const FE_URL = env.FE_URL || `http://localhost:${env.FE_PORT || 3333}`

export const DB_NAME = env.DB_NAME
export const DB_HOST = env.DB_HOST
export const DB_PORT = env.DB_PORT
export const DB_USERNAME = env.DB_USERNAME
export const DB_PASSWORD = env.DB_PASSWORD

export const MAILDEV_ENABLED = env.MAILDEV_ENABLED
export const MAILER_HOST = env.MAILER_HOST
export const MAILER_PORT = env.MAILER_PORT
export const MAILER_USER = env.MAILER_USER
export const MAILER_PASSWORD = env.MAILER_PASSWORD

/**
 * 5) Xử lý đặc biệt khác
 */
// Trả về danh sách CORS Origins dưới dạng mảng ([] nếu không có)
export const CORS_ORIGIN_LIST
  = env.CORS_ORIGINS?.split(',')
    .map(s => s.trim())
    .filter(Boolean) ?? []
