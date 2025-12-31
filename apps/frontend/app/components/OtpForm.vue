<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import type { OtpOnlyDto } from '@shared/schemas/otp'
import { hideRealEmailAddress } from '@shared/utils'

const props = defineProps<{
  email: string
  isResending?: boolean
}>()
const emit = defineEmits<{
  submit: [payload: FormSubmitEvent<OtpOnlyDto>]
  resendOtp: []
  backToRegister: []
}>()
const { public: { otpLength } } = useRuntimeConfig()
const countdown = ref(60)
const isCountingDown = ref(false)

const otpFields: AuthFormField[] = [{
  name: 'otp',
  type: 'otp',
  label: $t('OTP_LABEL'),
  placeholder: '○',
  length: otpLength,
  required: true,
}]

function onSubmit(payload: FormSubmitEvent<OtpOnlyDto>): void {
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

onMounted(() => {
  startCountdown()
})
</script>

<template>
  <UAuthForm
    :title="$t('OTP_VERIFICATION_TITLE')"
    :description="$t('OTP_VERIFICATION_DESCRIPTION', { email: hideRealEmailAddress(props.email) })"
    icon="i-lucide-mail-check"
    :fields="otpFields"
    class="items-center"
    :validate-on="[]"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t('OTP_SENT_TO_EMAIL', { email: hideRealEmailAddress(props.email) }) }}
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
      </div>
    </template>
  </UAuthForm>
</template>
