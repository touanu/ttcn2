import type { AccessTokenData } from '@shared/interfaces'

// shared/types/auth.d.ts
declare module '#auth-utils' {
  interface User extends AccessTokenData {

  }

  interface UserSession {

  }

  interface SecureSessionData {

  }
}

export {}
