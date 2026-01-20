export default defineNuxtPlugin((nuxtApp) => {
  const toast = useToast()
  const { $i18n } = useNuxtApp()
  const t = $i18n.t

  const api = $fetch.create({
    baseURL: '/api',
    onRequest() {
      if (import.meta.client) {
        nuxtApp.runWithContext(() => {
          $fetch('/api/auth/refresh', { method: 'POST', ignoreResponseError: true })
        })
      }
    },
    onResponse({ response }) {
      if (response.ok && response._data.message) {
        toast.add({
          title: t('COMMON.SUCCESS'),
          description: response._data.message,
          color: 'success',
          icon: 'i-lucide-check-circle',
        })
      }
    },
    async onResponseError({ response }) {
      if (
        response.status === 401
        && response._data.message === 'AUTH.INVALID_REFRESH_TOKEN'
      ) {
        toast.add({
          title: t('ERRORS.TITLE'),
          description: t('AUTH.UNAUTHORIZED'),
          icon: 'i-lucide-alert-circle',
          color: 'error',
        })

        nuxtApp.runWithContext(() => navigateTo('/login'))
      }

      if (response._data.message) {
        toast.add({
          title: t('ERRORS.TITLE'),
          description: response._data.message,
          icon: 'i-lucide-alert-circle',
          color: 'error',
        })
      }
    },
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  }
})
