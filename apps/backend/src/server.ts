/* eslint-disable perfectionist/sort-imports */
/* eslint-disable no-console */

import 'reflect-metadata'
import process from 'node:process'
import { AuthRoute } from '@routes/auth.route'
import { UsersRoute } from '@routes/users.route'
import { container } from 'tsyringe'
import { z } from 'zod'
import App from '@/app'
import '@shared/config'

// Định nghĩa các routes
const routes
  = [
    container.resolve(UsersRoute),
    container.resolve(AuthRoute),
  ]

// Tùy chỉnh thông điệp lỗi của Zod
z.config({
  customError: (issue) => {
    if (issue.code === 'invalid_type') {
      return `INVALID_TYPE: Expected ${issue.expected}, received ${issue.received} in ${issue.path?.join('.')}`
    }
  },
})

// Tạo instance của ứng dụng
const appInstance = new App(routes)

// Khởi động server
const server = appInstance.listen()

// Đóng ứng dụng một cách an toàn
if (server && typeof server.close === 'function') {
  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
      console.log(`Received ${signal}, closing server...`)
      server.close(() => {
        console.log('HTTP server closed gracefully')
        process.exit(0)
      })
    })
  })
}

export default server
