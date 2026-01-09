import type { AccessTokenPayload } from '@shared/types'

declare module '#auth-utils' {
  interface User extends AccessTokenPayload {}

  interface UserSession {}

  interface SecureSessionData {
    accessToken: string
    refreshToken: string
    sessionId: string
  }
}

export {}
