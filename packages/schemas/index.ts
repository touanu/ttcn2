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
export * from './class'
export * from './course'
export * from './media'
export * from './otp'
export * from './timeTable'
export * from './user'
