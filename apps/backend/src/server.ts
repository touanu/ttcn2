/* eslint-disable perfectionist/sort-imports */
/* eslint-disable no-console */

import 'reflect-metadata'
import process from 'node:process'
import { AttemptsRoute } from '@routes/attempts.route'
import { AuthRoute } from '@routes/auth.route'
import { ClassRoute } from '@routes/class.route'
import { CourseCategoryRoute } from '@routes/courseCategory.route'
import { CoursesRoute } from '@routes/courses.route'
import { EnrollmentRoute } from '@routes/enrollment.route'
import { LessonsRoute } from '@routes/lessons.route'
import { MediaRoute } from '@routes/media.route'
import { ProgressRoute } from '@routes/progress.route'
import { QuizzesRoute } from '@routes/quizzes.route'
import { UsersRoute } from '@routes/users.route'
import { container } from 'tsyringe'
import App from '@/app'
import '@shared/config'

// Định nghĩa các routes
const routes = [
  container.resolve(UsersRoute),
  container.resolve(AuthRoute),
  container.resolve(CoursesRoute),
  container.resolve(CourseCategoryRoute),
  container.resolve(LessonsRoute),
  container.resolve(QuizzesRoute),
  container.resolve(AttemptsRoute),
  container.resolve(ProgressRoute),
  container.resolve(MediaRoute),
  container.resolve(ClassRoute),
  container.resolve(EnrollmentRoute),
]

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
