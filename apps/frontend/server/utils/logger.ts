import { createConsola } from 'consola/core'

export const logger = createConsola({
  level: import.meta.dev ? 5 : -999,
  formatOptions: {
    columns: 80,
    colors: true,
    compact: true,
    date: true,
  },
})
