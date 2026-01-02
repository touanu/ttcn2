# GitHub Copilot Instructions for TTCN2 Project

## Project Overview

**English Platform Fullstack System (EPFS)** is an online English learning platform built with TypeScript. The system provides comprehensive features for learning and practicing English online, including user management, courses, lessons, quizzes, and progress tracking.

### Key Features

- User management (registration, authentication, profiles)
- Course and lesson management
- Quizzes and assessments
- Progress tracking
- Notifications
- Live classes

## Tech Stack

### Frontend

- **Framework:** Nuxt 4 (Vue 3 with Composition API)
- **UI Library:** @nuxt/ui (Tailwind CSS based)
- **State Management:** Pinia
- **Authentication:** nuxt-auth-utils
- **Internationalization:** @nuxtjs/i18n
- **PWA:** @vite-pwa/nuxt
- **Backend For Frontend (BFF):** Nitro server (built-in with Nuxt 4)
- **Content Management:** @nuxt/content
- **Icons:** @nuxt/icons

### Backend

- **Runtime:** Node.js 20+
- **Framework:** Express.js 5
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with bcryptjs
- **Dependency Injection:** TSyringe
- **Logging:** Pino with file rotation
- **Email:** Nodemailer with MJML templates
- **API Documentation:** Swagger

### Testing & Quality

- **API Testing:** Yaak API client
- **Unit Testing:** Vitest
- **E2E Testing:** Playwright

### Shared Packages

- **Validation:** Zod schemas
- **Package Manager:** pnpm with workspaces
- **Linting:** ESLint with @antfu/eslint-config
- **Git Hooks:** simple-git-hooks with lint-staged

## Project Structure

This is a **pnpm monorepo** with the following structure:

```
apps/
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── middlewares/   # Express middlewares
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # Route definitions
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utilities
│   │   └── templates/     # Email templates
│   └── logs/             # Application logs
└── frontend/          # Nuxt application
    ├── app/
    │   ├── components/   # Vue components
    │   ├── composables/  # Vue composables
    │   ├── layouts/      # Nuxt layouts
    │   ├── pages/        # File-based routing
    │   └── middleware/   # Route middleware
    ├── content/          # Nuxt Content
    └── server/           # Server-side code

packages/              # Shared workspace packages
├── config/           # Environment configuration
├── constants/        # Application constants
├── interfaces/       # TypeScript interfaces
├── schemas/          # Zod validation schemas
├── types/           # TypeScript type definitions
└── utils/           # Shared utilities

config/              # Environment files (.env)
scripts/             # Utility scripts
docs/                # Documentation files
```

## Development Guidelines

### Code Style & Standards

- **Language:** TypeScript with strict mode
- **Formatting:** Use ESLint with @antfu/eslint-config
- **File Naming:** kebab-case for files, PascalCase for components
- **Imports:** Use absolute imports with path aliases (`@/`, `@controllers/`, etc.)
- **Vue:** Composition API with `<script setup>` syntax
- **State:** Use Pinia stores with TypeScript
- **Commenting:** JSDoc style for functions and classes, only comment on complex logic, hack or important notes, makes use of variable name and logic to explain

### Path Aliases

**Backend:**

- `@controllers/*` → `src/controllers/*`
- `@middlewares/*` → `src/middlewares/*`
- `@models/*` → `src/models/*`
- `@routes/*` → `src/routes/*`
- `@services/*` → `src/services/*`
- `@utils/*` → `src/utils/*`

**Shared Packages:**

- `@shared/config` → `packages/config`
- `@shared/interfaces` → `packages/interfaces`
- `@shared/schemas` → `packages/schemas`
- `@shared/types` → `packages/types`
- `@shared/utils` → `packages/utils`

### Database & Models

- **ORM:** Mongoose with TypeScript
- **Validation:** Use Zod schemas from `@shared/schemas`
- **Connection:** Auto-connects on app startup
- **Models Location:** `apps/backend/src/models/`

### Authentication

- **Strategy:** JWT tokens with refresh mechanism
- **Middleware:** `auth.middleware.ts` for protected routes
- **Frontend:** nuxt-auth-utils for session management
- **OTP:** Email-based verification system

## Development Workflow

### Environment Setup

1. **Prerequisites:** Node.js 20+, pnpm, MongoDB
2. **Config:** Create `.env` file in `/config` directory (see `/config/README.md`)
3. **Install:** Run `pnpm install` from root
4. **Development:** Run `pnpm dev` to start both apps concurrently

### Available Scripts

```bash
# Root level
pnpm dev                 # Start both frontend and backend
pnpm dev:backend        # Backend only
pnpm dev:frontend       # Frontend only
pnpm lint               # Lint all code
pnpm lint:fix           # Auto-fix linting issues
pnpm clean              # Clean build artifacts and node_modules
pnpm generate:token     # Generate internal tokens for API

# Backend specific
cd apps/backend
pnpm build              # TypeScript compilation with tsc-alias
pnpm start              # Production server
pnpm dev:watch          # Development with tsx watch

# Frontend specific
cd apps/frontend
pnpm build              # Build for production
pnpm generate           # Static site generation
pnpm preview            # Preview production build
```

### VS Code Integration

- **Debug Configuration:** Pre-configured launch.json for F5 debugging
- **Recommended Extensions:** Check .vscode/extensions.json
- **Multi-target:** Can debug frontend, backend, or browser separately

## API Development Patterns

### Controllers

```typescript
// Use dependency injection with TSyringe
@injectable()
export class UserController {
  constructor(private userService: UserService) {}

  public getUsers = asyncHandler(async (req: Request, res: Response) => {
    // Implementation
  });
}
```

### Routes

```typescript
// Follow interface pattern
export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }
}
```

### Validation

```typescript
// Use Zod schemas from shared packages
import { userCreateSchema } from '@shared/schemas';
import { validationMiddleware } from '@middlewares/validation.middleware';

router.post('/users', validationMiddleware(userCreateSchema), controller.create);
```

## Common Issues & Solutions

### Build Issues

- **TypeScript Paths:** Ensure `tsc-alias` runs after `tsc` for backend builds
- **Shared Package Changes:** Run `pnpm install` after modifying shared packages
- **Import Errors:** Check if shared packages are properly referenced in package.json
- **Third-party Types:** Some web-bluetooth type errors in dependencies can be ignored - use `pnpm dev` instead of build for development

### Development Issues

- **MongoDB Connection:** Verify `.env` configuration and ensure MongoDB is running
- **Port Conflicts:** Default ports are 3000 (backend) and 3333 (frontend)
- **Email Testing:** Use MailDev (localhost:1080) when `MAILDEV_ENABLED=true`
- **Logging:** Use simple string messages with Pino logger: `logger.info('message')`, `logger.error('error message')`

### Performance

- **Large Payloads:** Use pagination and streaming for large datasets
- **Database:** Index frequently queried fields, avoid N+1 queries
- **Frontend:** Use lazy loading, code splitting, and proper caching

## Testing & Quality

### Linting

- **Pre-commit Hooks:** Automatic linting with simple-git-hooks
- **Configuration:** ESLint with Vue, TypeScript, and Nuxt support
- **Formatting:** Runs on staged files via lint-staged

### API Testing

- **Tool:** Yaak API client (configurations in `/yaak/`)
- **Documentation:** Auto-generated Swagger docs available in development
- **Postman Alternative:** Use Yaak for testing API endpoints

## Resources

- scripts folder
  - generateInternalToken.ts: Generate internal API tokens
  - Create more as needed
- MCP servers
  - Nuxt: understand and assist with Nuxt development

## Deployment Notes

### Environment Files

- **Location:** `/config/` directory
- **Patterns:** `.env`, `.env.development`, `.env.local`
- **Secrets:** Use strong secrets for JWT tokens and database credentials

### Build Process

- **Backend:** TypeScript compilation with alias resolution
- **Frontend:** Nuxt build with static generation support
- **Assets:** Proper handling of static files and media uploads

### Security

- **CORS:** Configured for multiple origins
- **Rate Limiting:** Built-in middleware protection
- **Headers:** Helmet.js for security headers
- **Validation:** Input sanitization with Zod schemas

## Tips for Efficient Development

1. **Use Shared Packages:** Always check existing interfaces, types, and utilities before creating new ones
2. **Follow Patterns:** Look at existing controllers, services, and components for consistent patterns
3. **Type Safety:** Leverage TypeScript and Zod for runtime and compile-time safety
4. **Hot Reload:** Both apps support hot reload - changes reflect immediately
5. **Debugging:** Use VS Code debugger with F5 for step-by-step debugging
6. **Documentation:** Update relevant docs when adding new features or changing APIs

---

_This document is maintained to help developers understand and contribute to the TTCN2 project efficiently. Update as the project evolves._
