import type { Lesson } from '@shared/interfaces/lessons.interface'

export type LessonDB = Lesson & Required<Pick<Lesson, '_id'>>
