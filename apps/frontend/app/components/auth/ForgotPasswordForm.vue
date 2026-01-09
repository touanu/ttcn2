<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import type { PasswordResetDto } from '@shared/schemas/user'

defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: FormSubmitEvent<PasswordResetDto>]
  resendOtp: []
  backToLogin: []
}>()

const emailFields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: $t('FORMS.EMAIL.LABEL'),
  placeholder: $t('FORMS.EMAIL.PLACEHOLDER'),
  required: true,
}]

function onSubmit(payload: FormSubmitEvent<PasswordResetDto>): void {
  emit('submit', payload)
}
</script>

<template>
  <UAuthForm
    :title="$t('AUTH.PASSWORD_RESET.TITLE')"
    :description="$t('AUTH.PASSWORD_RESET.DESCRIPTION')"
    icon="i-lucide-mail-check"
    :fields="emailFields"
    :loading="loading"
    @submit="onSubmit"
  >
    <template #description />

    <template #footer />
  </UAuthForm>
</template>
