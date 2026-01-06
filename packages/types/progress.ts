import type { Progress } from '@shared/interfaces/progress.interface'

export type ProgressDB = Progress & Required<Pick<Progress, '_id'>>
