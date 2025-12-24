<script setup lang="ts">
import type { RegisterSchema } from '#shared/schemas/auth.schema'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import { registerSchema } from '#shared/schemas/auth.schema'

const emit = defineEmits<{
  submit: [payload: FormSubmitEvent<RegisterSchema>]
  switchToLogin: []
}>()

const registerFields: AuthFormField[] = [{
  name: 'fullName',
  type: 'text',
  label: $t('REGISTER_NAME_LABEL'),
  placeholder: $t('REGISTER_NAME_PLACEHOLDER'),
  required: true,
}, {
  name: 'username',
  type: 'text',
  label: $t('USERNAME_LABEL'),
  placeholder: $t('USERNAME_PLACEHOLDER'),
  required: true,
}, {
  name: 'email',
  type: 'email',
  label: $t('EMAIL_LABEL'),
  placeholder: $t('EMAIL_PLACEHOLDER'),
  required: true,
}, {
  name: 'password',
  label: $t('PASSWORD_LABEL'),
  type: 'password',
  placeholder: $t('PASSWORD_PLACEHOLDER'),
  required: true,
}, {
  name: 'confirmPassword',
  label: $t('CONFIRM_PASSWORD_LABEL'),
  type: 'password',
  placeholder: $t('CONFIRM_PASSWORD_PLACEHOLDER'),
  required: true,
}]

const validateForm = createFormValidator(registerSchema)

function onSubmit(payload: FormSubmitEvent<RegisterSchema>): void {
  emit('submit', payload)
}

function switchToLogin(): void {
  emit('switchToLogin')
}
</script>

<template>
  <UAuthForm
    :schema="registerSchema"
    :validate="validateForm"
    :title="$t('REGISTER_MODAL_TITLE')"
    :description="$t('REGISTER_MODAL_DESCRIPTION')"
    icon="i-lucide-user-plus"
    :fields="registerFields"
    :submit-button="{ label: $t('BUTTON_REGISTER_TEXT') }"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t('ALREADY_HAVE_ACCOUNT_TEXT') }}
      <ULink
        class="text-primary font-medium cursor-pointer hover:underline"
        @click.prevent="switchToLogin"
      >
        {{ $t('BUTTON_LOGIN_TEXT') }}
      </ULink>.
    </template>

    <template #footer>
      {{ $t('TERMS_OF_SERVICE_TEXT') }} <ULink to="#" class="text-primary font-medium">
        {{ $t('SUPPORT_TERMS_OF_SERVICE') }}
      </ULink>.
    </template>
  </UAuthForm>
</template>
