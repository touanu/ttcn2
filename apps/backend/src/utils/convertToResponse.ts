import type { ClassDB, TimeTableDB } from '@interfaces/class.interface'
import type { CourseDB } from '@interfaces/courses.interface'
import type { EnrollmentDB } from '@interfaces/enrollment.interface'
import type { MediaDB } from '@interfaces/media.interface'
import type { UserDB } from '@interfaces/users.interface'
import type { Class, Course, Enrollment, Media, TimeTable, User } from '@shared/types'
import type { ObjectId } from 'mongoose'
import { isValidObjectId, Types } from 'mongoose'

/**
 * Unified ObjectId to string conversion function
 * Handles single ObjectId, arrays of ObjectIds, and undefined values
 *
 * @param value - Single ObjectId, array of ObjectIds, or undefined
 * @returns String representation or undefined for single values, string array for arrays
 *
 * @example
 * convertObjectId(objectId) // "507f1f77bcf86cd799439011"
 * convertObjectId([id1, id2]) // ["507f...", "608f..."]
 * convertObjectId(undefined) // undefined
 */
export function convertObjectId(value: ObjectId | undefined): string | undefined
export function convertObjectId(value: ObjectId[]): string[]
export function convertObjectId(value: unknown): string | string[] | undefined {
  // Handle undefined/null
  if (value == null) {
    return undefined
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value
      .filter(item => item != null && isValidObjectId(item))
      .map(item => item.toString())
  }

  // Handle single ObjectId
  if (isValidObjectId(value)) {
    return value.toString()
  }

  return undefined
}

/**
 * Convert string to ObjectId
 * Handles single string, arrays of strings, and undefined values
 *
 * @param value - Single string, array of strings, or undefined
 * @returns ObjectId representation or undefined for single values, ObjectId array for arrays
 * @throws Does not throw, returns undefined for invalid ObjectId strings
 *
 * @example
 * convertStringToObjectId("507f1f77bcf86cd799439011") // ObjectId("507f...")
 * convertStringToObjectId(["507f...", "608f..."]) // [ObjectId("507f..."), ObjectId("608f...")]
 * convertStringToObjectId(undefined) // undefined
 * convertStringToObjectId("invalid") // undefined
 */
export function convertStringToObjectId(value: string | undefined): ObjectId | undefined
export function convertStringToObjectId(value: string[]): ObjectId[]
export function convertStringToObjectId(value: unknown): ObjectId | ObjectId[] | undefined {
  // Handle undefined/null
  if (value == null) {
    return undefined
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value
      .filter(item => item != null && isValidObjectId(item))
      .map(item => new Types.ObjectId(item as string)) as unknown as ObjectId[]
  }

  // Handle single string
  if (typeof value === 'string' && isValidObjectId(value)) {
    return new Types.ObjectId(value) as unknown as ObjectId
  }

  return undefined
}

/**
 * Convert UserDB (with ObjectId) to User (with string) for API response
 */
export function convertUserToResponse(user: UserDB): User {
  return {
    ...user,
    _id: convertObjectId(user._id) as string,
  }
}

export function convertResponseToUser(user: User): UserDB {
  return {
    ...user,
    _id: convertStringToObjectId(user._id) as ObjectId,
  }
}

/**
 * Convert CourseDB to Course for API response
 */
export function convertCourseToResponse(course: CourseDB): Course {
  return {
    ...course,
    _id: convertObjectId(course._id) as string,
    classes: isValidObjectId(course.classes.at(0))
      ? (course.classes as ClassDB[]).map(convertClassToResponse)
      : convertObjectId(course.classes as ObjectId[]),
  }
}

export function convertResponseToCourse(courseResponse: Course): CourseDB {
  return {
    ...courseResponse,
    _id: Object.hasOwn(courseResponse, '_id')
      ? convertStringToObjectId(courseResponse._id) as ObjectId
      : undefined,
    classes: Object.hasOwn(courseResponse, 'classes')
      ? isValidObjectId(courseResponse.classes.at(0))
        ? convertStringToObjectId(courseResponse.classes as string[])
        : (courseResponse.classes as Class[]).map(convertResponseToClass)
      : [],
  }
}

/**
 * Convert MediaDB to Media for API response
 */
export function convertMediaToResponse(media: MediaDB): Media {
  return {
    ...media,
    _id: convertObjectId(media._id) as string,
    ownerId: convertObjectId(media.ownerId) as string,
  }
}

/**
 * Convert ClassDB to Class for API response
 */
export function convertClassToResponse(classData: ClassDB): Class {
  return {
    ...classData,
    _id: convertObjectId(classData._id) as string,
    courseId: convertObjectId(classData.courseId) as string,
    teacherId: convertObjectId(classData.teacherId) as string,
    studentIds: convertObjectId(classData.studentIds) as string[],
  }
}

/**
 * Convert Class to ClassDB for API response
 */
export function convertResponseToClass(classData: Class): ClassDB {
  return {
    ...classData,
    _id: convertStringToObjectId(classData._id) as ObjectId,
    courseId: convertStringToObjectId(classData.courseId) as ObjectId,
    teacherId: convertStringToObjectId(classData.teacherId) as ObjectId,
    studentIds: convertStringToObjectId(classData.studentIds) as ObjectId[],
  }
}

/**
 * Convert TimeTableDB to TimeTable for API response
 */
export function convertTimeTableToResponse(timeTable: TimeTableDB): TimeTable {
  return {
    ...timeTable,
    _id: convertObjectId(timeTable._id) as string,
    classId: convertObjectId(timeTable.classId) as string,
  }
}

/**
 * Convert EnrollmentDB to Enrollment for API response
 */
export function convertEnrollmentToResponse(enrollment: EnrollmentDB): Enrollment {
  return {
    ...enrollment,
    _id: convertObjectId(enrollment._id) as string,
    userId: convertObjectId(enrollment.userId) as string,
    courseId: convertObjectId(enrollment.courseId) as string,
  }
}
