export interface ResponseBody {
  success: boolean
  data?: unknown
  message?: string
  error?: unknown
}

export interface ErrorDetails {
  code: number
  message: string
  data?: unknown
  stack?: string
}

export interface ErrorResponseBody extends ResponseBody {
  success: false
  error: ErrorDetails
}

export interface SuccessResponseBody<T> extends ResponseBody {
  success: true
  data?: T
}
