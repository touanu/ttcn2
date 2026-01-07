# Hướng Dẫn Phân Quyền Dựa Trên Vai Trò (RBAC)

Tài liệu này cung cấp hướng dẫn toàn diện về việc sử dụng hệ thống Phân quyền dựa trên vai trò (RBAC) được triển khai trong dự án TTCN2.

## Tổng Quan

Hệ thống RBAC cung cấp kiểm soát quyền chi tiết trên toàn bộ stack ứng dụng, từ các endpoint API backend đến các component UI frontend. Hệ thống được xây dựng dựa trên:

- **Vai trò (Roles)**: Các vai trò người dùng được định nghĩa sẵn (student, teacher, admin, superadmin)
- **Quyền (Permissions)**: Các quyền truy cập chi tiết (ví dụ: `user:read`, `course:write`)
- **Ánh xạ Vai trò-Quyền**: Mỗi vai trò có một tập hợp quyền cụ thể

## Các Vai Trò Người Dùng

Hệ thống định nghĩa bốn vai trò người dùng với quyền phân cấp:

### Student (Học viên)

Vai trò cơ bản với quyền truy cập chỉ đọc nội dung học tập:

- Xem khóa học và bài học
- Làm bài kiểm tra
- Xem tiến độ đăng ký và học tập của mình

### Teacher (Giáo viên)

Giảng viên có thể tạo và quản lý nội dung giáo dục:

- Tất cả quyền của học viên
- Tạo và chỉnh sửa khóa học, bài học và bài kiểm tra
- Chấm điểm bài nộp của học viên
- Quản lý đăng ký trong các khóa học của mình

### Admin (Quản trị viên)

Quản trị viên có thể quản lý nền tảng:

- Tất cả quyền của giáo viên
- Quản lý tất cả người dùng (trừ thay đổi vai trò)
- Xuất bản/hủy xuất bản khóa học
- Xem nhật ký hệ thống

### Superadmin (Siêu quản trị)

Quản trị viên hệ thống với quyền truy cập đầy đủ:

- Tất cả quyền trong hệ thống
- Thay đổi vai trò người dùng
- Truy cập cài đặt hệ thống

## Quyền

Các quyền được tổ chức theo cấu trúc nested dựa trên tài nguyên:

```typescript
PERMISSIONS = {
  USERS: {
    VIEW: 'user:read',
    CREATE: 'user:write',
    UPDATE: 'user:write',
    DELETE: 'user:delete',
    MANAGE_ROLES: 'user:manage-roles',
  },
  COURSES: {
    VIEW: 'course:read',
    CREATE: 'course:write',
    UPDATE: 'course:write',
    DELETE: 'course:delete',
    PUBLISH: 'course:publish',
  },
  LESSONS: {
    VIEW: 'lesson:read',
    CREATE: 'lesson:write',
    UPDATE: 'lesson:write',
    DELETE: 'lesson:delete',
  },
  QUIZZES: {
    VIEW: 'quiz:read',
    CREATE: 'quiz:write',
    UPDATE: 'quiz:write',
    DELETE: 'quiz:delete',
    GRADE: 'quiz:grade',
  },
  ENROLLMENTS: {
    VIEW: 'enrollment:read',
    CREATE: 'enrollment:write',
    UPDATE: 'enrollment:write',
    DELETE: 'enrollment:delete',
  },
  SYSTEM: {
    SETTINGS: 'system:settings',
    LOGS: 'system:logs',
  },
};
```

Sử dụng: `PERMISSIONS.COURSES.UPDATE`, `PERMISSIONS.USERS.VIEW`, v.v.

## Triển Khai Backend

### Bảo Vệ Routes với Middleware

#### Bảo vệ theo Vai trò

Yêu cầu người dùng có vai trò cụ thể:

```typescript
import { requireRole } from '@middlewares/rbac.middleware';

router.get('/admin/dashboard', AuthMiddleware, requireRole('admin', 'superadmin'), controller.adminDashboard);
```

#### Bảo vệ theo Quyền

Yêu cầu người dùng có quyền cụ thể:

```typescript
import { requirePermission, requireAnyPermission, requireAllPermissions } from '@middlewares/rbac.middleware';
import { PERMISSIONS } from '@shared/constants';

// Người dùng phải có TẤT CẢ các quyền được chỉ định
router.put('/courses/:id', AuthMiddleware, requireAllPermissions(PERMISSIONS.COURSES.UPDATE, PERMISSIONS.COURSES.PUBLISH), controller.updateCourse);

// Người dùng phải có BẤT KỲ quyền nào trong số các quyền được chỉ định
router.get('/content/:id', AuthMiddleware, requireAnyPermission(PERMISSIONS.COURSES.VIEW, PERMISSIONS.LESSONS.VIEW), controller.getContent);
```

### Truy Cập Quyền Người Dùng trong Controllers

```typescript
import type { RequestWithUser } from '@shared/interfaces';

export class CourseController {
  public getCourse: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser;

    // Truy cập vai trò người dùng
    const userRole = userReq.user.role;

    // Truy cập quyền người dùng (nếu sử dụng middleware attachPermissions)
    const permissions = userReq.permissions;
  });
}
```

### API Quản Lý Vai Trò

#### Cập nhật Vai trò Người dùng (Chỉ Admin)

```http
PATCH /api/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "teacher"
}
```

#### Lấy Quyền Người dùng

```http
GET /api/users/:id/permissions
Authorization: Bearer <token>
```

Phản hồi:

```json
{
  "success": true,
  "data": {
    "role": "teacher",
    "permissions": [
      "user:read",
      "course:read",
      "course:write",
      ...
    ]
  }
}
```

## Triển Khai Frontend

### Sử Dụng Permissions Composable

Composable `usePermissions()` cung cấp truy cập reactive đến quyền người dùng trong các component Vue:

```vue
<script setup lang="ts">
import { PERMISSIONS } from '@shared/constants';

const {
  userRole,
  permissions,
  isAuthenticated,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  isAdmin,
  isTeacher,
  isStudent,
} = usePermissions();

// Kiểm tra quyền cụ thể
const canEditCourse = hasPermission(PERMISSIONS.COURSES.UPDATE);

// Kiểm tra nếu người dùng có bất kỳ quyền nào
const canAccessContent = hasAnyPermission(PERMISSIONS.COURSES.VIEW, PERMISSIONS.LESSONS.VIEW);

// Kiểm tra nếu người dùng có tất cả quyền
const canPublishCourse = hasAllPermissions(PERMISSIONS.COURSES.UPDATE, PERMISSIONS.COURSES.PUBLISH);

// Kiểm tra vai trò cụ thể
const isInstructor = hasRole('teacher');

// Kiểm tra nếu người dùng có bất kỳ vai trò nào
const canManageContent = hasAnyRole('teacher', 'admin');
</script>
```

### Bảo Vệ Route với Middleware

#### Bảo vệ theo Vai trò

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'role'],
  role: 'admin', // Vai trò đơn
  // HOẶC
  roles: ['admin', 'teacher'], // Nhiều vai trò (người dùng cần BẤT KỲ)
});
</script>

<template>
  <div>Trang chỉ dành cho Admin hoặc Teacher</div>
</template>
```

#### Bảo vệ theo Quyền

```vue
<script setup lang="ts">
import { PERMISSIONS } from '@shared/constants';

definePageMeta({
  middleware: ['auth', 'permission'],
  permission: PERMISSIONS.COURSES.UPDATE, // Quyền đơn
  // HOẶC
  permissions: [PERMISSIONS.COURSES.UPDATE, PERMISSIONS.LESSONS.UPDATE], // Nhiều quyền
  requireAll: true, // Người dùng phải có TẤT CẢ (mặc định: false = BẤT KỲ)
});
</script>

<template>
  <div>Nội dung được bảo vệ</div>
</template>
```

#### Bảo vệ Chỉ Admin

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'admin'],
});
</script>

<template>
  <div>Bảng điều khiển Admin</div>
</template>
```

### Component Hiển Thị Có Điều Kiện

#### Component Can (Dựa trên Quyền)

Hiển thị nội dung chỉ khi người dùng có quyền cụ thể:

```vue
<template>
  <!-- Hiển thị nếu người dùng có quyền -->
  <Can :permission="PERMISSIONS.COURSES.UPDATE">
    <button @click="editCourse">Chỉnh sửa khóa học</button>
  </Can>

  <!-- Hiển thị nếu người dùng có BẤT KỲ quyền nào -->
  <Can :permissions="[PERMISSIONS.COURSES.UPDATE, PERMISSIONS.COURSES.DELETE]">
    <button @click="manageCourse">Quản lý khóa học</button>
  </Can>

  <!-- Hiển thị nếu người dùng có TẤT CẢ quyền -->
  <Can :permissions="[PERMISSIONS.COURSES.UPDATE, PERMISSIONS.COURSES.PUBLISH]" :require-all="true">
    <button @click="publishCourse">Xuất bản khóa học</button>
  </Can>

  <!-- Hiển thị nếu người dùng KHÔNG có quyền (fallback) -->
  <Can :permission="PERMISSIONS.COURSES.UPDATE" :fallback="true">
    <p>Bạn không có quyền chỉnh sửa khóa học</p>
  </Can>
</template>
```

#### Component HasRole (Dựa trên Vai trò)

Hiển thị nội dung chỉ khi người dùng có vai trò cụ thể:

```vue
<template>
  <!-- Hiển thị nếu người dùng là admin -->
  <HasRole role="admin">
    <AdminPanel />
  </HasRole>

  <!-- Hiển thị nếu người dùng là teacher hoặc admin -->
  <HasRole :roles="['teacher', 'admin']">
    <TeacherTools />
  </HasRole>

  <!-- Hiển thị nếu người dùng KHÔNG phải admin (fallback) -->
  <HasRole role="admin" :fallback="true">
    <p>Phần này chỉ dành cho admin</p>
  </HasRole>
</template>
```

#### Component Authenticated

Hiển thị nội dung dựa trên trạng thái xác thực:

```vue
<template>
  <!-- Chỉ hiển thị cho người dùng đã xác thực -->
  <Authenticated>
    <UserMenu />
  </Authenticated>

  <!-- Chỉ hiển thị cho người dùng chưa xác thực -->
  <Authenticated :fallback="true">
    <LoginButton />
  </Authenticated>
</template>
```

## Thực Hành Tốt Nhất

### Backend

1. **Luôn sử dụng authentication middleware trước RBAC middleware**:

   ```typescript
   router.get('/protected', AuthMiddleware, requireRole('admin'), handler);
   ```

2. **Ưu tiên kiểm tra dựa trên quyền hơn kiểm tra vai trò** khi có thể để linh hoạt hơn
3. **Sử dụng quyền cụ thể** thay vì kiểm tra vai trò trong logic nghiệp vụ
4. **Ghi log các lỗi ủy quyền** để giám sát bảo mật
5. **Không tiết lộ dữ liệu nhạy cảm** trong thông báo lỗi

### Frontend

1. **Luôn sử dụng route middleware** để bảo vệ cấp trang
2. **Sử dụng components** (`<Can>`, `<HasRole>`) để kiểm soát hiển thị UI
3. **Không chỉ dựa vào kiểm tra frontend** - luôn thực thi trên backend
4. **Cung cấp phản hồi cho người dùng** khi truy cập bị từ chối
5. **Kiểm thử với các vai trò khác nhau** trong quá trình phát triển

## Cân Nhắc Bảo Mật

1. **Kiểm tra frontend chỉ cho UX** - chúng không cung cấp bảo mật
2. **Luôn xác thực quyền trên backend** cho tất cả các thao tác
3. **Quyền được bao gồm trong JWT tokens** - lưu ý kích thước token
4. **Vô hiệu hóa sessions** khi vai trò thay đổi
5. **Kiểm toán các thay đổi vai trò** và duy trì logs
6. **Sử dụng HTTPS** để bảo vệ tokens trong quá trình truyền

## Xử Lý Sự Cố

### Người dùng không thể truy cập route được bảo vệ

1. Kiểm tra xem người dùng đã xác thực chưa
2. Xác minh vai trò người dùng trong database
3. Kiểm tra xem vai trò có quyền cần thiết trong `ROLE_PERMISSIONS` không
4. Xác minh JWT token bao gồm vai trò và quyền
5. Kiểm tra thứ tự middleware trong định nghĩa route

### Quyền không cập nhật sau khi thay đổi vai trò

1. Người dùng cần đăng xuất và đăng nhập lại (token mới với quyền mới)
2. Hoặc triển khai cơ chế refresh token để cập nhật quyền

### Frontend hiển thị UI được bảo vệ nhưng backend từ chối truy cập

Đây là hành vi mong đợi - kiểm tra frontend là cho UX, backend thực thi bảo mật. Đảm bảo backend có middleware bảo vệ phù hợp.

## Tài Nguyên

- **Hướng dẫn đầy đủ**: Xem tài liệu này để biết thêm chi tiết
- **Ví dụ**: Xem `RBAC_EXAMPLES_VI.md` cho các ví dụ copy-paste
- **Constants**: Kiểm tra `packages/utils/permissions.ts` cho tất cả quyền có sẵn
- **Types**: Xem `packages/types/user.ts` cho định nghĩa type `UserRole`

---

**Ngày triển khai**: 5 tháng 1, 2026
**Phiên bản**: 1.0.0
**Trạng thái**: ✅ Hoàn thành và sẵn sàng sử dụng
