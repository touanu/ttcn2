# Translation Restructuring - Implementation Checklist

## ✅ Phase 1: File Restructuring (COMPLETED)

- [x] Analyzed original en.json structure (789 lines)
- [x] Scanned codebase to find all translation key usages (150+ matches found)
- [x] Designed new hierarchical structure with FIELDS/ACTIONS/MODALS/MESSAGES/ERRORS/SUCCESS pattern
- [x] Reorganized en.json with new structure (862 lines)
- [x] Reorganized vi.json with new structure (832 lines)
- [x] Verified both files deployed successfully
- [x] Created comprehensive migration guide with old→new key mappings

## ⏳ Phase 2: Component Reference Updates (IN PROGRESS)

### Frontend Components to Update

- [ ] `apps/frontend/app/components/admin/users/DeleteModal.vue`
- [ ] `apps/frontend/app/components/admin/users/EditModal.vue`
- [ ] `apps/frontend/app/components/admin/users/AddModal.vue`
- [ ] `apps/frontend/app/components/admin/courses/DeleteModal.vue`
- [ ] `apps/frontend/app/components/admin/courses/ViewModal.vue`
- [ ] `apps/frontend/app/components/admin/courses/AddModal.vue`
- [ ] `apps/frontend/app/components/admin/classes/ViewModal.vue`
- [ ] `apps/frontend/app/components/admin/classes/DeleteModal.vue`
- [ ] `apps/frontend/app/components/admin/classes/AddModal.vue`
- [ ] `apps/frontend/app/components/auth/LoginForm.vue`
- [ ] `apps/frontend/app/components/auth/RegisterForm.vue`
- [ ] `apps/frontend/app/components/auth/OtpForm.vue`
- [ ] `apps/frontend/app/components/**/*.vue` (scan for remaining usage)

### Pages to Update

- [ ] `apps/frontend/app/pages/admin/users.vue`
- [ ] `apps/frontend/app/pages/admin/courses.vue`
- [ ] `apps/frontend/app/pages/admin/classes.vue`
- [ ] `apps/frontend/app/pages/admin/index.vue`
- [ ] `apps/frontend/app/pages/index.vue`
- [ ] `apps/frontend/app/pages/**/*.vue` (scan for all translations)

### Layouts to Update

- [ ] `apps/frontend/app/layouts/default.vue`
- [ ] `apps/frontend/app/layouts/admin.vue`
- [ ] `apps/frontend/app/layouts/profile.vue`
- [ ] `apps/frontend/app/layouts/*.vue` (all layout files)

### Server/API Routes to Update

- [ ] `apps/frontend/server/**/*.ts` (if any translation references)
- [ ] `apps/frontend/app/utils/**/*.ts` (utility functions using $t)
- [ ] `apps/frontend/app/composables/**/*.ts` (composables with translations)

## ⏳ Phase 3: Schema Validation Updates (IN PROGRESS)

### Validation Message References

- [ ] `packages/schemas/user.ts` (Line ~72: FORMS.EITHER_EMAIL_OR_USERNAME_REQUIRED)
  - Update to: `FORMS.VALIDATION.EITHER_EMAIL_OR_USERNAME_REQUIRED`

- [ ] `packages/schemas/otp.ts` (Line ~32: FORMS.EITHER_OTP_OR_HASH_REQUIRED)
  - Update to: `FORMS.VALIDATION.EITHER_OTP_OR_HASH_REQUIRED`

- [ ] `packages/schemas/**/*.ts` (scan all for translation references)

## ⏳ Phase 4: Testing & Validation (NOT STARTED)

### Manual Testing

- [ ] [ ] Run `pnpm dev` and verify app starts without errors
- [ ] [ ] Test login page - verify English translations work
- [ ] [ ] Test login page - verify Vietnamese translations work
- [ ] [ ] Test register page - verify all form labels and messages
- [ ] [ ] Test admin dashboard - verify all sections load
- [ ] [ ] Test admin users page - verify all buttons and modals
- [ ] [ ] Test admin courses page - verify all course operations
- [ ] [ ] Test admin classes page - verify all class operations
- [ ] [ ] Test user profile page - verify profile translations
- [ ] [ ] Test footer - verify footer translations
- [ ] [ ] Test all modals and dialogs show correct text
- [ ] [ ] Verify no console errors related to missing translation keys

### Console Check

- [ ] [ ] No "missing translation key" errors in browser console
- [ ] [ ] No warnings about undefined translation values
- [ ] [ ] All page loads complete without issues

## ⏳ Phase 5: Documentation (NOT STARTED)

### Updating Existing Documentation

- [ ] [ ] Update README.md if it mentions translation structure
- [ ] [ ] Add comments to en.json explaining sections (format: // comments for developers)
- [ ] [ ] Add comments to vi.json with same structure
- [ ] [ ] Create translation contributor guide for future maintainers

### New Documentation to Create

- [ ] [ ] Create `docs/TRANSLATIONS.md` with:
  - How to add new translation strings
  - Naming conventions
  - Structure guidelines
  - Examples for each section type

## ⏳ Phase 6: Git & Deployment (NOT STARTED)

### Version Control

- [ ] [ ] Create feature branch: `feature/translate-restructure`
- [ ] [ ] Stage all changes
- [ ] [ ] Commit with message: "refactor: restructure translation keys for better maintainability"
- [ ] [ ] Push to remote
- [ ] [ ] Create pull request with:
  - Summary of changes
  - Link to TRANSLATION_KEYS_MIGRATION_GUIDE.md
  - Testing checklist

### Pre-Merge Review

- [ ] [ ] All component updates reviewed
- [ ] [ ] No translation keys left in old format
- [ ] [ ] All tests pass
- [ ] [ ] Team approval received

### Deployment

- [ ] [ ] Merge to main/develop branch
- [ ] [ ] Deploy to staging environment
- [ ] [ ] Final smoke test on staging
- [ ] [ ] Deploy to production

---

## 📊 Statistics

| Metric               | Value      | Notes                           |
| -------------------- | ---------- | ------------------------------- |
| Original Keys        | ~50+       | Top-level sections              |
| New Keys             | ~300+      | Better organized hierarchy      |
| Components to Update | ~40+       | Estimated based on grep results |
| Translation Files    | 2          | en.json, vi.json                |
| Migration Guide Size | 300+ lines | Complete old→new mapping        |

---

## 🔍 Key Pattern Updates

### Admin Section Pattern

```typescript
// OLD PATTERN
ADMIN.USERS.COPY_USER_ID;
ADMIN.USERS.USER_ID_COPIED;
ADMIN.USERS.CANNOT_DELETE_ADMIN;

// NEW PATTERN
ADMIN.USERS.ACTIONS.COPY_USER_ID;
ADMIN.USERS.MESSAGES.USER_ID_COPIED;
ADMIN.USERS.ERRORS.CANNOT_DELETE_ADMIN;
```

### Form Validation Pattern

```typescript
// OLD
FORMS.INVALID_EMAIL;
FORMS.EITHER_EMAIL_OR_USERNAME_REQUIRED;

// NEW
FORMS.VALIDATION.INVALID_EMAIL;
FORMS.VALIDATION.EITHER_EMAIL_OR_USERNAME_REQUIRED;
```

### Modal Content Pattern

```typescript
// OLD - scattered across file
(ADD_USER_TITLE, ADD_USER_DESC, DELETE_CONFIRMATION);

// NEW - grouped under MODALS
ADMIN.USERS.MODALS.ADD_USER_TITLE;
ADMIN.USERS.MODALS.ADD_USER_DESC;
ADMIN.USERS.MODALS.DELETE_CONFIRMATION;
```

---

## 📝 Notes for Implementation

### Search & Replace Patterns

Use these regex patterns to find and update references:

```regex
// Find OLD format
ADMIN\.USERS\.([A-Z_]+)

// Replace with appropriate NEW format
ADMIN.USERS.ACTIONS.$1  // for action buttons
ADMIN.USERS.MESSAGES.$1  // for info messages
ADMIN.USERS.ERRORS.$1    // for error messages
ADMIN.USERS.SUCCESS.$1   // for success messages
```

### Common Substitutions

| Old Pattern       | New Pattern                | Type    |
| ----------------- | -------------------------- | ------- |
| `COPY_*_ID`       | `ACTIONS.COPY_*_ID`        | Action  |
| `*_CREATED`       | `SUCCESS.*_CREATED`        | Success |
| `*_UPDATED`       | `SUCCESS.*_UPDATED`        | Success |
| `CANNOT_DELETE_*` | `ERRORS.CANNOT_DELETE_*`   | Error   |
| `*_FAILED`        | `ERRORS.*_FAILED`          | Error   |
| `*_SUCCESS`       | `SUCCESS.*` (trim SUCCESS) | Success |
| `*_CONFIRMATION`  | `MODALS.*_CONFIRMATION`    | Modal   |
| `*_DESC`          | `MODALS.*_DESC`            | Modal   |

---

## 🚨 Blockers / Issues

- [ ] None currently identified

---

## ✨ Achievements So Far

✅ **Phase 1 Complete**: Both translation files successfully restructured
✅ **Documentation**: Complete migration guide created
✅ **Planning**: Clear roadmap for remaining phases

**Estimated Remaining Effort:**

- Phase 2 (Component Updates): 4-6 hours
- Phase 3 (Schema Updates): 30 minutes
- Phase 4 (Testing): 2-3 hours
- Phase 5 (Documentation): 1 hour
- Phase 6 (Deployment): 30 minutes

**Total Estimated Time**: ~8-11 hours

---

**Created:** January 20, 2026
**Last Updated:** January 20, 2026
**Status:** Phase 1 ✅ Complete, Phase 2-6 ⏳ Queued
