<script setup lang="ts">
import type { SuccessResponseBody } from '@shared/interfaces'

definePageMeta({
  seo: false,
  title: 'Xác minh email',
  layout: false,
})

const route = useRoute()
const token = route.params.token as string
const isEmailVerified = ref<boolean>()

const { data } = await useFetch<SuccessResponseBody<undefined>>(
  `/api/users/verify-email/${token}`,
  {
    method: 'POST',
  },
)

isEmailVerified.value = data.value?.success || false
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full flex items-center flex-col bg-white p-8 rounded-lg shadow">
      <UIcon
        v-if="isEmailVerified"
        name="i-lucide-check-circle"
        class="w-16 h-16 text-green-500 mb-4"
      />
      <UIcon
        v-else
        name="i-lucide-x-circle"
        class="w-16 h-16 text-red-500 mb-4"
      />

      <h1 class="text-2xl font-semibold mb-6 text-center">
        {{ $t('AUTH.OTP.BUTTON_VERIFY') }}
      </h1>

      <p v-if="isEmailVerified" class="mb-6 text-center">
        {{ $t('AUTH.OTP.VERIFICATION_SUCCESS') }}
      </p>
      <p v-else class="mb-6 text-center">
        {{ $t('AUTH.OTP.VERIFICATION_FAILED') }}
      </p>

      <UButton
        to="/login"
        color="primary"
        class="mt-6"
      >
        {{ $t('AUTH.OTP.BACK_TO_LOGIN') }}
      </UButton>
    </div>
  </div>
</template>
