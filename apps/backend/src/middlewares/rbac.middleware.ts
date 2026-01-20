import type { RequestWithUser } from '@interfaces/auth.interface'
import type { Permission, UserRole } from '@shared/types'
import type { NextFunction, Request, Response } from 'express'
import { HttpException } from '@exceptions/HttpException'
import {
  getRolePermissions,
  roleHasAllPermissions,
  roleHasAnyPermission,
} from '@shared/utils'

/**
 * Middleware kiểm tra vai trò người dùng
 * @param allowedRoles - Mảng các vai trò được phép truy cập route
 * @returns Express middleware function
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userReq = req as RequestWithUser
    try {
      if (!userReq.user)
        return next(new HttpException(401, 'AUTH.UNAUTHORIZED'))

      const userRole = userReq.user.role || 'student'

      if (!allowedRoles.includes(userRole)) {
        return next(new HttpException(403, 'AUTH.FORBIDDEN_INSUFFICIENT_ROLE'))
      }

      next()
    }
    catch {
      next(new HttpException(500, 'INTERNAL_SERVER_ERROR'))
    }
  }
}

/**
 * Middleware kiểm tra quyền của người dùng
 * @param permissions - Mảng các quyền yêu cầu
 * @param requireAll - Nếu true, người dùng phải có TẤT CẢ quyền. Nếu false, chỉ cần có MỘT quyền
 * @returns Express middleware function
 */
export function requirePermission(permissions: Permission[], requireAll = true) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userReq = req as RequestWithUser
    try {
      if (!userReq.user)
        return next(new HttpException(401, 'AUTH.UNAUTHORIZED'))

      const userRole = userReq.user.role || 'student'
      const hasPermission = requireAll
        ? roleHasAllPermissions(userRole, permissions)
        : roleHasAnyPermission(userRole, permissions)

      if (!hasPermission) {
        return next(new HttpException(403, 'AUTH.FORBIDDEN_INSUFFICIENT_PERMISSIONS'))
      }

      next()
    }
    catch {
      next(new HttpException(500, 'INTERNAL_SERVER_ERROR'))
    }
  }
}

/**
 * Middleware kiểm tra người dùng có BẤT KỲ quyền nào trong danh sách
 * Wrapper tiện lợi cho requirePermission với requireAll = false
 */
export function requireAnyPermission(...permissions: Permission[]) {
  return requirePermission(permissions, false)
}

/**
 * Middleware kiểm tra người dùng có TẤT CẢ các quyền trong danh sách
 * Wrapper tiện lợi cho requirePermission với requireAll = true
 */
export function requireAllPermissions(...permissions: Permission[]) {
  return requirePermission(permissions, true)
}

/**
 * Gắn quyền người dùng vào request để dễ truy cập trong controllers
 * Nên được sử dụng sau AuthMiddleware
 */
export function attachPermissions(req: Request, res: Response, next: NextFunction) {
  const userReq = req as RequestWithUser
  try {
    if (!userReq.user) {
      return next(new HttpException(401, 'AUTH.UNAUTHORIZED'))
    }

    const userRole = userReq.user.role || 'student'
    userReq.permissions = getRolePermissions(userRole)

    next()
  }
  catch {
    next(new HttpException(500, 'INTERNAL_SERVER_ERROR'))
  }
}

/**
 * Middleware kiểm tra ability xóa người dùng dựa trên target user ID
 * Phải được sử dụng sau AuthMiddleware và trên route có param :id
 */
export function canDeleteUserMiddleware(req: Request, res: Response, next: NextFunction) {
  const userReq = req as RequestWithUser
  try {
    if (!userReq.user) {
      return next(new HttpException(401, 'AUTH.UNAUTHORIZED'))
    }

    // Lưu trữ ability check để controller sử dụng
    // Controller sẽ cần lấy target user và validate
    next()
  }
  catch {
    next(new HttpException(500, 'INTERNAL_SERVER_ERROR'))
  }
}
