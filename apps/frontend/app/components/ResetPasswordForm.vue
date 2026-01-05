<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import type { PasswordOnlyDto } from '@shared/schemas/user'
import { onlyPasswordResetSchema } from '@shared/schemas/user'

defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: FormSubmitEvent<PasswordOnlyDto>]
  backToLogin: []
}>()

const passwordFields: AuthFormField[] = [{
  name: 'newPassword',
  type: 'password',
  label: $t('AUTH.PASSWORD_RESET.NEW_PASSWORD_LABEL'),
  placeholder: $t('AUTH.PASSWORD_RESET.NEW_PASSWORD_PLACEHOLDER'),
  required: true,
}]

const validateForm = createFormValidator(onlyPasswordResetSchema)

function onSubmit(payload: FormSubmitEvent<PasswordOnlyDto>): void {
  emit('submit', payload)
}

function backToLogin(): void {
  emit('backToLogin')
}
</script>

<template>
  <UAuthForm
    :schema="onlyPasswordResetSchema"
    :validate="validateForm"
    :title="$t('AUTH.PASSWORD_RESET.TITLE')"
    :description="$t('AUTH.PASSWORD_RESET.DESCRIPTION')"
    icon="i-lucide-lock-keyhole"
    :fields="passwordFields"
    :loading="loading"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t('AUTH.PASSWORD_RESET.DESCRIPTION') }}
    </template>

    <template #footer>
      <div class="text-center">
        {{ $t('AUTH.PASSWORD_RESET.REMEMBER_PASSWORD') }}
        <ULink
          class="text-primary font-medium cursor-pointer hover:underline"
          @click.prevent="backToLogin"
        >
          {{ $t('AUTH.BUTTON.LOGIN') }}
        </ULink>
      </div>
    </template>
  </UAuthForm>
</template>
