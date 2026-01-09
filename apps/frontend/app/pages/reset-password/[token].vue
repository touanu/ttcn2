<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { PasswordOnlyDto } from '@shared/schemas/user'
import type { SuccessResponseBody } from '@shared/types'

definePageMeta({
  seo: false,
  title: 'Thay đổi mật khẩu',
  layout: false,
})

const isLoading = ref<boolean>(false)
const route = useRoute()
const toast = useToast()
const token = route.params.token as string

async function onSubmit(payload: FormSubmitEvent<PasswordOnlyDto>): Promise<void> {
  isLoading.value = true

  try {
    const res = await $fetch<SuccessResponseBody<undefined>>(
      `/api/reset-password/${token}`,
      {
        method: 'POST',
        body: {
          newPassword: payload.data.newPassword,
        },
      },
    )

    toast.add({
      title: $t('SUCCESS_TITLE'),
      description: getFirstTranslation(res.message) || $t('AUTH.OTP.VERIFICATION_SUCCESS'),
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
  }
  catch (error: any) {
    toast.add({
      title: $t('ERROR_TITLE'),
      description: getFirstTranslation(error.data?.message) || $t('AUTH.OTP.VERIFICATION_FAILED'),
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
    isLoading.value = false
    return
  }

  await navigateTo('/login?reset=success')
  isLoading.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <AuthResetPasswordForm
      class="max-w-md w-full flex items-center flex-col bg-white p-8 rounded-lg shadow"
      :loading="isLoading"
      @submit="onSubmit"
    />
  </div>
</template>
