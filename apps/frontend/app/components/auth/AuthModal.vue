<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CreateUserDto, LoginUserDto, OtpOnlyDto } from '@shared/schemas'
import type { EmailOnlyDto, PasswordOnlyDto } from '@shared/schemas/user'
import type { ResponseBody, SuccessResponseBody } from '@shared/types'
import type { OTPType } from '@shared/types/otp'

const { $api } = useNuxtApp()
const open = ref<boolean>(false)
const currentForm = ref<'login' | 'register' | 'otp' | 'forgot-password' | 'reset-password'>('login')
const userEmail = ref<string>('')
const verifiedOtp = ref<string>('')
const otpMode = ref<OTPType>('EMAIL_VERIFICATION')
const isLoading = ref<boolean>(false)
const { fetch: refreshSession } = useUserSession()

const toast = useToast()

function switchToRegister(): void {
  currentForm.value = 'register'
}

function switchToLogin(): void {
  currentForm.value = 'login'
}

function switchToOtp(mode: OTPType): void {
  otpMode.value = mode
  currentForm.value = 'otp'
}

function switchToForgotPassword(): void {
  currentForm.value = 'forgot-password'
}

function switchToResetPassword(): void {
  currentForm.value = 'reset-password'
}

function closeModal(): void {
  open.value = false
  setTimeout(() => {
    currentForm.value = 'login'
    userEmail.value = ''
    verifiedOtp.value = ''
    isLoading.value = false
  }, 300) // Close animation
}

async function onLoginSubmit(payload: FormSubmitEvent<LoginUserDto>): Promise<void> {
  isLoading.value = true
  const response = await $api<ResponseBody>('/api/auth/login', {
    method: 'POST',
    body: payload.data,
    ignoreResponseError: true,
  })

  if (!response.success) {
    if (response.message === 'AUTH.EMAIL_NOT_VERIFIED') {
      const res = await $api<SuccessResponseBody<{ email: string }>>(
        '/api/users/request-verify-email',
        {
          method: 'POST',
          body: {
            username: payload.data.username,
          },
          ignoreResponseError: true,
        },
      )

      userEmail.value = res.data?.email || payload.data.username
      switchToOtp('EMAIL_VERIFICATION')
      return
    }

    toast.add({
      title: $t('ERRORS.TITLE'),
      description: $t(response.message || 'GENERIC_ERROR'),
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
    return
  }

  closeModal()
  await refreshSession()
  await navigateTo('/')

  isLoading.value = false
}

async function onRegisterSubmit(payload: FormSubmitEvent<CreateUserDto>): Promise<void> {
  isLoading.value = true

  const res = await $api<SuccessResponseBody<{ email: string }>>('/api/users/register', {
    method: 'POST',
    body: payload.data,
  })

  userEmail.value = res.data?.email || payload.data.email

  // Switch to OTP verification
  switchToOtp('EMAIL_VERIFICATION')

  isLoading.value = false
}

async function onOtpSubmit(payload: FormSubmitEvent<OtpOnlyDto>): Promise<void> {
  isLoading.value = true

  const otpString = Array.isArray(payload.data.otp)
    ? payload.data.otp.join('')
    : payload.data.otp

  if (otpMode.value === 'EMAIL_VERIFICATION') {
    await $api('/api/users/verify-email', {
      method: 'POST',
      body: {
        email: userEmail.value,
        otp: otpString,
      },
    })

    closeModal()
  }
  else {
    verifiedOtp.value = otpString
    switchToResetPassword()
  }
  isLoading.value = false
}

async function resendOtp(): Promise<void> {
  isLoading.value = true

  const endpoint = otpMode.value === 'EMAIL_VERIFICATION'
    ? '/api/users/request-verify-email'
    : '/api/users/request-reset-password'

  await $api(endpoint, {
    method: 'POST',
    body: {
      email: userEmail.value,
    },
  })

  isLoading.value = false
}

async function onForgotPasswordSubmit(payload: FormSubmitEvent<EmailOnlyDto>): Promise<void> {
  isLoading.value = true

  await $api('/api/users/request-reset-password', {
    method: 'POST',
    body: payload.data,
  })

  userEmail.value = payload.data.email

  // Switch to OTP form for verification
  switchToOtp('PASSWORD_RESET')
  isLoading.value = false
}

async function onResetPasswordSubmit(payload: FormSubmitEvent<PasswordOnlyDto>): Promise<void> {
  isLoading.value = true

  await $api('/api/users/reset-password', {
    method: 'POST',
    body: {
      email: userEmail.value,
      otp: verifiedOtp.value,
      newPassword: payload.data.newPassword,
    },
  })

  switchToLogin()
  isLoading.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :transition="true"
    :scrollable="true"
  >
    <UButton
      color="neutral"
      variant="link"
      icon="i-ph-sign-in-bold"
      class="cursor-pointer"
      @click="open = true"
    >
      <span class="hidden sm:inline">{{ $t('AUTH.BUTTON.LOGIN') }}</span>
    </UButton>

    <template #content>
      <div class="m-8 relative overflow-hidden">
        <UButton
          icon="i-ph-x-bold"
          color="neutral"
          variant="outline"
          class="rounded-full absolute top-0 right-0 z-10"
          @click="closeModal"
        />
        <Transition
          name="slide"
          mode="out-in"
          appear
        >
          <div v-if="currentForm === 'login'" key="login">
            <AuthLoginForm
              :loading="isLoading"
              @submit="onLoginSubmit"
              @switch-to-register="switchToRegister"
              @switch-to-forgot-password="switchToForgotPassword"
            />
          </div>

          <div v-else-if="currentForm === 'register'" key="register">
            <AuthRegisterForm
              :loading="isLoading"
              @submit="onRegisterSubmit"
              @switch-to-login="switchToLogin"
            />
          </div>

          <div v-else-if="currentForm === 'otp'" key="otp">
            <AuthOtpForm
              :email="userEmail"
              :mode="otpMode"
              :is-resending="isLoading"
              @submit="onOtpSubmit"
              @resend-otp="resendOtp"
            />
          </div>

          <div v-else-if="currentForm === 'forgot-password'" key="forgot-password">
            <AuthForgotPasswordForm
              :loading="isLoading"
              @submit="onForgotPasswordSubmit"
              @resend-otp="resendOtp"
              @back-to-login="switchToLogin"
            />
          </div>

          <div v-else-if="currentForm === 'reset-password'" key="reset-password">
            <AuthResetPasswordForm
              :loading="isLoading"
              @submit="onResetPasswordSubmit"
              @back-to-login="switchToLogin"
            />
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
