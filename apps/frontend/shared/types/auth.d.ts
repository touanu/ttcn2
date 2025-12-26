import type { AccessTokenPayload } from '@shared/interfaces'

// shared/types/auth.d.ts
declare module '#auth-utils' {
  interface User extends AccessTokenPayload {

  }

  interface UserSession {

  }

  interface SecureSessionData {
    accessToken: string
    refreshToken: string
    sessionId: string
  }
}

export {}
