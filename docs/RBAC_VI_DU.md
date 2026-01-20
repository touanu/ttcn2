# Hệ Thống RBAC - Ví Dụ Nhanh

Tài liệu này cung cấp các ví dụ tham khảo nhanh để triển khai RBAC trong code của bạn.

## Ví Dụ Backend

### 1. Bảo Vệ Route Theo Vai Trò

```typescript
// Trong file route của bạn (ví dụ: routes/admin.route.ts)
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { requireRole } from '@middlewares/rbac.middleware';

router.get('/admin/dashboard', AuthMiddleware, requireRole('admin', 'superadmin'), controller.getDashboard);
```

### 2. Bảo Vệ Route Theo Quyền

```typescript
import { requirePermission } from '@middlewares/rbac.middleware';
import { PERMISSIONS } from '@shared/constants';

router.put('/courses/:id', AuthMiddleware, requirePermission([PERMISSIONS.COURSES.UPDATE]), controller.updateCourse);
```

### 3. Yêu Cầu Nhiều Quyền (TẤT CẢ)

```typescript
router.post(
  '/courses/:id/publish',
  AuthMiddleware,
  requireAllPermissions(PERMISSIONS.COURSES.UPDATE, PERMISSIONS.COURSES.PUBLISH),
  controller.publishCourse,
);
```

### 4. Yêu Cầu Bất Kỳ Quyền Nào

```typescript
router.get('/content/:id', AuthMiddleware, requireAnyPermission(PERMISSIONS.COURSES.VIEW, PERMISSIONS.LESSONS.VIEW), controller.getContent);
```

### 5. Kiểm Tra Quyền Trong Controller

```typescript
import type { RequestWithUser } from '@shared/interfaces';
import { getRolePermissions } from '@shared/utils';

export class CourseController {
  updateCourse: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser;
    const userRole = userReq.user.role || 'student';
    const permissions = getRolePermissions(userRole);

    // Kiểm tra xem user có thể publish không
    const canPublish = permissions.includes(PERMISSIONS.COURSES.PUBLISH);

    // Logic của bạn ở đây...
  });
}
```

### 6. Cập Nhật Vai Trò Người Dùng

```typescript
// Controller quản lý vai trò
export class UserController {
  updateUserRole: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser;
    const { userId } = req.params;
    const { role } = req.body;

    // Chỉ superadmin mới được phép
    if (userReq.user.role !== 'superadmin') {
      throw new HttpException(403, 'Không có quyền thay đổi vai trò');
    }

    // Cập nhật vai trò
    await User.findByIdAndUpdate(userId, { role });

    res.json({ message: 'Vai trò đã được cập nhật' });
  });
}
```

### 7. Lấy Quyền Của Người Dùng

```typescript
export class UserController {
  getUserPermissions: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser;
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new HttpException(404, 'Không tìm thấy người dùng');
    }

    const permissions = getRolePermissions(user.role);

    res.json({ permissions });
  });
}
```

## Ví Dụ Frontend

### 1. Bảo Vệ Trang Theo Vai Trò

```vue
<!-- pages/admin/dashboard.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'role'],
  role: 'admin',
});
</script>

<template>
  <div>
    <h1>Bảng Điều Khiển Admin</h1>
  </div>
</template>
```

### 2. Bảo Vệ Trang Theo Nhiều Vai Trò

```vue
<!-- pages/teaching/courses.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'role'],
  roles: ['teacher', 'admin', 'superadmin'],
});
</script>

<template>
  <div>
    <h1>Quản Lý Khóa Học</h1>
  </div>
</template>
```

### 3. Bảo Vệ Trang Theo Quyền

```vue
<!-- pages/courses/[id]/edit.vue -->
<script setup lang="ts">
import { PERMISSIONS } from '@shared/constants';

definePageMeta({
  middleware: ['auth', 'permission'],
  permission: PERMISSIONS.COURSES.UPDATE,
});
</script>

<template>
  <div>
    <h1>Chỉnh Sửa Khóa Học</h1>
  </div>
</template>
```

### 4. Bảo Vệ Trang Theo Nhiều Quyền (TẤT CẢ)

```vue
<!-- pages/courses/[id]/publish.vue -->
<script setup lang="ts">
import { PERMISSIONS } from '@shared/constants';

definePageMeta({
  middleware: ['auth', 'permission'],
  permissions: [PERMISSIONS.COURSES.UPDATE, PERMISSIONS.COURSES.PUBLISH],
  requireAll: true,
});
</script>

<template>
  <div>
    <h1>Xuất Bản Khóa Học</h1>
  </div>
</template>
```

### 5. Bảo Vệ Trang Theo Bất Kỳ Quyền Nào

```vue
<!-- pages/content/library.vue -->
<script setup lang="ts">
import { PERMISSIONS } from '@shared/constants';

definePageMeta({
  middleware: ['auth', 'permission'],
  permissions: [PERMISSIONS.COURSES.VIEW, PERMISSIONS.LESSONS.VIEW],
  requireAll: false, // Chỉ cần một trong hai quyền
});
</script>

<template>
  <div>
    <h1>Thư Viện Nội Dung</h1>
  </div>
</template>
```

### 6. Hiển Thị Có Điều Kiện - Component `Can`

```vue
<script setup lang="ts">
import { PERMISSIONS } from '@shared/constants';
</script>

<template>
  <div class="course-card">
    <h2>{{ course.title }}</h2>

    <!-- Nút chỉ hiển thị nếu user có quyền -->
    <Can :permission="PERMISSIONS.COURSES.UPDATE">
      <button @click="editCourse">Chỉnh sửa</button>
    </Can>

    <!-- Hiển thị nội dung khác nếu không có quyền -->
    <Can :permission="PERMISSIONS.COURSES.UPDATE">
      <template #default>
        <button @click="editCourse">Chỉnh sửa</button>
      </template>
      <template #fallback>
        <span class="text-gray-500">Chỉ xem</span>
      </template>
    </Can>
  </div>
</template>
```

### 7. Hiển Thị Có Điều Kiện - Component `HasRole`

```vue
<script setup lang="ts"></script>

<template>
  <div class="navigation">
    <!-- Menu admin -->
    <HasRole role="admin">
      <RouterLink to="/admin"> Bảng điều khiển Admin </RouterLink>
    </HasRole>

    <!-- Menu giáo viên -->
    <HasRole :roles="['teacher', 'admin']">
      <RouterLink to="/teaching"> Giảng dạy </RouterLink>
    </HasRole>

    <!-- Menu học sinh -->
    <HasRole role="student">
      <RouterLink to="/my-courses"> Khóa học của tôi </RouterLink>
    </HasRole>
  </div>
</template>
```

### 8. Hiển Thị Có Điều Kiện - Component `Authenticated`

```vue
<template>
  <div class="header">
    <!-- Hiển thị cho user đã đăng nhập -->
    <Authenticated>
      <UserMenu />
    </Authenticated>

    <!-- Hiển thị cho user chưa đăng nhập -->
    <Authenticated>
      <template #default>
        <UserMenu />
      </template>
      <template #fallback>
        <button @click="login">Đăng nhập</button>
      </template>
    </Authenticated>
  </div>
</template>
```

### 9. Sử Dụng Composable `usePermissions`

```vue
<script setup lang="ts">
import { PERMISSIONS } from '@shared/constants';

const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, isAdmin, isTeacher } = usePermissions();

// Kiểm tra một quyền
const canEdit = hasPermission(PERMISSIONS.COURSES.UPDATE);

// Kiểm tra bất kỳ quyền nào
const canViewContent = hasAnyPermission([PERMISSIONS.COURSES.VIEW, PERMISSIONS.LESSONS.VIEW]);

// Kiểm tra tất cả quyền
const canPublish = hasAllPermissions([PERMISSIONS.COURSES.UPDATE, PERMISSIONS.COURSES.PUBLISH]);

// Kiểm tra vai trò
const isAdminUser = isAdmin.value;
const isTeacherUser = isTeacher.value;

function handleEdit() {
  if (!canEdit.value) {
    showError('Bạn không có quyền chỉnh sửa khóa học này');
  }
  // Tiếp tục xử lý
}

function handlePublish() {
  if (!canPublish.value) {
    showError('Bạn không có đủ quyền để xuất bản');
  }
  // Tiếp tục xử lý
}
</script>

<template>
  <div>
    <!-- Sử dụng trong template -->
    <button v-if="canEdit" @click="handleEdit">Chỉnh sửa</button>

    <button v-if="canPublish" @click="handlePublish">Xuất bản</button>
  </div>
</template>
```

### 10. Logic Phức Tạp Với Permissions

```vue
<script setup lang="ts">
import { PERMISSIONS } from '@shared/constants';

const { hasPermission, hasRole, userRole, permissions } = usePermissions();

// Tính toán quyền truy cập dựa trên nhiều điều kiện
const canManageCourse = computed(() => {
  // Admin có thể quản lý tất cả
  if (hasRole('admin') || hasRole('superadmin')) {
    return true;
  }

  // Giáo viên cần cả quyền đọc và ghi
  if (hasRole('teacher')) {
    return hasPermission(PERMISSIONS.COURSES.VIEW) && hasPermission(PERMISSIONS.COURSES.UPDATE);
  }

  return false;
});

// Kiểm tra quyền cao cấp
const hasAdvancedAccess = computed(() => {
  return hasAllPermissions([PERMISSIONS.COURSES.UPDATE, PERMISSIONS.COURSES.PUBLISH, PERMISSIONS.COURSES.DELETE]).value;
});

// Tính năng dựa trên vai trò
const availableFeatures = computed(() => {
  const features = [];

  if (hasPermission(PERMISSIONS.COURSES.VIEW)) {
    features.push('view-courses');
  }

  if (hasPermission(PERMISSIONS.COURSES.UPDATE)) {
    features.push('edit-courses', 'create-courses');
  }

  if (hasPermission(PERMISSIONS.USERS.CREATE)) {
    features.push('manage-students');
  }

  if (hasRole('admin') || hasRole('superadmin')) {
    features.push('view-analytics', 'export-data');
  }

  return features;
});
</script>

<template>
  <div>
    <div v-if="canManageCourse">
      <CourseManagementPanel :features="availableFeatures" />
    </div>

    <div v-if="hasAdvancedAccess" class="advanced-tools">
      <h3>Công cụ nâng cao</h3>
      <AdvancedCourseTools />
    </div>
  </div>
</template>
```

### 11. Xử Lý Lỗi Permissions

```vue
<script setup lang="ts">
import { PERMISSIONS } from '@shared/constants';

const { hasPermission } = usePermissions();
const toast = useToast();

async function deleteCourse(courseId: string) {
  // Kiểm tra quyền trước khi gọi API
  if (!hasPermission(PERMISSIONS.COURSES.DELETE)) {
    toast.add({
      title: 'Lỗi',
      description: 'Bạn không có quyền xóa khóa học',
      color: 'red',
    });
    return;
  }

  try {
    await $fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
    });

    toast.add({
      title: 'Thành công',
      description: 'Khóa học đã được xóa',
      color: 'green',
    });
  } catch (error: any) {
    if (error.statusCode === 403) {
      toast.add({
        title: 'Không có quyền',
        description: 'Bạn không được phép thực hiện hành động này',
        color: 'red',
      });
    } else {
      toast.add({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra',
        color: 'red',
      });
    }
  }
}
</script>
```

### 12. Route Guards Tùy Chỉnh

```typescript
// middleware/course-edit.ts
import { PERMISSIONS } from '@shared/constants';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { hasPermission } = usePermissions();

  // Kiểm tra quyền cơ bản
  if (!hasPermission(PERMISSIONS.COURSES.UPDATE)) {
    return navigateTo('/courses');
  }

  // Kiểm tra ownership nếu không phải admin
  const { isAdmin } = usePermissions();
  if (!isAdmin.value) {
    const courseId = to.params.id;
    const course = await $fetch(`/api/courses/${courseId}`);

    const { user } = useAuth();
    if (course.teacherId !== user.value?.id) {
      return navigateTo('/courses');
    }
  }
});
```

## Các Pattern Thường Dùng

### 1. Menu Điều Hướng Động

```vue
<script setup lang="ts">
import { PERMISSIONS } from '@shared/constants';

const { hasPermission, hasRole } = usePermissions();

const navigationItems = computed(() => {
  const items = [];

  // Tất cả user đã xác thực
  items.push({
    label: 'Trang chủ',
    to: '/',
  });

  // Học sinh
  if (hasRole('student')) {
    items.push({
      label: 'Khóa học của tôi',
      to: '/my-courses',
    });
  }

  // Giáo viên
  if (hasPermission(PERMISSIONS.COURSES.UPDATE)) {
    items.push({
      label: 'Giảng dạy',
      to: '/teaching',
    });
  }

  // Admin
  if (hasRole('admin') || hasRole('superadmin')) {
    items.push({
      label: 'Admin',
      to: '/admin',
    });
  }

  return items;
});
</script>

<template>
  <nav>
    <RouterLink v-for="item in navigationItems" :key="item.to" :to="item.to">
      {{ item.label }}
    </RouterLink>
  </nav>
</template>
```

### 2. Danh Sách Actions Động

```vue
<script setup lang="ts">
import { PERMISSIONS } from '@shared/constants';

const props = defineProps<{
  courseId: string;
}>();

const { hasPermission } = usePermissions();

const availableActions = computed(() => {
  const actions = [];

  // View luôn có
  actions.push({
    label: 'Xem chi tiết',
    icon: 'i-heroicons-eye',
    action: () => viewCourse(props.courseId),
  });

  if (hasPermission(PERMISSIONS.COURSES.UPDATE)) {
    actions.push({
      label: 'Chỉnh sửa',
      icon: 'i-heroicons-pencil',
      action: () => editCourse(props.courseId),
    });
  }

  if (hasPermission(PERMISSIONS.COURSES.PUBLISH)) {
    actions.push({
      label: 'Xuất bản',
      icon: 'i-heroicons-arrow-up-tray',
      action: () => publishCourse(props.courseId),
    });
  }

  if (hasPermission(PERMISSIONS.COURSES.DELETE)) {
    actions.push({
      label: 'Xóa',
      icon: 'i-heroicons-trash',
      action: () => deleteCourse(props.courseId),
      danger: true,
    });
  }

  return actions;
});
</script>

<template>
  <UDropdown :items="[availableActions]">
    <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" />
  </UDropdown>
</template>
```

### 3. Form Động Theo Permissions

```vue
<script setup lang="ts">
import { PERMISSIONS } from '@shared/constants';

const { hasPermission, isAdmin } = usePermissions();

// Form fields dựa trên quyền
const formFields = computed(() => {
  const fields = [
    { name: 'title', label: 'Tiêu đề', required: true },
    { name: 'description', label: 'Mô tả', required: true },
  ];

  if (hasPermission(PERMISSIONS.COURSES.UPDATE)) {
    fields.push({ name: 'content', label: 'Nội dung', required: true }, { name: 'duration', label: 'Thời lượng', required: false });
  }

  if (hasPermission(PERMISSIONS.COURSES.PUBLISH)) {
    fields.push({ name: 'publishDate', label: 'Ngày xuất bản', required: false }, { name: 'featured', label: 'Nổi bật', type: 'checkbox' });
  }

  if (isAdmin.value) {
    fields.push({ name: 'visibility', label: 'Hiển thị', type: 'select' }, { name: 'featured', label: 'Đề xuất', type: 'checkbox' });
  }

  return fields;
});

const canSaveAsDraft = hasPermission(PERMISSIONS.COURSES.UPDATE);
const canPublish = hasPermission(PERMISSIONS.COURSES.PUBLISH);
</script>

<template>
  <UForm :schema="schema" :state="formState">
    <UFormGroup v-for="field in formFields" :key="field.name" :label="field.label" :required="field.required">
      <UInput v-if="field.type !== 'checkbox'" v-model="formState[field.name]" />
      <UCheckbox v-else v-model="formState[field.name]" />
    </UFormGroup>

    <div class="flex gap-2">
      <UButton v-if="canSaveAsDraft" type="button" color="gray" @click="saveDraft"> Lưu bản nháp </UButton>

      <UButton v-if="canPublish" type="submit"> Xuất bản </UButton>
    </div>
  </UForm>
</template>
```

## Tham Khảo Nhanh

### Import Statements

```typescript
import type { RequestWithUser } from '@shared/interfaces';
import type { UserRole } from '@shared/types';
// Backend
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { requireAllPermissions, requireAnyPermission, requirePermission, requireRole } from '@middlewares/rbac.middleware';

import { PERMISSIONS } from '@shared/constants';
// Frontend
import { PERMISSIONS } from '@shared/constants';
```

### Backend Middleware Order

```typescript
// Đúng thứ tự
router.get(
  '/path',
  AuthMiddleware, // 1. Xác thực user
  requireRole('admin'), // 2. Kiểm tra vai trò
  controller.handler, // 3. Xử lý logic
);
```

### Frontend Middleware Order

```typescript
definePageMeta({
  middleware: ['auth', 'role'], // auth phải đi trước
});
```

---

**Tham khảo hướng dẫn đầy đủ tại `RBAC_HUONG_DAN.md` để hiểu sâu hơn về hệ thống RBAC!**
