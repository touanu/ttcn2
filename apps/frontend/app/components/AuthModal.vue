<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { ResponseBody, SuccessResponseBody } from '@shared/interfaces'
import type { CreateUserDto, LoginUserDto, OtpOnlyDto } from '@shared/schemas'

const open = ref<boolean>(false)
const currentForm = ref<'login' | 'register' | 'otp'>('login')
const userEmail = ref<string>('')
const isLoading = ref<boolean>(false)
const { fetch: refreshSession } = useUserSession()

const toast = useToast()

function switchToRegister(): void {
  currentForm.value = 'register'
}

function switchToLogin(): void {
  currentForm.value = 'login'
}

function switchToOtp(): void {
  currentForm.value = 'otp'
}

function closeModal(): void {
  open.value = false
  setTimeout(() => {
    currentForm.value = 'login'
    userEmail.value = ''
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
      description: $t('LOGIN_SUCCESS'),
      icon: 'i-lucide-check-circle',
      color: 'success',
    })

    closeModal()
    await refreshSession()
    await navigateTo('/')
  }
  catch (error: any) {
    console.error('Login failed:', error)

    if (error.data?.data?.errorCode === 'EMAIL_NOT_VERIFIED') {
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
          description: getFirstTranslation(res.message) || $t('RESEND_OTP_FAILED'),
          icon: 'i-lucide-alert-circle',
          color: 'error',
        })
        return
      }

      const rqVerifyEmailResponse = res as SuccessResponseBody<{ email: string }>
      userEmail.value = rqVerifyEmailResponse.data?.email || payload.data.username

      switchToOtp()
    }

    toast.add({
      title: $t('ERROR_TITLE'),
      description: getFirstTranslation(error.data?.message) || $t('LOGIN_FAILED'),
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
    userEmail.value = rqRegisterResponse.data?.email || payload.data.username

    toast.add({
      title: $t('SUCCESS_TITLE'),
      description: $t('REGISTRATION_SUCCESS'),
      icon: 'i-lucide-check-circle',
      color: 'success',
    })

    // Switch to OTP verification
    switchToOtp()
  }
  catch (error: any) {
    console.error('Registration failed:', error)
    toast.add({
      title: $t('ERROR_TITLE'),
      description: getFirstTranslation(error.data?.message) || $t('REGISTRATION_FAILED'),
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

    await $fetch<ResponseBody>('/api/users/verify-email', {
      method: 'POST',
      body: {
        email: userEmail.value,
        otp: otpString,
      },
    })

    toast.add({
      title: $t('SUCCESS_TITLE'),
      description: $t('EMAIL_VERIFICATION_SUCCESS'),
      icon: 'i-lucide-check-circle',
      color: 'success',
    })

    // Handle successful verification
    closeModal()
  }
  catch (error: any) {
    console.error('OTP verification failed:', error)
    toast.add({
      title: $t('ERROR_TITLE'),
      description: getFirstTranslation(error.data?.message) || $t('OTP_VERIFICATION_FAILED'),
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

    await $fetch<ResponseBody>('/api/users/request-verify-email', {
      method: 'POST',
      body: {
        email: userEmail.value,
      },
    })

    toast.add({
      title: $t('SUCCESS_TITLE'),
      description: $t('RESEND_OTP_SUCCESS'),
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
  }
  catch (error: any) {
    console.error('Failed to resend OTP:', error)
    toast.add({
      title: $t('ERROR_TITLE'),
      description: getFirstTranslation(error.data?.message) || $t('RESEND_OTP_FAILED'),
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
            <LoginForm
              @submit="onLoginSubmit"
              @switch-to-register="switchToRegister"
            />
          </div>

          <div v-else-if="currentForm === 'register'" key="register">
            <RegisterForm
              @submit="onRegisterSubmit"
              @switch-to-login="switchToLogin"
            />
          </div>

          <div v-else-if="currentForm === 'otp'" key="otp">
            <OtpForm
              :email="userEmail"
              :is-resending="isLoading"
              @submit="onOtpSubmit"
              @resend-otp="resendOtp"
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
