import { resolve } from 'node:path'

export const rootDir = resolve(__dirname, '../../')
export const configDir = resolve(rootDir, 'config')
export const packagesDir = resolve(rootDir, 'packages')
export const appsDir = resolve(rootDir, 'apps')
