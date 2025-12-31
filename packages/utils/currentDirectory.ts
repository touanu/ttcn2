import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

function findPackageRoot(startDir: string): string {
  let dir = dirname(startDir)
  while (true) {
    if (existsSync(join(dir, 'package.json')))
      return dir
    const parent = dirname(dir)
    if (parent === dir)
      return startDir // dự phòng
    dir = parent
  }
}

export const rootDir = findPackageRoot(__dirname)
export const configDir = resolve(rootDir, 'config')
export const packagesDir = resolve(rootDir, 'packages')
export const appsDir = resolve(rootDir, 'apps')
export const backendDir = resolve(appsDir, 'backend')
export const frontendDir = resolve(appsDir, 'frontend')
