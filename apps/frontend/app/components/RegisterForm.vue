<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import type { CreateUserDto } from '@shared/schemas/user'
import { createUserSchema } from '@shared/schemas/user'

const emit = defineEmits<{
  submit: [payload: FormSubmitEvent<CreateUserDto>]
  switchToLogin: []
}>()

const registerFields: AuthFormField[] = [{
  name: 'fullName',
  type: 'text',
  label: $t('FORMS.FULLNAME.LABEL'),
  placeholder: $t('FORMS.FULLNAME.PLACEHOLDER'),
  required: true,
}, {
  name: 'username',
  type: 'text',
  label: $t('FORMS.USERNAME.LABEL'),
  placeholder: $t('FORMS.USERNAME.PLACEHOLDER'),
  required: true,
}, {
  name: 'email',
  type: 'email',
  label: $t('FORMS.EMAIL.LABEL'),
  placeholder: $t('FORMS.EMAIL.PLACEHOLDER'),
  required: true,
}, {
  name: 'password',
  label: $t('FORMS.PASSWORD.LABEL'),
  type: 'password',
  placeholder: $t('FORMS.PASSWORD.PLACEHOLDER'),
  required: true,
}]

const validateForm = createFormValidator(createUserSchema)

function onSubmit(payload: FormSubmitEvent<CreateUserDto>): void {
  emit('submit', payload)
}

function switchToLogin(): void {
  emit('switchToLogin')
}
</script>

<template>
  <UAuthForm
    :schema="createUserSchema"
    :validate="validateForm"
    :title="$t('AUTH.REGISTER.TITLE')"
    :description="$t('AUTH.REGISTER.DESCRIPTION')"
    icon="i-lucide-user-plus"
    :fields="registerFields"
    :submit-button="{ label: $t('AUTH.BUTTON.REGISTER') }"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t('AUTH.REGISTER.ALREADY_HAVE_ACCOUNT') }}
      <ULink
        class="text-primary font-medium cursor-pointer hover:underline"
        @click.prevent="switchToLogin"
      >
        {{ $t('AUTH.BUTTON.LOGIN') }}
      </ULink>.
    </template>

    <template #footer>
      {{ $t('AUTH.TERMS_AGREEMENT') }} <ULink to="#" class="text-primary font-medium">
        {{ $t('LEGAL.TERMS_OF_SERVICE') }}
      </ULink>.
    </template>
  </UAuthForm>
</template>
