export const otpTypes = [
  'EMAIL_VERIFICATION',
  'PASSWORD_RESET',
] as const

export type OTPType = typeof otpTypes[number]
