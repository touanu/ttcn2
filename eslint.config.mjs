// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './apps/frontend/.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    ignores: ['**/yaak/**'],

    vue: true,
    formatters: {
      css: true,
      html: true,
    },

    typescript: {
      overrides: {
        'new-cap': ['warn'],
      },
    },
  }),
)
