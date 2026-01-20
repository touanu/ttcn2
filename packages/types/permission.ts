import type { PERMISSIONS } from '@shared/constants'

// Kiểu Permission từ cấu trúc nested
type PermissionValues<T> = T extends Record<string, infer U>
  ? U extends string
    ? U
    : U extends Record<string, infer V>
      ? V
      : never
  : never

export type Permission = PermissionValues<typeof PERMISSIONS>
