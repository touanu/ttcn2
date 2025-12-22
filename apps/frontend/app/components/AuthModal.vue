<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

const open = ref<boolean>(false)
const currentForm = ref<'login' | 'register'>('login')

function switchToRegister(): void {
  currentForm.value = 'register'
}

function switchToLogin(): void {
  currentForm.value = 'login'
}

function closeModal(): void {
  open.value = false
  setTimeout(() => {
    currentForm.value = 'login'
  }, 300) // Close animation
}

// Login schema and fields
const loginSchema = z.object({
  username: z.string($t('VALIDATION_USERNAME_REQUIRED')).min(3, $t('VALIDATION_USERNAME_MIN', { min: 3 })),
  password: z.string($t('VALIDATION_PASSWORD_REQUIRED')).min(8, $t('VALIDATION_PASSWORD_MIN', { min: 8 })),
})

type LoginSchema = z.output<typeof loginSchema>

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

const registerSchema = z.object({
  name: z.string($t('VALIDATION_NAME_REQUIRED')).min(2, $t('VALIDATION_NAME_MIN', { min: 2 })),
  username: z.string($t('VALIDATION_USERNAME_REQUIRED')).min(3, $t('VALIDATION_USERNAME_MIN', { min: 3 })),
  email: z.email($t('VALIDATION_EMAIL_INVALID')),
  password: z.string($t('VALIDATION_PASSWORD_REQUIRED')).min(8, $t('VALIDATION_PASSWORD_MIN', { min: 8 })),
  confirmPassword: z.string($t('VALIDATION_CONFIRM_PASSWORD_REQUIRED')),
}).refine(data => data.password === data.confirmPassword, {
  message: $t('VALIDATION_PASSWORDS_MATCH'),
  path: ['confirmPassword'],
})

type RegisterSchema = z.output<typeof registerSchema>

const registerFields: AuthFormField[] = [{
  name: 'name',
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

function onLoginSubmit(payload: FormSubmitEvent<LoginSchema>): void {
  // TODO: Implement login logic
  console.warn('Login form submitted:', payload)
}

function onRegisterSubmit(payload: FormSubmitEvent<RegisterSchema>): void {
  // TODO: Implement registration logic
  console.warn('Register form submitted:', payload)
}
</script>

<template>
  <UModal
    v-model:open="open"
    :transition="true"
  >
    <UButton
      color="neutral"
      variant="link"
      icon="i-ph-sign-in-bold"
      class="cursor-pointer"
      @click="open = true"
    >
      <span class="hidden sm:inline">{{ $t('BUTTON_LOGIN_TEXT') }}</span>
    </UButton>

    <template #content>
      <div class="m-8 relative overflow-hidden">
        <UButton
          icon="i-ph-x-bold"
          color="neutral"
          variant="outline"
          class="rounded-full absolute top-4 right-4 z-10"
          @click="closeModal"
        />
        <Transition
          name="slide"
          mode="out-in"
          appear
        >
          <div v-if="currentForm === 'login'" key="login">
            <UAuthForm
              :schema="loginSchema"
              :title="$t('LOGIN_MODAL_TITLE')"
              :description="$t('LOGIN_MODAL_DESCRIPTION')"
              icon="i-lucide-user"
              :fields="loginFields"
              @submit="onLoginSubmit"
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
          </div>

          <div v-else key="register">
            <UAuthForm
              :schema="registerSchema"
              :title="$t('REGISTER_MODAL_TITLE')"
              :description="$t('REGISTER_MODAL_DESCRIPTION')"
              icon="i-lucide-user-plus"
              :fields="registerFields"
              :submit-button="{ label: $t('BUTTON_REGISTER_TEXT') }"
              @submit="onRegisterSubmit"
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
          </div>
        </Transition>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
