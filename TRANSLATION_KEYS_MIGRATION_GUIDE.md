# Translation Keys Restructuring Guide

## Overview

This document describes the comprehensive restructuring of translation keys in the TTCN2 project. The restructuring improves maintainability, organization, and declarative clarity of the language files.

## Key Changes

### New Hierarchical Structure

The translation keys have been reorganized from a flat structure to a clear, semantic hierarchy:

```
COMMON/
  ├── LABELS/        # UI action labels
  ├── STATUSES/      # Status indicators
  ├── FIELDS/        # Field names
  └── DAYS/          # Days of the week

ALERTS/
  ├── SUCCESS/       # Success messages
  ├── ERROR/         # Error messages
  └── MESSAGES/      # Generic messages

FORMS/
  ├── SHARED/        # Shared form utilities
  ├── EMAIL/         # Email field
  ├── PASSWORD/      # Password field
  ├── CONFIRM_PASSWORD/
  ├── USERNAME/
  ├── FULLNAME/
  ├── PHONE/
  ├── OTP/
  ├── HASH/
  └── VALIDATION/    # Validation messages

AUTH/
  ├── LOGIN/
  ├── REGISTER/
  ├── LOGOUT/
  ├── PASSWORD_RESET/
  ├── EMAIL_VERIFICATION/
  ├── PERMISSIONS/
  ├── TOKENS/
  └── EMAIL/

NAVIGATION/
  └── USER_ACTIONS/  # User dropdown menu

ROLES/                # Role definitions

LEVELS/               # Skill levels

STATUSES/
  ├── COURSE/
  ├── CLASS/
  └── EMAIL/

ADMIN/
  ├── ACTIONS/       # Admin action buttons
  ├── STATS/
  ├── USERS/
  │   ├── FIELDS/
  │   ├── ACTIONS/
  │   ├── MODALS/
  │   ├── MESSAGES/
  │   ├── ERRORS/
  │   └── SUCCESS/
  ├── COURSES/
  │   ├── FIELDS/
  │   ├── ACTIONS/
  │   ├── MODALS/
  │   ├── MESSAGES/
  │   ├── ERRORS/
  │   ├── SUCCESS/
  │   └── ENROLLMENT/
  ├── CLASSES/
  │   ├── FIELDS/
  │   ├── ACTIONS/
  │   ├── MODALS/
  │   ├── MESSAGES/
  │   ├── ERRORS/
  │   └── SUCCESS/
  ├── CONTENT/
  └── SETTINGS/

COURSES/
  ├── FIELDS/
  ├── ACTIONS/
  ├── STATUSES/
  ├── DETAILS/
  └── MESSAGES/

CLASSES/
  ├── FIELDS/
  ├── STATUSES/
  └── ACTIONS/

ENROLLMENT/
  ├── MESSAGES/
  └── STATUSES/

PROFILE/
  ├── OVERVIEW/      # Dashboard overview
  ├── SETTINGS/      # Account settings
  ├── SECURITY/
  ├── MESSAGES/
  └── ERRORS/

PAGES/
  ├── HOME/
  ├── CONTACT/
  ├── TEAM/
  ├── ROADMAP/
  ├── BLOG/
  ├── HELP/
  ├── ABOUT/
  ├── CAREERS/
  └── SETTINGS/

FOOTER/
  ├── ABOUT/
  ├── SUPPORT/
  └── NEWSLETTER/

MEDIA/

CONFIG/
```

## Migration Path: Old Keys → New Keys

### Core Changes

| Old Key                             | New Key                           | Context                   |
| ----------------------------------- | --------------------------------- | ------------------------- |
| `MESSAGES.*`                        | `ALERTS.MESSAGES.*`               | Generic resource messages |
| `ERRORS.*`                          | `ALERTS.ERROR.*`                  | Error-related messages    |
| `SUCCESS_TITLE`                     | `ALERTS.SUCCESS.TITLE`            | Success alert title       |
| `STATUS.*`                          | `STATUSES.*`                      | Status enumerations       |
| `FORMS.SEARCH_PLACEHOLDER`          | `FORMS.SHARED.SEARCH_PLACEHOLDER` | Shared form placeholders  |
| `FORMS.REMEMBER_ME`                 | `FORMS.SHARED.REMEMBER_ME`        | Shared form utilities     |
| `NAVIGATION.USER.ACTION_MENU_TITLE` | `NAVIGATION.USER_ACTIONS.TITLE`   | Navigation user actions   |
| `NAVIGATION.USER.DROPDOWN.*`        | `NAVIGATION.USER_ACTIONS.*`       | User action dropdown      |

### Authentication Changes

| Old Key                 | New Key                                           |
| ----------------------- | ------------------------------------------------- |
| `AUTH.BUTTON.LOGIN`     | `AUTH.LOGIN.BUTTON`                               |
| `AUTH.BUTTON.REGISTER`  | `AUTH.REGISTER.BUTTON`                            |
| `AUTH.LOGIN.*`          | Kept as is (all moved to `AUTH.LOGIN`)            |
| `AUTH.REGISTER.*`       | Kept as is (all moved to `AUTH.REGISTER`)         |
| `AUTH.PASSWORD_RESET.*` | `AUTH.PASSWORD_RESET.*` (consolidated)            |
| `AUTH.OTP.*`            | `AUTH.EMAIL_VERIFICATION.*` (renamed for clarity) |
| Token-related errors    | `AUTH.TOKENS.*` (grouped separately)              |
| Email status            | `AUTH.EMAIL.*` (grouped separately)               |

### Admin Section Reorganization

**Major change:** Flatter structure with clear action/message/error/success grouping

#### Users

| Old Key                    | New Key                            |
| -------------------------- | ---------------------------------- |
| `ADMIN.USERS.COPY_USER_ID` | `ADMIN.USERS.ACTIONS.COPY_USER_ID` |
| `ADMIN.USERS.VIEW_PROFILE` | `ADMIN.USERS.ACTIONS.VIEW_PROFILE` |
| `ADMIN.USERS.EDIT_USER`    | `ADMIN.USERS.ACTIONS.EDIT_USER`    |
| `ADMIN.USERS.DELETE_USER`  | `ADMIN.USERS.ACTIONS.DELETE_USER`  |
| Modal-related keys         | `ADMIN.USERS.MODALS.*`             |
| Status/Info messages       | `ADMIN.USERS.MESSAGES.*`           |
| Error messages             | `ADMIN.USERS.ERRORS.*`             |
| Success messages           | `ADMIN.USERS.SUCCESS.*`            |

#### Courses & Classes (Same Pattern)

- Grouped `FIELDS` for input fields
- Grouped `ACTIONS` for buttons/interactions
- Grouped `MODALS` for dialog content
- Grouped `MESSAGES` for informational text
- Grouped `ERRORS` for error states
- Grouped `SUCCESS` for success states

### Page-Specific Keys

**New:** All page content moved to `PAGES.*`

| Old Key                    | New Key                           |
| -------------------------- | --------------------------------- |
| `HOME.*`                   | `PAGES.HOME.*`                    |
| `CONTACT.*`                | `PAGES.CONTACT.*`                 |
| `TEAM.*`                   | `PAGES.TEAM.*`                    |
| `ROADMAP.*`                | `PAGES.ROADMAP.*`                 |
| `BLOG.*`                   | `PAGES.BLOG.*`                    |
| `HELP.*`                   | `PAGES.HELP.*`                    |
| `ABOUT.*`                  | `PAGES.ABOUT.*`                   |
| `CAREERS.*`                | `PAGES.CAREERS.*`                 |
| `SETTINGS` (user settings) | `PAGES.SETTINGS.*` (app settings) |

**Note:** Profile has dedicated section as `PROFILE` (not under PAGES)

### Profile Reorganization

| Old Key                  | New Key                             |
| ------------------------ | ----------------------------------- |
| `PROFILE.ACTIONS.*`      | `PROFILE.OVERVIEW.ACTIONS.*`        |
| `PROFILE.STATS.*`        | `PROFILE.OVERVIEW.STATS.*`          |
| `PROFILE.ACCOUNT_INFO.*` | `PROFILE.OVERVIEW.ACCOUNT_INFO.*`   |
| Password-related         | `PROFILE.SECURITY.PASSWORD.*`       |
| Delete account           | `PROFILE.SECURITY.DELETE_ACCOUNT.*` |

## Benefits of Restructuring

1. **Consistency**: All similar concepts follow the same pattern
   - All actions grouped under `ACTIONS`
   - All errors grouped under `ERRORS`
   - All success messages grouped under `SUCCESS`

2. **Scalability**: Easy to add new items without disrupting structure
   - Adding new modal dialog → just add to `*.MODALS`
   - Adding new error → just add to `*.ERRORS`

3. **Declarativeness**: Key names clearly indicate content type
   - `FIELDS` = form input labels
   - `ACTIONS` = buttons/interaction labels
   - `MESSAGES` = informational text
   - `ERRORS` = error states
   - `SUCCESS` = success states

4. **Reduced Duplication**: Shared patterns use unified paths
   - All form fields under `FORMS.*`
   - All statuses under `STATUSES.*` or `RESOURCE.STATUSES.*`
   - Common labels under `COMMON.*`

5. **Better IDE Autocomplete**: Nested structure provides better suggestion grouping

## Migration Checklist

When updating component references:

### Components to Update

- [ ] `apps/frontend/app/components/**/*.vue`
- [ ] `apps/frontend/app/layouts/**/*.vue`
- [ ] `apps/frontend/app/pages/**/*.vue`
- [ ] `apps/frontend/app/plugins/**/*.ts`
- [ ] `apps/frontend/app/utils/**/*.ts`
- [ ] `apps/frontend/server/**/*.ts`

### Files Using Schema Validation Messages

- [ ] `packages/schemas/user.ts` - Update validation error messages
- [ ] `packages/schemas/otp.ts` - Update validation error messages

### Pattern Examples

#### Before

```typescript
$t('ADMIN.USERS.COPY_USER_ID');
$t('ADMIN.USERS.USER_ID_COPIED');
$t('ADMIN.USERS.CANNOT_DELETE_ADMIN');
```

#### After

```typescript
$t('ADMIN.USERS.ACTIONS.COPY_USER_ID');
$t('ADMIN.USERS.MESSAGES.USER_ID_COPIED');
$t('ADMIN.USERS.ERRORS.CANNOT_DELETE_ADMIN');
```

## Vietnamese Translation

The same structure applies to `vi.json`. All keys remain identical; only values change to Vietnamese.

## Future Improvements

1. Add language for "getting started" flows
2. Add keys for tooltip text
3. Add keys for help text/hints
4. Consider adding `COMPONENTS` namespace for component-specific strings
5. Add structured error codes for programmatic error handling

## Notes

- All changes are **backward incompatible** - components must be updated
- No database migration required - purely frontend translation system
- Consider adding a translation key validation tool to CI/CD pipeline
- Document new keys in comments for future maintainers
