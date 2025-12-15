import type { Routes } from '@interfaces/routes.interface'
import { ErrorMiddleware } from '@middlewares/error.middleware'
import { NotFoundMiddleware } from '@middlewares/notFound.middleware'
import { BE_PORT, CORS_ORIGIN_LIST, CREDENTIALS, LOG_FORMAT, MAILDEV_ENABLED, NODE_ENV } from '@shared/config'
import { dbConnection } from '@utils/database'
import { logger, stream } from '@utils/logger'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'

class App {
  public app: express.Application
  public env: string
  public port: string | number

  constructor(routes: Routes[], apiPrefix = '/api/v1') {
    this.app = express()
    this.env = NODE_ENV || 'development'
    this.port = BE_PORT || 3000

    dbConnection()
    this.initializeTrustProxy()
    this.initializeMiddlewares()
    this.initializeRoutes(routes, apiPrefix)
    this.initializeErrorHandling()

    if (MAILDEV_ENABLED) {
      this.initializeMaildev()
    }
  }

  public listen() {
    const server = this.app.listen(this.port, () => {
      logger.info(`=======================================`)
      logger.info(`======= MÔI TRƯỜNG: ${this.env} =======`)
      logger.info(`🚀 Ứng dụng đang lắng nghe cổng ${this.port}`)
      logger.info(`=======================================`)
    })

    return server
  }

  public getServer() {
    return this.app
  }

  private initializeTrustProxy() {
    // Cần thiết để lấy IP thực tế khi triển khai bằng Nginx, Heroku, Cloudflare
    this.app.set('trust proxy', 1)
  }

  private initializeMiddlewares() {
    this.app.use(
      rateLimit({
        windowMs: 60_000,
        limit: this.env === 'production' ? 20 : 1000,
        standardHeaders: true,
        legacyHeaders: false,
        skip: req => this.env !== 'production' || ['127.0.0.1', '::1', '::ffff:127.0.0.1']
          .includes(req.ip ?? ''),
      }),
    )

    this.app.use(morgan(LOG_FORMAT || 'dev', { stream }))

    // Quản lý danh sách trắng CORS bằng biến môi trường
    const allowedOrigins = CORS_ORIGIN_LIST.length > 0
      ? CORS_ORIGIN_LIST
      : ['http://localhost:3000']

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
          }
          else {
            callback(new Error('Không được phép bởi CORS'))
          }
        },
        credentials: CREDENTIALS,
      }),
    )

    this.app.use(hpp())
    this.app.use(
      helmet({
        contentSecurityPolicy:
          this.env === 'production'
            ? {
                directives: {
                  defaultSrc: ['\'self\''],
                  scriptSrc: ['\'self\'', '\'unsafe-inline\''],
                  objectSrc: ['\'none\''],
                  upgradeInsecureRequests: [],
                },
              }
            : false, // Tắt CSP trong môi trường phát triển
        referrerPolicy: { policy: 'no-referrer' },
      }),
    )
    this.app.use(compression())
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))
    this.app.use(cookieParser())
  }

  private initializeRoutes(routes: Routes[], apiPrefix: string) {
    routes.forEach((route) => {
      this.app.use(apiPrefix, route.router)
    })
  }

  private initializeErrorHandling() {
    this.app.use(NotFoundMiddleware)
    this.app.use(ErrorMiddleware)
  }

  private initializeMaildev() {
    // Chỉ khởi chạy MailDev trong môi trường phát triển
    import('maildev').then(({ default: MailDev }) => {
      const maildev = new MailDev({
        smtp: 1025,
        web: 1080,
        silent: this.env === 'production',
      })
      maildev.listen()
      logger.info('🚀 MailDev đang chạy tại http://localhost:1080')
    }).catch((error) => {
      logger.error('❌ Không thể khởi động MailDev:', error)
    })
  }
}

export default App
