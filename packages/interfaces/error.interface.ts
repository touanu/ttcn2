export interface ErrorDetails {
  code: number
  message: string
  data?: unknown
  stack?: string
}

export interface ErrorResponseBody {
  success: false
  error: ErrorDetails
}
