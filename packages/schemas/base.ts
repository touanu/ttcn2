import z from 'zod'

// Base schema definitions - these must be defined before being used in other schemas
export const usernameSchema = z
  .string('FORMS.USERNAME.REQUIRED')
  .min(3, 'FORMS.USERNAME.MIN_LENGTH')
  .max(30, 'VALIDATION_USERNAME_MAX')

export const passwordSchema = z
  .string('FORMS.PASSWORD.REQUIRED')
  .min(8, 'FORMS.PASSWORD.MIN_LENGTH')
  .max(64, 'VALIDATION_PASSWORD_MAX')
  .regex(/[A-Z]/, 'FORMS.PASSWORD.UPPERCASE_REQUIRED')
  .regex(/[a-z]/, 'FORMS.PASSWORD.LOWERCASE_REQUIRED')
  .regex(/\d/, 'FORMS.PASSWORD.NUMBER_REQUIRED')
  .regex(/[\W_]/, 'FORMS.PASSWORD.SPECIAL_CHARACTER_REQUIRED')

export const emailSchema = z.email('FORMS.EMAIL.INVALID')
