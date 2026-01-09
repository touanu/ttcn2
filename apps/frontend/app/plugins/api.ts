import type { ResponseBody } from '@shared/types'

export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
    baseURL: '/api',
    onRequest() {},
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }

      const toast = useToast()
      const formatedResponse = response._data as ResponseBody
      toast.add({
        title: $t('ERROR_TITLE'),
        description: getFirstTranslation(formatedResponse.message) || $t('GENERIC_ERROR'),
        icon: 'i-lucide-alert-circle',
        color: 'error',
      })
    },
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  }
})
