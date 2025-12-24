<script setup lang="ts">
import type { OtpSchema } from '#shared/schemas/auth.schema'
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import { otpSchema } from '#shared/schemas/auth.schema'

const props = defineProps<{
  email: string
  isResending?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: FormSubmitEvent<OtpSchema>]
  resendOtp: []
  backToRegister: []
}>()

const countdown = ref(60)
const isCountingDown = ref(false)

const otpFields: AuthFormField[] = [{
  name: 'otp',
  type: 'text',
  label: $t('OTP_LABEL'),
  placeholder: $t('OTP_PLACEHOLDER'),
  required: true,
}]

function onSubmit(payload: FormSubmitEvent<OtpSchema>): void {
  emit('submit', payload)
}

function resendOtp(): void {
  if (isCountingDown.value)
    return

  emit('resendOtp')
  startCountdown()
}

function startCountdown(): void {
  isCountingDown.value = true
  countdown.value = 60

  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      isCountingDown.value = false
    }
  }, 1000)
}

const validateForm = createFormValidator(otpSchema)

function backToRegister(): void {
  emit('backToRegister')
}

onMounted(() => {
  startCountdown()
})
</script>

<template>
  <UAuthForm
    :schema="otpSchema"
    :validate="validateForm"
    :title="$t('OTP_VERIFICATION_TITLE')"
    :description="$t('OTP_VERIFICATION_DESCRIPTION', { email: props.email })"
    icon="i-lucide-mail-check"
    :fields="otpFields"
    :submit-button="{
      label: $t('BUTTON_VERIFY_OTP'),
      loading: props.isResending,
    }"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t('OTP_SENT_TO_EMAIL', { email: props.email }) }}
    </template>

    <template #footer>
      <div class="space-y-2 text-center">
        <div v-if="isCountingDown">
          {{ $t('RESEND_OTP_COUNTDOWN', { seconds: countdown }) }}
        </div>
        <div v-else>
          <UButton
            variant="link"
            color="primary"
            :loading="props.isResending"
            @click="resendOtp"
          >
            {{ $t('RESEND_OTP_BUTTON') }}
          </UButton>
        </div>
        <div>
          <UButton
            variant="link"
            color="neutral"
            @click="backToRegister"
          >
            {{ $t('BACK_TO_REGISTER') }}
          </UButton>
        </div>
      </div>
    </template>
  </UAuthForm>
</template>
