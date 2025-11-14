import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { config } from 'dotenv'
import { z } from 'zod'

/**
 * 1) Thứ tự load dotenv
 * - .env (chung)
 * - .env.{NODE_ENV}.local (ghi đè theo môi trường nếu biến đã tồn tại)
 * Đảm bảo không trùng lặp các biến giữa các file .env
 */
const configPath = resolve(__dirname, '../../config')
const envPath = resolve(configPath, '.env')
config({ path: envPath }) // .env
const nodeEnv = process.env.NODE_ENV || 'development'
const layerPath = resolve(configPath, `.env.${nodeEnv}`)
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

    SECRET_KEY: z.string().min(1),

    LOG_FORMAT: z.string().min(1).optional(), // Mặc định là 'dev' trong app.ts
    LOG_DIR: z.string().min(1),
    LOG_LEVEL: z.string().min(1),

    ORIGIN: z.string().min(1), // Có thể sắp xếp khi cần thiết
    CREDENTIALS: z.coerce.boolean(), // chuỗi 'true'/'false' → boolean
    CORS_ORIGINS: z.string().optional(), // "http://a.com,http://b.com"

    API_SERVER_URL: z.url().optional(),

    SENTRY_DSN: z.string().default(''),
    REDIS_URL: z.url().default('redis://localhost:6379'),

    DB_NAME: z.string().min(1).default('englearn'),
    DB_HOST: z.string().min(1).default('localhost'),
    DB_PORT: z.coerce.number().int().positive().default(27017),
    DB_USERNAME: z.string().optional(),
    DB_PASSWORD: z.string().optional(),
  })
  .strip()

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
export const SECRET_KEY = env.SECRET_KEY

export const LOG_FORMAT = env.LOG_FORMAT
export const LOG_DIR = env.LOG_DIR
export const LOG_LEVEL = env.LOG_LEVEL

export const ORIGIN = env.ORIGIN
export const CREDENTIALS = env.CREDENTIALS

export const SENTRY_DSN = env.SENTRY_DSN
export const REDIS_URL = env.REDIS_URL
export const API_SERVER_URL = env.API_SERVER_URL

export const DB_NAME = env.DB_NAME
export const DB_HOST = env.DB_HOST
export const DB_PORT = env.DB_PORT
export const DB_USERNAME = env.DB_USERNAME
export const DB_PASSWORD = env.DB_PASSWORD

// Trả về danh sách CORS Origins dưới dạng mảng ([] nếu không có)
export const CORS_ORIGIN_LIST
  = env.CORS_ORIGINS?.split(',')
    .map(s => s.trim())
    .filter(Boolean) ?? []
