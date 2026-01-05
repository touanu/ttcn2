<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { ResponseBody, SuccessResponseBody } from '@shared/interfaces'
import type { CreateUserDto, LoginUserDto, OtpOnlyDto } from '@shared/schemas'
import type { EmailOnlyDto, PasswordOnlyDto } from '@shared/schemas/user'
import type { OTPType } from '@shared/types/otp'

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
  try {
    isLoading.value = true
    await $fetch<ResponseBody>('/api/auth/login', {
      method: 'POST',
      body: payload.data,
    })

    toast.add({
      title: $t('SUCCESS_TITLE'),
      description: $t('AUTH.LOGIN.SUCCESS'),
      icon: 'i-lucide-check-circle',
      color: 'success',
    })

    closeModal()
    await refreshSession()
    await navigateTo('/')
  }
  catch (error: any) {
    console.error('Login failed:', error)

    if (error.data?.data?.errorCode === 'AUTH.EMAIL_NOT_VERIFIED') {
      const res = await $fetch<ResponseBody>('/api/users/request-verify-email', {
        method: 'POST',
        body: {
          username: payload.data.username,
        },
        ignoreResponseError: true,
      })

      if (res.error) {
        toast.add({
          title: $t('ERROR_TITLE'),
          description: getFirstTranslation(res.message) || $t('AUTH.OTP.RESEND_FAILED'),
          icon: 'i-lucide-alert-circle',
          color: 'error',
        })
        return
      }

      const rqVerifyEmailResponse = res as SuccessResponseBody<{ email: string }>
      userEmail.value = rqVerifyEmailResponse.data?.email || payload.data.username

      switchToOtp('EMAIL_VERIFICATION')
    }

    toast.add({
      title: $t('ERROR_TITLE'),
      description: getFirstTranslation(error.data?.message) || $t('AUTH.LOGIN.FAILED'),
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    isLoading.value = false
  }
}

async function onRegisterSubmit(payload: FormSubmitEvent<CreateUserDto>): Promise<void> {
  try {
    isLoading.value = true

    const res = await $fetch<ResponseBody>('/api/users/register', {
      method: 'POST',
      body: payload.data,
    })

    const rqRegisterResponse = res as SuccessResponseBody<{ email: string }>
    userEmail.value = rqRegisterResponse.data?.email || payload.data.email

    toast.add({
      title: $t('SUCCESS_TITLE'),
      description: $t('AUTH.REGISTER.SUCCESS'),
      icon: 'i-lucide-check-circle',
      color: 'success',
    })

    // Switch to OTP verification
    switchToOtp('EMAIL_VERIFICATION')
  }
  catch (error: any) {
    console.error('Registration failed:', error)
    toast.add({
      title: $t('ERROR_TITLE'),
      description: getFirstTranslation(error.data?.message) || $t('AUTH.REGISTER.FAILED'),
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    isLoading.value = false
  }
}

async function onOtpSubmit(payload: FormSubmitEvent<OtpOnlyDto>): Promise<void> {
  try {
    isLoading.value = true

    const otpString = Array.isArray(payload.data.otp)
      ? payload.data.otp.join('')
      : payload.data.otp

    if (otpMode.value === 'EMAIL_VERIFICATION') {
      await $fetch<ResponseBody>('/api/users/verify-email', {
        method: 'POST',
        body: {
          email: userEmail.value,
          otp: otpString,
        },
      })

      toast.add({
        title: $t('SUCCESS_TITLE'),
        description: $t('AUTH.OTP.VERIFICATION_SUCCESS'),
        icon: 'i-lucide-check-circle',
        color: 'success',
      })

      closeModal()
    }
    else {
      verifiedOtp.value = otpString

      toast.add({
        title: $t('SUCCESS_TITLE'),
        description: $t('AUTH.OTP.VERIFICATION_SUCCESS'),
        icon: 'i-lucide-check-circle',
        color: 'success',
      })

      switchToResetPassword()
    }
  }
  catch (error: any) {
    console.error('OTP verification failed:', error)
    toast.add({
      title: $t('ERROR_TITLE'),
      description: getFirstTranslation(error.data?.message) || $t('AUTH.OTP.VERIFICATION_FAILED'),
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    isLoading.value = false
  }
}

async function resendOtp(): Promise<void> {
  try {
    isLoading.value = true

    const endpoint = otpMode.value === 'EMAIL_VERIFICATION'
      ? '/api/users/request-verify-email'
      : '/api/users/request-reset-password'

    await $fetch<ResponseBody>(endpoint, {
      method: 'POST',
      body: {
        email: userEmail.value,
      },
    })

    toast.add({
      title: $t('SUCCESS_TITLE'),
      description: $t('AUTH.OTP.RESEND_SUCCESS'),
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
  }
  catch (error: any) {
    console.error('Failed to resend OTP:', error)
    toast.add({
      title: $t('ERROR_TITLE'),
      description: getFirstTranslation(error.data?.message) || $t('AUTH.OTP.RESEND_FAILED'),
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    isLoading.value = false
  }
}

async function onForgotPasswordSubmit(payload: FormSubmitEvent<EmailOnlyDto>): Promise<void> {
  try {
    isLoading.value = true

    await $fetch<ResponseBody>('/api/users/request-reset-password', {
      method: 'POST',
      body: payload.data,
    })

    userEmail.value = payload.data.email

    toast.add({
      title: $t('SUCCESS_TITLE'),
      description: $t('AUTH.PASSWORD_RESET.SUCCESS'),
      icon: 'i-lucide-check-circle',
      color: 'success',
    })

    // Switch to OTP form for verification
    switchToOtp('PASSWORD_RESET')
  }
  catch (error: any) {
    console.error('Password reset failed:', error)
    toast.add({
      title: $t('ERROR_TITLE'),
      description: getFirstTranslation(error.data?.message) || $t('AUTH.PASSWORD_RESET.FAILED'),
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    isLoading.value = false
  }
}

async function onResetPasswordSubmit(payload: FormSubmitEvent<PasswordOnlyDto>): Promise<void> {
  try {
    isLoading.value = true

    await $fetch<ResponseBody>('/api/users/reset-password', {
      method: 'POST',
      body: {
        email: userEmail.value,
        otp: verifiedOtp.value,
        newPassword: payload.data.newPassword,
      },
    })

    toast.add({
      title: $t('SUCCESS_TITLE'),
      description: $t('AUTH.PASSWORD_RESET.SUCCESS'),
      icon: 'i-lucide-check-circle',
      color: 'success',
    })

    switchToLogin()
  }
  catch (error: any) {
    console.error('Reset password failed:', error)
    toast.add({
      title: $t('ERROR_TITLE'),
      description: getFirstTranslation(error.data?.message) || $t('AUTH.PASSWORD_RESET.FAILED'),
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    isLoading.value = false
  }
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
            <LoginForm
              :loading="isLoading"
              @submit="onLoginSubmit"
              @switch-to-register="switchToRegister"
              @switch-to-forgot-password="switchToForgotPassword"
            />
          </div>

          <div v-else-if="currentForm === 'register'" key="register">
            <RegisterForm
              :loading="isLoading"
              @submit="onRegisterSubmit"
              @switch-to-login="switchToLogin"
            />
          </div>

          <div v-else-if="currentForm === 'otp'" key="otp">
            <OtpForm
              :email="userEmail"
              :mode="otpMode"
              :is-resending="isLoading"
              @submit="onOtpSubmit"
              @resend-otp="resendOtp"
            />
          </div>

          <div v-else-if="currentForm === 'forgot-password'" key="forgot-password">
            <ForgotPasswordForm
              :loading="isLoading"
              @submit="onForgotPasswordSubmit"
              @resend-otp="resendOtp"
              @back-to-login="switchToLogin"
            />
          </div>

          <div v-else-if="currentForm === 'reset-password'" key="reset-password">
            <ResetPasswordForm
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
