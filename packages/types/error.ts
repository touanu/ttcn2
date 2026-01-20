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

export interface SuccessResponseBody<T> extends ResponseBody<T> {
  success: true
  data?: T
}
