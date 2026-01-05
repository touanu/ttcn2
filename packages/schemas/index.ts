import { config } from 'zod'

// Tùy chỉnh thông điệp lỗi của Zod
config({
  customError: (issue) => {
    if (issue.code === 'invalid_type') {
      return `INVALID_TYPE`
    }
  },
})

export * from './auth'
export * from './otp'
export * from './user'
