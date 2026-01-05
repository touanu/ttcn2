<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import type { LoginUserDto } from '@shared/schemas/auth'
import { loginUserSchema } from '@shared/schemas/auth'

defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: FormSubmitEvent<LoginUserDto>]
  switchToRegister: []
  switchToForgotPassword: []
}>()

const loginFields: AuthFormField[] = [{
  name: 'username',
  type: 'text',
  label: $t('FORMS.USERNAME.LABEL'),
  placeholder: $t('FORMS.USERNAME.PLACEHOLDER'),
  required: true,
}, {
  name: 'password',
  label: $t('FORMS.PASSWORD.LABEL'),
  type: 'password',
  placeholder: $t('FORMS.PASSWORD.PLACEHOLDER'),
  required: true,
}, {
  name: 'remember',
  label: $t('FORMS.REMEMBER_ME'),
  type: 'checkbox',
}]

const validateForm = createFormValidator(loginUserSchema)

function onSubmit(payload: FormSubmitEvent<LoginUserDto>): void {
  emit('submit', payload)
}

function switchToRegister(): void {
  emit('switchToRegister')
}

function switchToForgotPassword(): void {
  emit('switchToForgotPassword')
}
</script>

<template>
  <UAuthForm
    :schema="loginUserSchema"
    :validate="validateForm"
    :title="$t('AUTH.LOGIN.TITLE')"
    :description="$t('AUTH.LOGIN.DESCRIPTION')"
    icon="i-lucide-user"
    :fields="loginFields"
    :loading="loading"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t('AUTH.LOGIN.NO_ACCOUNT') }}
      <ULink
        class="text-primary font-medium cursor-pointer hover:underline"
        @click.prevent="switchToRegister"
      >
        {{ $t('AUTH.BUTTON.REGISTER') }}
      </ULink>.
    </template>

    <template #password-hint>
      <ULink
        class="text-primary font-medium cursor-pointer hover:underline"
        @click.prevent="switchToForgotPassword"
      >
        {{ $t('AUTH.LOGIN.FORGOT_PASSWORD') }}
      </ULink>
    </template>

    <template #footer>
      {{ $t('AUTH.TERMS_AGREEMENT') }} <ULink to="#" class="text-primary font-medium">
        {{ $t('LEGAL.TERMS_OF_SERVICE') }}
      </ULink>.
    </template>
  </UAuthForm>
</template>
