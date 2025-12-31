import { ACCESS_TOKEN_SECRET, BE_URL, FE_PORT, NODE_ENV } from '@shared/config'
import { OTP_LENGTH } from '@shared/constants'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    beApiBaseUrl: `${BE_URL}/api/v1`,
    accessTokenSecret: ACCESS_TOKEN_SECRET,
    public: {
      otpLength: OTP_LENGTH,
    },
  },
  devtools: {
    enabled: NODE_ENV === 'development',
    vscode: {
      reuseExistingServer: true,
      port: 3090,
    },
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxt/devtools',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    'nuxt-security',
    '@nuxt/test-utils/module',
    '@nuxtjs/i18n',
    'nuxt-auth-utils',
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
  devServer: {
    port: FE_PORT || 3333,
  },
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/': { prerender: true },
  },

  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'vi',
    locales: [{
      code: 'vi',
      name: 'Tiếng Việt',
      file: { path: 'vi.json', cache: NODE_ENV === 'production' },
    }, {
      code: 'en',
      name: 'English',
      file: { path: 'en.json', cache: NODE_ENV === 'production' },
    }],
    experimental: {
      localeDetector: 'localeDetector.ts',
    },
  },
})
