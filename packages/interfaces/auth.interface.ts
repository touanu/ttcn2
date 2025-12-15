import type { Request } from 'express'
import type { User } from './users.interface'

export interface AccessTokenData {
  id: string
  role?: string
}

export interface InternalTokenData {
  id: string
  role?: string
  scopes: string[]
  iss?: string
  iat?: number
  exp?: number
}

export interface Token {
  token: string
  expiresIn: number
}

export interface TokenWithOTP extends Token {
  otp: string
}

export interface RequestWithUser extends Request {
  user: User
}

export interface ClientInfo {
  ipAddress?: string
  userAgent?: string
  deviceInfo?: string
}

export interface LoginCredential {
  username: string
  password: string
  info?: ClientInfo
}

export interface LoginResponse {
  refreshToken: Token
  accessToken: Token
  sessionId: string
}
