import type { Permission } from '@shared/types'
import type { UserRole } from './user'

export interface AccessTokenPayload {
  id: string
  role: UserRole
  name?: string
  permissions?: Permission[]
}

export interface TokenPayload {
  iss?: string
  sub?: string
  aud?: string
  iat?: number
  exp?: number
  nbf?: number
  jti?: string
}

export interface Token {
  token: string
  expiresIn: number
}

export interface TokenWithOTP extends Token {
  otp: string
}

export interface ClientInfo {
  ipAddress?: string
  userAgent?: string
  deviceInfo?: string
}

export interface LoginCredential {
  username: string
  password: string
  rememberMe?: boolean
  info?: ClientInfo
}

export interface RefreshTokenData {
  refreshToken: Token
  accessToken: Token
  sessionId: string
}

export interface LoginData extends RefreshTokenData {
  user: AccessTokenPayload
}

export interface RegisterData {
  username: string
  email: string
  password: string
  fullName: string
}

export interface RefreshTokenPayload {
  userId: string
}

export interface ChangePasswordData {
  oldPassword: string
  newPassword: string
}
