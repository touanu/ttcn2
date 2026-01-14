import type { Attempt, Course, Enrollment, Lesson, Media, Progress, Question, Quiz, TimeTable, User } from '@shared/types'
import type { ObjectId } from 'mongoose'
import type { Class } from 'zod/v4/core/util'
import type { AttemptDB, ClassDB, CourseDB, EnrollmentDB, LessonDB, MediaDB, ProgressDB, QuestionDB, QuizDB, TimeTableDB, UserDB } from '@/interfaces'

/**
 * Convert ObjectId to string
 */
function toStringId(id?: ObjectId): string | undefined {
  return id?.toString()
}

/**
 * Convert array of ObjectIds to array of strings
 */
function toStringIds(ids: ObjectId[]): string[] {
  return ids.map(id => id.toString())
}

/**
 * Convert UserDB (with ObjectId) to User (with string) for API response
 */
export function convertUserToResponse(user: UserDB): User {
  return {
    ...user,
    _id: toStringId(user._id),
  }
}

/**
 * Convert CourseDB to Course for API response
 */
export function convertCourseToResponse(course: CourseDB): Course {
  return {
    ...course,
    _id: toStringId(course._id),
    authorId: course.authorId.toString(),
    lessonIds: toStringIds(course.lessonIds),
  }
}

/**
 * Convert LessonDB to Lesson for API response
 */
export function convertLessonToResponse(lesson: LessonDB): Lesson {
  return {
    ...lesson,
    _id: toStringId(lesson._id),
    courseId: lesson.courseId.toString(),
    mediaIds: toStringIds(lesson.mediaIds),
    quizId: toStringId(lesson.quizId),
  }
}

/**
 * Convert QuizDB to Quiz for API response
 */
export function convertQuizToResponse(quiz: QuizDB): Quiz {
  return {
    ...quiz,
    _id: toStringId(quiz._id),
    lessonId: quiz.lessonId.toString(),
    questionIds: toStringIds(quiz.questionIds),
  }
}

/**
 * Convert QuestionDB to Question for API response
 */
export function convertQuestionToResponse(question: QuestionDB): Question {
  return {
    ...question,
    _id: toStringId(question._id),
    quizId: question.quizId.toString(),
  }
}

/**
 * Convert AttemptDB to Attempt for API response
 */
export function convertAttemptToResponse(attempt: AttemptDB): Attempt {
  return {
    ...attempt,
    _id: toStringId(attempt._id),
    userId: attempt.userId.toString(),
    quizId: attempt.quizId.toString(),
  }
}

/**
 * Convert ProgressDB to Progress for API response
 */
export function convertProgressToResponse(progress: ProgressDB): Progress {
  return {
    ...progress,
    _id: toStringId(progress._id),
    userId: progress.userId.toString(),
    courseId: progress.courseId.toString(),
    completedLessonIds: toStringIds(progress.completedLessonIds),
  }
}

/**
 * Convert MediaDB to Media for API response
 */
export function convertMediaToResponse(media: MediaDB): Media {
  return {
    ...media,
    _id: toStringId(media._id),
    ownerId: media.ownerId.toString(),
  }
}

/**
 * Convert ClassDB to Class for API response
 */
export function convertClassToResponse(classData: ClassDB): Class {
  return {
    ...classData,
    _id: toStringId(classData._id),
    teacherId: classData.teacherId.toString(),
    studentIds: toStringIds(classData.studentIds),
  }
}

/**
 * Convert TimeTableDB to TimeTable for API response
 */
export function convertTimeTableToResponse(timeTable: TimeTableDB): TimeTable {
  return {
    ...timeTable,
    _id: toStringId(timeTable._id),
    classId: timeTable.classId.toString(),
  }
}

/**
 * Convert EnrollmentDB to Enrollment for API response
 */
export function convertEnrollmentToResponse(enrollment: EnrollmentDB): Enrollment {
  return {
    ...enrollment,
    _id: toStringId(enrollment._id),
    userId: enrollment.userId.toString(),
    courseId: enrollment.courseId.toString(),
  }
}
