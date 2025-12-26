<script setup lang="ts">
import type { LoginSchema, OtpSchema, RegisterSchema } from '#shared/schemas/auth.schema'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { ResponseBody } from '@shared/interfaces'
import LoginForm from './LoginForm.vue'
import OtpForm from './OtpForm.vue'
import RegisterForm from './RegisterForm.vue'

const open = ref<boolean>(false)
const currentForm = ref<'login' | 'register' | 'otp'>('login')
const userEmail = ref<string>('')
const isLoading = ref<boolean>(false)
const { fetch: refreshSession } = useUserSession()

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

async function onLoginSubmit(payload: FormSubmitEvent<LoginSchema>): Promise<void> {
  try {
    isLoading.value = true
    const res = await $fetch<ResponseBody>('/api/auth/login', {
      method: 'POST',
      body: payload.data,
    })

    if (!res.success) {
      throw new Error(res.message || 'LOGIN_FAILED')
    }

    closeModal()
    await refreshSession()
    await navigateTo('/')
    console.warn('Login successful:', res.data)
  }
  catch (error) {
    console.error('Login failed:', error)
  }
  finally {
    isLoading.value = false
  }
}

async function onRegisterSubmit(payload: FormSubmitEvent<RegisterSchema>): Promise<void> {
  try {
    isLoading.value = true
    userEmail.value = payload.data.email

    const { data, error } = await useAPI('/auth/register', {
      method: 'POST',
      body: payload.data,
    })

    if (error.value) {
      throw error.value
    }

    // Switch to OTP verification
    switchToOtp()
    console.warn('Registration successful, verify OTP:', data)
  }
  catch (error) {
    console.error('Registration failed:', error)
  }
  finally {
    isLoading.value = false
  }
}

async function onOtpSubmit(payload: FormSubmitEvent<OtpSchema>): Promise<void> {
  try {
    isLoading.value = true

    const { data, error } = await useAPI('/auth/verify-otp', {
      method: 'POST',
      body: {
        email: userEmail.value,
        otp: payload.data.otp,
      },
    })

    if (error.value) {
      throw error.value
    }

    // Handle successful verification
    closeModal()
    console.warn('OTP verification successful:', data.value)
  }
  catch (error) {
    console.error('OTP verification failed:', error)
  }
  finally {
    isLoading.value = false
  }
}

async function resendOtp(): Promise<void> {
  try {
    isLoading.value = true

    const { data, error } = await $fetch<ResponseBody>('/auth/resend-otp', {
      method: 'POST',
      body: {
        email: userEmail.value,
      },
    })

    if (error) {
      throw error
    }

    console.warn('OTP resent to:', userEmail.value, data)
  }
  catch (error) {
    console.error('Failed to resend OTP:', error)
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
              @back-to-register="switchToRegister"
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
