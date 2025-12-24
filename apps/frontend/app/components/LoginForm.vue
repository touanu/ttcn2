<script setup lang="ts">
import type { LoginSchema } from '#shared/schemas/auth.schema'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import { loginSchema } from '#shared/schemas/auth.schema'

const emit = defineEmits<{
  submit: [payload: FormSubmitEvent<LoginSchema>]
  switchToRegister: []
}>()

const loginFields: AuthFormField[] = [{
  name: 'username',
  type: 'text',
  label: $t('USERNAME_LABEL'),
  placeholder: $t('USERNAME_PLACEHOLDER'),
  required: true,
}, {
  name: 'password',
  label: $t('PASSWORD_LABEL'),
  type: 'password',
  placeholder: $t('PASSWORD_PLACEHOLDER'),
  required: true,
}, {
  name: 'remember',
  label: $t('REMEMBER_ME_LABEL'),
  type: 'checkbox',
}]

const validateForm = createFormValidator(loginSchema)

function onSubmit(payload: FormSubmitEvent<LoginSchema>): void {
  emit('submit', payload)
}

function switchToRegister(): void {
  emit('switchToRegister')
}
</script>

<template>
  <UAuthForm
    :schema="loginSchema"
    :validate="validateForm"
    :title="$t('LOGIN_MODAL_TITLE')"
    :description="$t('LOGIN_MODAL_DESCRIPTION')"
    icon="i-lucide-user"
    :fields="loginFields"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t('NO_ACCOUNT_TEXT') }}
      <ULink
        class="text-primary font-medium cursor-pointer hover:underline"
        @click.prevent="switchToRegister"
      >
        {{ $t('BUTTON_REGISTER_TEXT') }}
      </ULink>.
    </template>

    <template #password-hint>
      <ULink to="#" class="text-primary font-medium" tabindex="-1">
        {{ $t('FORGOT_PASSWORD_TEXT') }}
      </ULink>
    </template>

    <template #footer>
      {{ $t('TERMS_OF_SERVICE_TEXT') }} <ULink to="#" class="text-primary font-medium">
        {{ $t('SUPPORT_TERMS_OF_SERVICE') }}
      </ULink>.
    </template>
  </UAuthForm>
</template>
