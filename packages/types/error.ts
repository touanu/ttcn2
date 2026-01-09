export interface ResponseBody<T = unknown> {
  success: boolean
  message?: string
  data?: T
}

export interface ErrorDetails {
  field?: string
  message: string
}

export interface ErrorResponseBody extends ResponseBody {
  success: false
  error: {
    code: number
    message: string
    details?: ErrorDetails[]
    data?: unknown
    stack?: string
  }
}

export type SuccessResponseBody<T> = T extends undefined | void
  ? ResponseBody<T> & {
    success: true
    data?: T
  }
  : ResponseBody<T> & {
    success: true
    data: T
  }
