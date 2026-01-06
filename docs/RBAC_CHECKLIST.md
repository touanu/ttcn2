# Checklist Di Chuyển RBAC

Sử dụng checklist này để di chuyển code hiện tại sang hệ thống RBAC mới.

## Trước Khi Bắt Đầu

- [ ] Đọc `RBAC_HUONG_DAN.md` để hiểu toàn diện
- [ ] Xem xét các ví dụ code
- [ ] Hiểu rõ yêu cầu quyền cho tính năng của bạn

## Di Chuyển Backend

### Bước 1: Xác Định Routes Được Bảo Vệ

- [ ] Liệt kê tất cả routes cần bảo vệ
- [ ] Xác định vai trò hoặc quyền nào mỗi route yêu cầu
- [ ] Tài liệu hóa yêu cầu bảo mật

### Bước 2: Thêm RBAC Middleware

Cho mỗi route được bảo vệ:

- [ ] Import middleware cần thiết:

  ```typescript
  import { AuthMiddleware } from '@middlewares/auth.middleware';
  import { requireRole, requirePermission } from '@middlewares/rbac.middleware';
  import { PERMISSIONS } from '@shared/constants';
  ```

- [ ] Thêm middleware vào route (SAU AuthMiddleware):

  ```typescript
  // Theo vai trò
  router.get('/admin/dashboard', AuthMiddleware, requireRole('admin', 'superadmin'), handler);

  // Theo quyền
  router.put('/courses/:id', AuthMiddleware, requirePermission([PERMISSIONS.COURSE_WRITE]), handler);
  ```

### Bước 3: Cập Nhật Controllers (nếu cần)

- [ ] Loại bỏ kiểm tra vai trò thủ công khỏi logic controller
- [ ] Sử dụng middleware để ủy quyền thay vì
- [ ] Truy cập vai trò người dùng qua `req.user.role` nếu cần cho logic nghiệp vụ

### Bước 4: Kiểm Thử Backend

- [ ] Kiểm thử mỗi route với các vai trò người dùng khác nhau
- [ ] Xác minh truy cập trái phép bị chặn (lỗi 403)
- [ ] Kiểm tra thông báo lỗi phù hợp
- [ ] Kiểm thử không có xác thực (lỗi 401)

## Di Chuyển Frontend

### Bước 1: Xác Định Trang Được Bảo Vệ

- [ ] Liệt kê tất cả trang cần bảo vệ
- [ ] Xác định yêu cầu truy cập (vai trò hoặc quyền)
- [ ] Tài liệu hóa các phần tử UI cần hiển thị có điều kiện

### Bước 2: Thêm Route Middleware

Cho mỗi trang được bảo vệ:

- [ ] Thêm middleware vào page meta:

  ```vue
  <script setup lang="ts">
  import { PERMISSIONS } from '@shared/constants';

  // Theo vai trò
  definePageMeta({
    middleware: ['auth', 'role'],
    role: 'admin',
  });

  // Theo quyền
  definePageMeta({
    middleware: ['auth', 'permission'],
    permission: PERMISSIONS.COURSE_WRITE,
  });
  </script>
  ```

### Bước 3: Cập Nhật UI Components

- [ ] Import permission constants nơi cần thiết:

  ```vue
  <script setup lang="ts">
  import { PERMISSIONS } from '@shared/constants';
  </script>
  ```

- [ ] Bao bọc các phần tử có điều kiện:

  ```vue
  <template>
    <!-- Theo quyền -->
    <Can :permission="PERMISSIONS.COURSE_WRITE">
      <button>Chỉnh sửa</button>
    </Can>

    <!-- Theo vai trò -->
    <HasRole role="admin">
      <AdminPanel />
    </HasRole>

    <!-- Theo xác thực -->
    <Authenticated>
      <UserMenu />
    </Authenticated>
  </template>
  ```

### Bước 4: Cập Nhật Kiểm Tra Lập Trình

- [ ] Sử dụng composable `usePermissions()`:

  ```vue
  <script setup lang="ts">
  const { hasPermission, isAdmin } = usePermissions();

  function doAction() {
    if (!hasPermission(PERMISSIONS.COURSE_WRITE)) {
      showError('Không có quyền');
      return;
    }
    // Tiếp tục
  }
  </script>
  ```

### Bước 5: Kiểm Thử Frontend

- [ ] Kiểm thử truy cập trang với các vai trò khác nhau
- [ ] Xác minh middleware chuyển hướng hoạt động
- [ ] Kiểm tra các phần tử UI hiển thị/ẩn đúng cách
- [ ] Kiểm thử truy cập không xác thực
- [ ] Xác minh thông báo lỗi thân thiện với người dùng

## Kiểm Thử Tích Hợp

### Các Kịch Bản Kiểm Thử

- [ ] **Vai trò Student**
  - Có thể truy cập danh sách khóa học
  - Có thể xem chi tiết khóa học
  - Không thể chỉnh sửa khóa học
  - Không thể truy cập trang admin

- [ ] **Vai trò Teacher**
  - Có thể tạo/chỉnh sửa khóa học
  - Có thể quản lý bài học
  - Có thể chấm điểm bài kiểm tra
  - Không thể xóa người dùng
  - Không thể truy cập cài đặt hệ thống

- [ ] **Vai trò Admin**
  - Có thể quản lý tất cả nội dung
  - Có thể quản lý người dùng
  - Không thể thay đổi vai trò người dùng
  - Không thể truy cập cài đặt hệ thống

- [ ] **Vai trò Superadmin**
  - Truy cập đầy đủ mọi thứ
  - Có thể thay đổi vai trò người dùng
  - Có thể truy cập cài đặt hệ thống

### Trường Hợp Biên

- [ ] Kiểm thử token hết hạn
- [ ] Kiểm thử thay đổi vai trò (người dùng phải đăng nhập lại)
- [ ] Kiểm thử sessions đồng thời
- [ ] Kiểm thử trường hợp biên quyền

## Checklist Triển Khai

### Trước Triển Khai

- [ ] Tất cả routes có middleware phù hợp
- [ ] Tất cả trang có middleware phù hợp
- [ ] Các phần tử UI sử dụng hiển thị có điều kiện
- [ ] Kiểm thử đã vượt qua
- [ ] Tài liệu được cập nhật

### Triển Khai

- [ ] Chạy migrations cơ sở dữ liệu (nếu có)
- [ ] Triển khai backend trước
- [ ] Triển khai frontend
- [ ] Thông báo người dùng về yêu cầu đăng nhập lại

### Sau Triển Khai

- [ ] Giám sát logs lỗi 403/401
- [ ] Kiểm tra từ chối truy cập không mong muốn
- [ ] Xác minh hiệu suất chấp nhận được
- [ ] Thu thập phản hồi người dùng

## Các Lỗi Thường Gặp Cần Tránh

- [ ] ❌ Đừng quên `AuthMiddleware` trước RBAC middleware
- [ ] ❌ Đừng chỉ dựa vào kiểm tra frontend cho bảo mật
- [ ] ❌ Đừng hard-code chuỗi vai trò (sử dụng constants/types)
- [ ] ❌ Đừng kiểm tra vai trò trong logic nghiệp vụ (sử dụng quyền)
- [ ] ❌ Đừng quên kiểm thử với tất cả các loại vai trò

## Checklist Thực Hành Tốt Nhất

- [ ] ✅ Sử dụng kiểm tra dựa trên quyền hơn kiểm tra vai trò khi có thể
- [ ] ✅ Cung cấp thông báo lỗi rõ ràng cho người dùng
- [ ] ✅ Ghi log các lỗi ủy quyền để giám sát bảo mật
- [ ] ✅ Giữ quyền chi tiết và cụ thể
- [ ] ✅ Tài liệu hóa tại sao mỗi route cần bảo vệ
- [ ] ✅ Kiểm thử kỹ lưỡng với các vai trò người dùng khác nhau
- [ ] ✅ Giữ tài liệu RBAC được cập nhật

## Cần Trợ Giúp?

- **Hướng dẫn toàn diện**: `RBAC_HUONG_DAN.md`
- **Ví dụ code**: Xem các file triển khai hiện tại
- **Chi tiết triển khai**: Kiểm tra các file được tạo
- **Permission Constants**: `packages/utils/permissions.ts`
- **Định nghĩa Types**: `packages/types/user.ts`

## Tham Khảo Nhanh

### Các Tùy Chọn Backend Middleware

```typescript
// Vai trò đơn
requireRole('admin');

// Nhiều vai trò (người dùng cần BẤT KỲ)
requireRole('admin', 'teacher');

// Quyền đơn
requirePermission([PERMISSIONS.COURSE_WRITE]);

// Nhiều quyền - TẤT CẢ yêu cầu
requireAllPermissions(PERMISSIONS.COURSE_WRITE, PERMISSIONS.COURSE_PUBLISH);

// Nhiều quyền - BẤT KỲ yêu cầu
requireAnyPermission(PERMISSIONS.COURSE_READ, PERMISSIONS.LESSON_READ);
```

### Các Tùy Chọn Frontend Page Meta

```typescript
// Vai trò đơn
definePageMeta({
  middleware: ['auth', 'role'],
  role: 'admin',
});

// Nhiều vai trò
definePageMeta({
  middleware: ['auth', 'role'],
  roles: ['admin', 'teacher'],
});

// Quyền đơn
definePageMeta({
  middleware: ['auth', 'permission'],
  permission: PERMISSIONS.COURSE_WRITE,
});

// Nhiều quyền
definePageMeta({
  middleware: ['auth', 'permission'],
  permissions: [PERMISSIONS.COURSE_WRITE, PERMISSIONS.COURSE_PUBLISH],
  requireAll: true, // hoặc false cho BẤT KỲ
});

// Chỉ admin
definePageMeta({
  middleware: ['auth', 'admin'],
});
```

---

**Đánh dấu các mục khi bạn hoàn thành chúng!**
