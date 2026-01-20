<script setup lang="ts">
import type { Class, Course, User } from '@shared/types'

const props = defineProps<{
  open?: boolean
  classItem: Class | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'edit': [classItem: Class]
  'delete': [classItem: Class]
}>()

const open = computed({
  get: () => props.open ?? false,
  set: value => emit('update:open', value),
})

// Fetch courses to display course title
const { data: courses } = await useAPI<Course[]>('/api/admin/courses', {
  key: 'admin-courses-for-class-view',
})

// Fetch users to display student names
const { data: users } = await useAPI<User[]>('/api/admin/users', {
  key: 'admin-users-for-class-view',
})

function getCourseName(courseId: string): string {
  if (!courseId)
    return '-'
  const course = courses.value?.find(c => c._id === courseId)
  if (!course)
    return courseId
  return course.title
}

function getStudentName(studentId: string): string {
  if (!studentId)
    return '-'
  const student = users.value?.find(user => user._id === studentId)
  if (!student)
    return studentId
  return `${student.fullName || ''} (@${student.username || ''})`
}

function getTeacherName(teacherId: string): string {
  if (!teacherId)
    return '-'
  const teacher = users.value?.find(user => user._id === teacherId)
  if (!teacher)
    return teacherId
  return `${teacher.fullName || ''} (@${teacher.username || ''})`
}
</script>

<template>
  <UModal v-model:open="open" :title="$t('ADMIN.CLASSES.VIEW_CLASS')">
    <template #body>
      <div v-if="classItem" class="space-y-4">
        <div>
          <div class="text-sm font-medium text-muted mb-1">
            {{ $t('ADMIN.CLASSES.NAME') }}
          </div>
          <div class="text-base">
            {{ classItem.name }}
          </div>
        </div>

        <div>
          <div class="text-sm font-medium text-muted mb-1">
            {{ $t('ADMIN.CLASSES.COURSE') }}
          </div>
          <div class="text-base">
            {{ getCourseName(classItem.courseId) }}
          </div>
        </div>

        <div>
          <div class="text-sm font-medium text-muted mb-1">
            {{ $t('ADMIN.CLASSES.TEACHER') }}
          </div>
          <div class="text-base">
            {{ getTeacherName(classItem.teacherId) }}
          </div>
        </div>

        <div v-if="classItem.description">
          <div class="text-sm font-medium text-muted mb-1">
            {{ $t('ADMIN.CLASSES.DESCRIPTION') }}
          </div>
          <div class="text-base">
            {{ classItem.description }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm font-medium text-muted mb-1">
              {{ $t('ADMIN.CLASSES.ROOM') }}
            </div>
            <div class="text-base">
              {{ classItem.room || '-' }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-muted mb-1">
              {{ $t('ADMIN.CLASSES.MAX_STUDENTS') }}
            </div>
            <div class="text-base">
              {{ classItem.maxStudents || 30 }}
            </div>
          </div>
        </div>

        <div>
          <div class="text-sm font-medium text-muted mb-1">
            {{ $t('ADMIN.CLASSES.STATUS') }}
          </div>
          <UBadge
            :color="classItem.status === 'ACTIVE'
              ? 'success'
              : classItem.status === 'COMPLETED'
                ? 'neutral'
                : classItem?.status === 'CANCELLED'
                  ? 'error'
                  : classItem?.status === 'PENDING'
                    ? 'warning' : 'error'"
            variant="subtle"
          >
            {{ $t(`ADMIN.CLASSES.STATUS_${classItem.status}`) }}
          </UBadge>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm font-medium text-muted mb-1">
              {{ $t('ADMIN.CLASSES.START_DATE') }}
            </div>
            <div class="text-base">
              {{ classItem.startDate ? new Date(classItem.startDate).toLocaleDateString() : '-' }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-muted mb-1">
              {{ $t('ADMIN.CLASSES.END_DATE') }}
            </div>
            <div class="text-base">
              {{ classItem.endDate ? new Date(classItem.endDate).toLocaleDateString() : '-' }}
            </div>
          </div>
        </div>

        <div v-if="classItem.openedAt || classItem.endedAt" class="grid grid-cols-2 gap-4">
          <div v-if="classItem.openedAt">
            <div class="text-sm font-medium text-muted mb-1">
              Actual Start
            </div>
            <div class="text-base">
              {{ new Date(classItem.openedAt).toLocaleDateString() }}
            </div>
          </div>

          <div v-if="classItem.endedAt">
            <div class="text-sm font-medium text-muted mb-1">
              Actual End
            </div>
            <div class="text-base">
              {{ new Date(classItem.endedAt).toLocaleDateString() }}
            </div>
          </div>
        </div>

        <div>
          <div class="text-sm font-medium text-muted mb-1">
            {{ $t('ADMIN.CLASSES.STUDENTS') }}
          </div>
          <div class="text-base">
            {{ classItem.studentIds?.length || 0 }} {{ $t('ADMIN.CLASSES.STUDENTS_COUNT') }}
          </div>
        </div>

        <div v-if="classItem.studentIds && classItem.studentIds.length > 0">
          <div class="text-sm font-medium text-muted mb-2">
            {{ $t('ADMIN.CLASSES.STUDENT_LIST') }}
          </div>
          <div class="space-y-1 max-h-48 overflow-y-auto">
            <div v-for="studentId in classItem.studentIds" :key="studentId" class="text-sm bg-muted/10 px-3 py-2 rounded">
              {{ getStudentName(studentId) }}
            </div>
          </div>
        </div>

        <div>
          <div class="text-sm font-medium text-muted mb-1">
            {{ $t('ADMIN.CLASSES.CLASS_ID') }}
          </div>
          <div class="text-sm font-mono text-muted">
            {{ classItem._id }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-2 border-t border-muted/20">
          <div>
            <div class="text-sm font-medium text-muted mb-1">
              {{ $t('COMMON.CREATED_AT') }}
            </div>
            <div class="text-sm text-muted">
              {{ new Date(classItem.createdAt).toLocaleString() }}
            </div>
          </div>

          <div>
            <div class="text-sm font-medium text-muted mb-1">
              {{ $t('COMMON.UPDATED_AT') }}
            </div>
            <div class="text-sm text-muted">
              {{ new Date(classItem.updatedAt).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between items-center w-full">
        <UButton
          :label="$t('COMMON.CLOSE')"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />

        <div class="flex justify-between gap-2">
          <div class="flex gap-2">
            <UButton
              :label="$t('COMMON.DELETE')"
              color="error"
              variant="subtle"
              icon="i-lucide-trash"
              @click="() => { if (classItem) emit('delete', classItem) }"
            />
          </div>
          <div class="flex gap-2">
            <UButton
              :label="$t('COMMON.EDIT')"
              color="primary"
              variant="outline"
              icon="i-lucide-pencil"
              @click="() => { if (classItem) { open = false; emit('edit', classItem) } }"
            />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
