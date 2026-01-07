# Tóm Tắt Triển Khai RBAC

## Tổng Quan

Hệ thống Kiểm Soát Truy Cập Dựa Trên Vai Trò (RBAC) toàn diện đã được triển khai thành công trên toàn bộ ứng dụng TTCN2, cung cấp kiểm soát quyền chi tiết từ các endpoint API backend đến các component UI frontend.

## Những Gì Đã Được Triển Khai

### 1. Các Thành Phần Backend

#### Quyền và Constants (`packages/utils/permissions.ts`)

- Định nghĩa 23 quyền chi tiết trên các tài nguyên (người dùng, khóa học, bài học, bài kiểm tra, đăng ký, hệ thống)
- Tạo ánh xạ vai trò-quyền cho tất cả 4 vai trò người dùng
- Các hàm tiện ích kiểm tra quyền: `getRolePermissions()`, `roleHasPermission()`, `roleHasAnyPermission()`, `roleHasAllPermissions()`

#### RBAC Middleware (`apps/backend/src/middlewares/rbac.middleware.ts`)

- `requireRole(...roles)` - Bảo vệ routes theo vai trò người dùng
- `requirePermission(permissions, requireAll)` - Bảo vệ routes theo quyền
- `requireAnyPermission(...permissions)` - Yêu cầu bất kỳ quyền nào
- `requireAllPermissions(...permissions)` - Yêu cầu tất cả quyền
- `attachPermissions()` - Đính kèm quyền người dùng vào request object

#### Cập Nhật Hệ Thống Auth

- **Auth Service**: Sửa đổi để bao gồm vai trò và quyền trong JWT token payload
- **Auth Interfaces**: Thêm trường `permissions` vào `AccessTokenPayload` và `RequestWithUser`
- **User Model**: Đã có trường `role` với validation enum phù hợp

#### API Quản Lý Vai Trò

- `PATCH /api/users/:id/role` - Cập nhật vai trò người dùng (chỉ admin)
- `GET /api/users/:id/permissions` - Lấy quyền của người dùng
- Validation schema: `updateUserRoleSchema`

### 2. Các Thành Phần Frontend

#### Composables (`apps/frontend/app/composables/usePermissions.ts`)

Cung cấp truy cập reactive đến:

- `userRole` - Vai trò người dùng hiện tại
- `permissions` - Mảng quyền của người dùng
- `isAuthenticated` - Trạng thái xác thực
- `hasPermission()` - Kiểm tra một quyền
- `hasAnyPermission()` - Kiểm tra nếu người dùng có bất kỳ quyền nào
- `hasAllPermissions()` - Kiểm tra nếu người dùng có tất cả quyền
- `hasRole()` - Kiểm tra một vai trò
- `hasAnyRole()` - Kiểm tra nếu người dùng có bất kỳ vai trò nào
- `isAdmin`, `isTeacher`, `isStudent` - Các phím tắt vai trò

#### Route Middleware

- `role.ts` - Bảo vệ trang theo vai trò
- `permission.ts` - Bảo vệ trang theo quyền
- `admin.ts` - Phím tắt cho trang chỉ dành cho admin

#### Conditional Rendering Components

- `<Can>` - Hiển thị/ẩn dựa trên quyền
- `<HasRole>` - Hiển thị/ẩn dựa trên vai trò
- `<Authenticated>` - Hiển thị/ẩn dựa trên xác thực

### 3. Tài Liệu

#### Hướng Dẫn RBAC (`docs/RBAC_HUONG_DAN.md`)

Hướng dẫn toàn diện hơn 400 dòng bao gồm:

- Tổng quan hệ thống và kiến trúc
- Tất cả vai trò người dùng và quyền của họ
- Các pattern triển khai backend
- Các pattern triển khai frontend
- Best practices và cân nhắc bảo mật
- Hướng dẫn khắc phục sự cố
- Các ví dụ hoàn chỉnh

#### Ví Dụ RBAC (`docs/RBAC_VI_DU.md`)

Ví dụ nhanh bao gồm:

- 10 pattern backend
- 12 pattern frontend
- Các pattern sử dụng thường gặp
- Ví dụ kiểm thử
- Code snippets sẵn sàng sao chép

#### Checklist Di Chuyển (`docs/RBAC_CHECKLIST.md`)

Checklist từng bước để:

- Di chuyển backend
- Di chuyển frontend
- Kiểm thử tích hợp
- Triển khai production
- Các lỗi thường gặp cần tránh

## Vai Trò & Quyền Người Dùng

### Phân Cấp Vai Trò

```
Superadmin (Truy cập đầy đủ)
    ↓
Admin (Quản lý nền tảng)
    ↓
Teacher (Tạo nội dung)
    ↓
Student (Học tập)
```

### Phân Phối Quyền

| Tài nguyên                   | Student | Teacher | Admin | Superadmin |
| ---------------------------- | ------- | ------- | ----- | ---------- |
| Người dùng (Đọc)             | ✓       | ✓       | ✓     | ✓          |
| Người dùng (Ghi)             | -       | ✓       | ✓     | ✓          |
| Người dùng (Xóa)             | -       | -       | ✓     | ✓          |
| Người dùng (Quản lý vai trò) | -       | -       | -     | ✓          |
| Khóa học (Đọc)               | ✓       | ✓       | ✓     | ✓          |
| Khóa học (Ghi)               | -       | ✓       | ✓     | ✓          |
| Khóa học (Xuất bản)          | -       | ✓       | ✓     | ✓          |
| Khóa học (Xóa)               | -       | -       | ✓     | ✓          |
| Bài học (Đọc)                | ✓       | ✓       | ✓     | ✓          |
| Bài học (Ghi)                | -       | ✓       | ✓     | ✓          |
| Bài học (Xóa)                | -       | -       | ✓     | ✓          |
| Bài kiểm tra (Làm)           | ✓       | ✓       | ✓     | ✓          |
| Bài kiểm tra (Ghi)           | -       | ✓       | ✓     | ✓          |
| Bài kiểm tra (Chấm điểm)     | -       | ✓       | ✓     | ✓          |
| Bài kiểm tra (Xóa)           | -       | -       | ✓     | ✓          |
| Đăng ký (Đọc)                | ✓       | ✓       | ✓     | ✓          |
| Đăng ký (Ghi)                | ✓       | ✓       | ✓     | ✓          |
| Đăng ký (Xóa)                | -       | -       | ✓     | ✓          |
| Hệ thống (Đọc)               | -       | -       | ✓     | ✓          |
| Hệ thống (Ghi)               | -       | -       | -     | ✓          |

### Chi Tiết 23 Quyền

#### Quản Lý Người Dùng

1. `USER_READ` - Xem thông tin người dùng
2. `USER_WRITE` - Tạo/cập nhật người dùng
3. `USER_DELETE` - Xóa người dùng
4. `USER_MANAGE_ROLES` - Thay đổi vai trò người dùng

#### Quản Lý Khóa Học

5. `COURSE_READ` - Xem khóa học
6. `COURSE_WRITE` - Tạo/cập nhật khóa học
7. `COURSE_PUBLISH` - Xuất bản khóa học
8. `COURSE_DELETE` - Xóa khóa học

#### Quản Lý Bài Học

9. `LESSON_READ` - Xem bài học
10. `LESSON_WRITE` - Tạo/cập nhật bài học
11. `LESSON_DELETE` - Xóa bài học

#### Quản Lý Bài Kiểm Tra

12. `QUIZ_TAKE` - Làm bài kiểm tra
13. `QUIZ_WRITE` - Tạo/cập nhật bài kiểm tra
14. `QUIZ_GRADE` - Chấm điểm bài kiểm tra
15. `QUIZ_DELETE` - Xóa bài kiểm tra

#### Quản Lý Đăng Ký

16. `ENROLLMENT_READ` - Xem đăng ký
17. `ENROLLMENT_WRITE` - Tạo/cập nhật đăng ký
18. `ENROLLMENT_DELETE` - Xóa đăng ký

#### Quản Lý Hệ Thống

19. `SYSTEM_READ` - Xem cài đặt hệ thống
20. `SYSTEM_WRITE` - Sửa đổi cài đặt hệ thống
21. `NOTIFICATION_SEND` - Gửi thông báo
22. `ANALYTICS_VIEW` - Xem phân tích
23. `LIVE_CLASS_MANAGE` - Quản lý lớp học trực tiếp

## Cấu Trúc File

### Backend Files Created/Modified

```
packages/
└── utils/
    └── permissions.ts                          # [MỚI] Permission constants và role mapping

apps/backend/src/
├── middlewares/
│   └── rbac.middleware.ts                     # [MỚI] RBAC middleware functions
├── services/
│   └── auth.service.ts                        # [SỬA ĐỔI] Thêm permissions vào JWT
├── controllers/
│   └── users.controller.ts                    # [SỬA ĐỔI] Thêm endpoints quản lý vai trò
├── routes/
│   └── users.route.ts                         # [SỬA ĐỔI] Thêm role management routes
└── interfaces/
    └── auth.interface.ts                      # [SỬA ĐỔI] Thêm trường permissions
```

### Frontend Files Created/Modified

```
apps/frontend/app/
├── composables/
│   └── usePermissions.ts                      # [MỚI] Permission composable
├── middleware/
│   ├── role.ts                                # [MỚI] Role-based route guard
│   ├── permission.ts                          # [MỚI] Permission-based route guard
│   └── admin.ts                               # [MỚI] Admin-only route guard
└── components/
    ├── Can.vue                                # [MỚI] Permission-based conditional render
    ├── HasRole.vue                            # [MỚI] Role-based conditional render
    └── Authenticated.vue                      # [MỚI] Auth-based conditional render

apps/frontend/server/
└── middleware/
    └── auth.ts                                # [SỬA ĐỔI] Pass permissions to session
```

### Documentation Files Created

```
docs/
├── RBAC_HUONG_DAN.md                          # Hướng dẫn toàn diện
├── RBAC_VI_DU.md                              # Ví dụ nhanh
├── RBAC_TRIEN_KHAI.md                         # Tóm tắt triển khai (file này)
└── RBAC_CHECKLIST.md                          # Checklist di chuyển
```

## Các Tính Năng Chính

### Backend Protection

```typescript
// Bảo vệ theo vai trò
router.get('/admin/dashboard', AuthMiddleware, requireRole('admin', 'superadmin'), controller.getDashboard);

// Bảo vệ theo quyền
router.put('/courses/:id', AuthMiddleware, requirePermission([PERMISSIONS.COURSES.UPDATE]), controller.updateCourse);

// Yêu cầu nhiều quyền
router.post(
  '/courses/:id/publish',
  AuthMiddleware,
  requireAllPermissions(PERMISSIONS.COURSES.UPDATE, PERMISSIONS.COURSES.PUBLISH),
  controller.publishCourse,
);
```

### Frontend Protection

```vue
<!-- Bảo vệ trang -->
<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'permission'],
  permission: PERMISSIONS.COURSES.UPDATE,
});
</script>

<!-- Hiển thị có điều kiện -->
<template>
  <Can :permission="PERMISSIONS.COURSES.UPDATE">
    <button @click="edit">Chỉnh sửa</button>
  </Can>

  <HasRole role="admin">
    <AdminPanel />
  </HasRole>
</template>

<!-- Kiểm tra lập trình -->
<script setup lang="ts">
const { hasPermission, isAdmin } = usePermissions();

if (hasPermission(PERMISSIONS.COURSES.DELETE)) {
  // Cho phép xóa
}
</script>
```

## Luồng Xác Thực

```
1. User đăng nhập
   ↓
2. Backend tạo JWT với role + permissions
   ↓
3. Frontend lưu session với user data + permissions
   ↓
4. Middleware kiểm tra permissions trên mỗi request
   ↓
5. Components/composables kiểm tra permissions cho UI logic
```

## Các Cân Nhắc Bảo Mật

### Backend

- ✅ Luôn validate quyền trên backend (không tin tưởng frontend)
- ✅ Sử dụng middleware RBAC SAU AuthMiddleware
- ✅ Ghi log tất cả các lỗi ủy quyền
- ✅ Trả về mã lỗi phù hợp (401 cho chưa xác thực, 403 cho không có quyền)
- ✅ Làm mới permissions khi vai trò thay đổi (yêu cầu đăng nhập lại)

### Frontend

- ✅ Sử dụng kiểm tra quyền cho UX (ẩn/hiện buttons)
- ✅ Không dựa vào frontend checks cho bảo mật thực sự
- ✅ Xử lý lỗi 403 một cách graceful
- ✅ Cung cấp thông báo lỗi rõ ràng cho người dùng
- ✅ Validate quyền trước khi gọi API endpoints

## Kiểm Thử

### Backend Testing

```typescript
// Test middleware protection
describe('RBAC Middleware', () => {
  it('should block non-admin users', async () => {
    const res = await request(app).get('/admin/dashboard').set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(403);
  });

  it('should allow users with correct permission', async () => {
    const res = await request(app).put('/courses/123').set('Authorization', `Bearer ${teacherToken}`).send({ title: 'Updated' });

    expect(res.status).toBe(200);
  });
});
```

### Frontend Testing

```typescript
// Test composable
describe('usePermissions', () => {
  it('should return correct permissions for teacher', () => {
    const { hasPermission } = usePermissions();

    expect(hasPermission(PERMISSIONS.COURSES.UPDATE)).toBe(true);
    expect(hasPermission(PERMISSIONS.SYSTEM.SETTINGS)).toBe(false);
  });
});

// Test middleware
describe('Role Middleware', () => {
  it('should redirect non-admin users', async () => {
    // Setup student user
    const result = await middleware(to, from);

    expect(result).toEqual({ path: '/' });
  });
});
```

## Migration Path

### Cho Hệ Thống Hiện Tại

1. **Phase 1: Backend Setup** (1-2 ngày)
   - Thêm permissions constants
   - Tạo RBAC middleware
   - Cập nhật auth service
   - Thêm role management endpoints

2. **Phase 2: Backend Migration** (2-3 ngày)
   - Xác định tất cả routes cần bảo vệ
   - Thêm middleware phù hợp
   - Loại bỏ kiểm tra vai trò thủ công
   - Kiểm thử kỹ lưỡng

3. **Phase 3: Frontend Setup** (1-2 ngày)
   - Tạo composables
   - Tạo route middleware
   - Tạo conditional components
   - Cập nhật session handling

4. **Phase 4: Frontend Migration** (2-3 ngày)
   - Thêm page middleware
   - Cập nhật UI components
   - Thay thế kiểm tra thủ công
   - Kiểm thử tích hợp

5. **Phase 5: Testing & Deployment** (2-3 ngày)
   - Kiểm thử end-to-end
   - Kiểm thử với tất cả vai trò
   - Cập nhật tài liệu
   - Triển khai production

**Tổng thời gian ước tính: 8-13 ngày**

## Bảo Trì & Cập Nhật

### Thêm Quyền Mới

1. Thêm vào `PERMISSIONS` object trong `permissions.ts`
2. Cập nhật `ROLE_PERMISSIONS` mapping
3. Sử dụng permission mới trong middleware/composables
4. Cập nhật tài liệu
5. Thông báo cho team

### Thêm Vai Trò Mới

1. Thêm vào `UserRole` type
2. Cập nhật User model validation
3. Tạo permission mapping trong `ROLE_PERMISSIONS`
4. Cập nhật tài liệu
5. Kiểm thử kỹ lưỡng

### Thay Đổi Permission Mapping

1. Cập nhật `ROLE_PERMISSIONS`
2. Kiểm thử với tất cả vai trò bị ảnh hưởng
3. Cập nhật tài liệu
4. Notify users về thay đổi
5. Yêu cầu users đăng nhập lại nếu cần

## Tài Liệu Tham Khảo

- **Hướng dẫn đầy đủ**: [RBAC_HUONG_DAN.md](./RBAC_HUONG_DAN.md)
- **Ví dụ code**: [RBAC_VI_DU.md](./RBAC_VI_DU.md)
- **Checklist di chuyển**: [RBAC_CHECKLIST.md](./RBAC_CHECKLIST.md)
- **Permission constants**: `packages/utils/permissions.ts`
- **Type definitions**: `packages/types/user.ts`

## Hỗ Trợ

Nếu bạn gặp vấn đề:

1. Kiểm tra tài liệu liên quan
2. Xem các ví dụ code
3. Kiểm tra console logs cho lỗi chi tiết
4. Xác minh middleware order đúng
5. Test với vai trò người dùng khác nhau

---

**Triển khai bởi**: GitHub Copilot
**Ngày**: 2025-01-05
**Trạng thái**: ✅ Hoàn thành và đã kiểm thử
