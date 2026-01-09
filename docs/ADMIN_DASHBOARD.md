# Admin Dashboard Documentation

## Overview

A comprehensive admin dashboard for the TTCN2 English learning platform, built with Nuxt 4, @nuxt/ui, and TypeScript. The dashboard provides full management capabilities for users, courses, content, and system settings.

## Features

### 📊 Dashboard Overview ([/admin/index.vue](../apps/frontend/app/pages/admin/index.vue))

- **Statistics Cards**: Real-time metrics for:
  - Total Users
  - Total Courses
  - Active Courses
  - Total Lessons
- **Recent Users List**: Display of the 10 most recently registered users
- **Responsive Grid**: 4-column layout on desktop, stacked on mobile

### 👥 User Management ([/admin/users.vue](../apps/frontend/app/pages/admin/users.vue))

- **Advanced Table**: Powered by @tanstack/table-core
  - Full-text search by email
  - Role-based filtering (Student, Teacher, Admin, Superadmin)
  - Sortable columns
  - Row selection with checkboxes
  - Pagination
- **User Actions**:
  - View profile
  - Edit user
  - Delete user
- **User Display**: Avatar, full name, username, email, and role badge

### 📚 Course Management ([/admin/courses.vue](../apps/frontend/app/pages/admin/courses.vue))

- **Course Table**: Full CRUD interface
  - Search by title
  - Filter by status (Draft, Published, Archived)
  - Filter by level (Beginner, Intermediate, Advanced)
  - Sortable columns
  - Pagination
- **Course Actions**:
  - View course details
  - Edit course
  - Delete course
- **Course Display**: Title, description, level, lesson count, status badge

### 📝 Content Management ([/admin/content.vue](../apps/frontend/app/pages/admin/content.vue))

- **Content Type Cards**: Quick access to:
  - Lessons (Book icon, primary color)
  - Quizzes (Clipboard icon, success color)
  - Videos (Film icon, warning color)
  - Materials (Document icon, error color)
- **Recent Activity Timeline**: Track content creation and modifications

### ⚙️ Settings ([/admin/settings.vue](../apps/frontend/app/pages/admin/settings.vue))

- **Configuration Sections**:
  - General Settings
  - Authentication & Security
  - Email Configuration
  - Storage & Files
- **Danger Zone**: Critical actions with warnings
  - Clear application cache
  - Reset database (with irreversible warning)

## Technical Implementation

### Architecture

```
apps/frontend/
├── app/
│   ├── layouts/
│   │   └── admin.vue              # Admin layout with sidebar
│   ├── middleware/
│   │   └── admin.ts               # Role-based access control
│   ├── pages/
│   │   └── admin/
│   │       ├── index.vue          # Dashboard overview
│   │       ├── users.vue          # User management
│   │       ├── courses.vue        # Course management
│   │       ├── content.vue        # Content management
│   │       └── settings.vue       # System settings
├── server/
│   └── api/
│       └── admin/
│           ├── stats.get.ts       # Dashboard statistics
│           ├── users/
│           │   ├── index.get.ts   # List users
│           │   └── recent.get.ts  # Recent users
│           └── courses/
│               └── index.get.ts   # List courses
└── i18n/
    └── locales/
        ├── vi.json                # Vietnamese translations
        └── en.json                # English translations
```

### Tech Stack

- **Framework**: Nuxt 4 (Vue 3 with Composition API)
- **UI Library**: @nuxt/ui v4 with UDashboard components
- **State Management**: Composables with `ref`, `computed`, and `useFetch`
- **Table Library**: @tanstack/table-core for advanced table features
- **i18n**: @nuxtjs/i18n with global `$t()` helper (no composable)
- **Authentication**: nuxt-auth-utils with role-based middleware
- **Styling**: Tailwind CSS with Nuxt UI color system

### Key Components Used

#### @nuxt/ui Dashboard Components

- `<UDashboardGroup>` - Top-level dashboard container
- `<UDashboardSidebar>` - Collapsible sidebar navigation
- `<UDashboardPanel>` - Content panel wrapper
- `<UDashboardToolbar>` - Top toolbar with search and actions
- `<UDashboardPage>` - Page wrapper with header

#### @nuxt/ui General Components

- `<UTable>` - Advanced data tables
- `<UPageCard>` - Card layout for content sections
- `<UBadge>` - Status and role indicators
- `<UButton>` - Action buttons
- `<UAvatar>` - User avatars
- `<UInput>` - Search inputs
- `<USelectMenu>` - Dropdown filters
- `<UDropdownMenu>` - Action menus

### Middleware Protection

All admin routes are protected by the `admin` middleware ([/app/middleware/admin.ts](../apps/frontend/app/middleware/admin.ts)):

```typescript
export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, user } = useUserSession();

  if (!loggedIn.value) {
    return navigateTo('/login');
  }

  // Only admin and superadmin can access
  if (user.value?.role !== 'admin' && user.value?.role !== 'superadmin') {
    return navigateTo('/');
  }
});
```

Each admin page includes the middleware in `definePageMeta`:

```typescript
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
});
```

### API Endpoints

#### Dashboard Statistics

```typescript
GET / api / admin / stats;
Response: {
  totalUsers: number;
  totalCourses: number;
  activeCourses: number;
  totalLessons: number;
}
```

#### Recent Users

```typescript
GET /api/admin/users/recent
Response: BackendUser[]  // Last 10 users by createdAt
```

#### Users List

```typescript
GET /api/admin/users?search=&role=&page=1&limit=10
Response: BackendUser[]
```

#### Courses List

```typescript
GET /api/admin/courses?search=&status=&level=&page=1&limit=10
Response: Course[]
```

### Internationalization (i18n)

The dashboard supports Vietnamese and English with translation keys under the `ADMIN` namespace:

```json
{
  "ADMIN": {
    "NAV": {
      "DASHBOARD": "Dashboard",
      "USERS": "Users",
      "COURSES": "Courses",
      "CONTENT": "Content",
      "SETTINGS": "Settings"
    },
    "STATS": {
      "TOTAL_USERS": "Total Users",
      "TOTAL_COURSES": "Total Courses",
      "ACTIVE_COURSES": "Active Courses",
      "TOTAL_LESSONS": "Total Lessons"
    }
    // ... more keys
  }
}
```

Usage in templates:

```vue
<template>
  <h1>{{ $t('ADMIN.WELCOME') }}</h1>
</template>
```

**Important**: Do NOT use the `useI18n()` composable. Always use the global `$t()` helper in templates.

### Type Safety

The dashboard uses proper TypeScript types:

```typescript
import type { User as BackendUser } from '@shared/interfaces';
import type { TableColumn } from '@nuxt/ui';
import type { Row } from '@tanstack/table-core';

// Alias to avoid conflict with nuxt-auth-utils User type
const { data } = await useFetch<BackendUser[]>('/api/admin/users');

const columns: TableColumn<BackendUser>[] = [
  {
    accessorKey: 'fullName',
    header: 'Name',
    cell: ({ row }) => row.original.fullName,
  },
  // ...
];
```

## Development Guidelines

### Adding a New Admin Page

1. **Create the page** in `apps/frontend/app/pages/admin/`:

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  title: 'My Feature',
  middleware: ['admin'],
});

// Your logic here
</script>

<template>
  <UDashboardPanel id="admin-my-feature">
    <UDashboardPage>
      <template #header>
        <UDashboardPageHeader :title="$t('ADMIN.MY_FEATURE.TITLE')" :description="$t('ADMIN.MY_FEATURE.SUBTITLE')" />
      </template>

      <!-- Your content -->
    </UDashboardPage>
  </UDashboardPanel>
</template>
```

2. **Add i18n keys** in `apps/frontend/i18n/locales/vi.json` and `en.json`:

```json
{
  "ADMIN": {
    "MY_FEATURE": {
      "TITLE": "My Feature",
      "SUBTITLE": "Manage my feature"
    }
  }
}
```

3. **Add navigation item** in `apps/frontend/app/layouts/admin.vue`:

```typescript
const items: NavigationMenuItem[][] = [
  [
    // ... existing items
    {
      label: 'My Feature',
      icon: 'i-heroicons-sparkles',
      to: '/admin/my-feature',
    },
  ],
];
```

4. **Create API endpoint** in `apps/frontend/server/api/admin/`:

```typescript
export default defineEventHandler(async event => {
  const query = getQuery(event);
  // Your logic
  return await useAPI(event, '/your-backend-endpoint', {
    query,
  });
});
```

### Styling Guidelines

The dashboard follows a consistent color system:

- **Primary** (`primary`): Main actions, active states
- **Success** (`success`): Positive actions, published status
- **Warning** (`warning`): Caution, intermediate status
- **Error** (`error`): Destructive actions, error states
- **Neutral** (`neutral`): Default, inactive states

Use Tailwind utilities and Nuxt UI colors:

```vue
<UBadge color="success" variant="subtle">Published</UBadge>
<UButton color="primary" variant="solid">Save</UButton>
```

### Best Practices

1. **Always use middleware protection** on admin routes
2. **Use BackendUser alias** to avoid type conflicts
3. **Use global `$t()`** instead of `useI18n()` composable
4. **Handle loading states** with `useFetch` status
5. **Implement proper error handling** with try-catch and toast notifications
6. **Use pagination** for large data sets
7. **Add search and filters** for better UX
8. **Follow responsive design** patterns (mobile-first)

## Testing

### Manual Testing Checklist

- [ ] Login as admin/superadmin user
- [ ] Verify non-admin users cannot access `/admin/*`
- [ ] Check dashboard statistics load correctly
- [ ] Test user table search and filters
- [ ] Test course table search and filters
- [ ] Verify pagination works on tables
- [ ] Test sidebar collapse/expand
- [ ] Verify logout functionality
- [ ] Check responsive design on mobile
- [ ] Verify i18n translations in both languages

### Access Testing

```bash
# Login as admin
curl -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Access admin dashboard
curl http://localhost:3333/admin
```

## Future Enhancements

### Planned Features

- [ ] Real-time notifications with WebSocket
- [ ] Bulk user operations (import, export, delete)
- [ ] Course duplication and templates
- [ ] Content scheduling and publishing calendar
- [ ] Analytics and reporting dashboards
- [ ] Audit logs for admin actions
- [ ] Email campaign management
- [ ] System health monitoring

### Performance Optimizations

- [ ] Implement virtual scrolling for large tables
- [ ] Add data caching with SWR strategy
- [ ] Lazy load heavy components
- [ ] Optimize API queries with pagination
- [ ] Add skeleton loaders for better perceived performance

## Troubleshooting

### Common Issues

**Problem**: TypeScript error "Property 'name' does not exist on type 'User'"

**Solution**: Use `BackendUser` alias to avoid conflict with nuxt-auth-utils User type:

```typescript
import type { User as BackendUser } from '@shared/interfaces';
```

**Problem**: i18n keys not resolving

**Solution**: Check translation keys exist in both `vi.json` and `en.json`. Use `$t()` in templates, not `useI18n()`.

**Problem**: Middleware not protecting routes

**Solution**: Ensure `middleware: ['admin']` is in `definePageMeta` and user has correct role.

**Problem**: Table not updating after data change

**Solution**: Use `refresh()` from `useFetch` or trigger re-fetch:

```typescript
const { data, refresh } = await useFetch('/api/admin/users');

async function handleDelete() {
  await deleteUser();
  await refresh();
}
```

## Resources

- [Nuxt 4 Documentation](https://nuxt.com)
- [@nuxt/ui Documentation](https://ui.nuxt.com)
- [TanStack Table Docs](https://tanstack.com/table/latest)
- [nuxt-auth-utils](https://github.com/Atinux/nuxt-auth-utils)
- [Project Architecture](./ARCHITECTURE.md)

## Contributors

Maintained by the TTCN2 development team. For questions or issues, please open a GitHub issue.

---

_Last updated: 2026-01-08_
