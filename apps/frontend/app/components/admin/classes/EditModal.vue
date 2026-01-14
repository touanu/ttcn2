<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { UpdateClassDto } from '@shared/schemas'
import type { Class, Course, User } from '@shared/types'
import { updateClassSchema } from '@shared/schemas'

const props = defineProps<{
  classItem: Class | null
}>()

const emit = defineEmits<{
  updated: []
}>()

const open = defineModel<boolean>('open', { required: true })

const state = reactive<Partial<UpdateClassDto>>({
  name: undefined,
  courseId: undefined,
  teacherId: undefined,
  studentIds: [],
  room: undefined,
  description: undefined,
  maxStudents: undefined,
  status: undefined,
  startDate: undefined,
  endDate: undefined,
})

const toast = useToast()
const validateForm = createFormValidator(updateClassSchema)

// Fetch courses
const { data: courses } = await useFetch<Course[]>('/api/admin/courses', {
  server: false,
  default: () => [],
  query: { status: 'PUBLISHED' },
})

// Fetch teachers and students
const { data: users } = await useFetch<User[]>('/api/admin/users', {
  lazy: true,
  server: false,
  default: () => [],
})

const courseOptions = computed(() => {
  if (!courses.value || courses.value.length === 0) {
    return []
  }
  return courses.value
    .filter(course => course.status === 'PUBLISHED')
    .map(course => ({
      label: course.title,
      value: course._id!,
    }))
})

const teacherOptions = computed(() => {
  return users.value
    ?.filter(user => user.role === 'teacher')
    .map(user => ({
      label: `${user.fullName} (@${user.username})`,
      value: user._id!,
    })) || []
})

const studentOptions = computed(() => {
  return users.value
    ?.filter(user => user.role === 'student')
    .map(user => ({
      label: `${user.fullName} (@${user.username})`,
      value: user._id!,
    })) || []
})

function getStudentName(id: string): string {
  const student = users.value?.find(user => user._id === id)
  return student ? `${student.fullName} (@${student.username})` : id
}

function removeStudentId(id: string) {
  state.studentIds = state.studentIds?.filter(sid => sid !== id) || []
}

function addSelectedStudent(id: string) {
  if (id && !state.studentIds?.includes(id)) {
    state.studentIds = [...(state.studentIds || []), id]
  }
}

function formatDateForInput(date?: Date | string) {
  if (!date)
    return undefined
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

// Watch for classItem changes to populate form
watch(() => props.classItem, (classItem) => {
  if (classItem) {
    Object.assign(state, {
      name: classItem.name,
      courseId: classItem.courseId,
      teacherId: classItem.teacherId,
      studentIds: [...(classItem.studentIds || [])],
      room: classItem.room,
      description: classItem.description,
      maxStudents: classItem.maxStudents || 30,
      status: classItem.status || 'PENDING',
      startDate: formatDateForInput(classItem.startDate),
      endDate: formatDateForInput(classItem.endDate),
    })
  }
}, { immediate: true })

async function onSubmit(event: FormSubmitEvent<UpdateClassDto>) {
  if (!props.classItem?._id)
    return

  try {
    await $fetch(`/api/admin/classes/${props.classItem._id}`, {
      method: 'PATCH',
      body: event.data,
    })

    toast.add({
      title: $t('COMMON.SUCCESS'),
      description: $t('ADMIN.CLASSES.CLASS_UPDATED'),
      color: 'success',
    })

    open.value = false
    emit('updated')

    // Refresh the classes list
    await refreshNuxtData()
  }
  catch (err: any) {
    toast.add({
      title: $t('ERRORS.TITLE'),
      description: err?.message || $t('ADMIN.CLASSES.UPDATE_ERROR'),
      color: 'error',
    })
  }
}
</script>

<template>
  <UModal v-model:open="open" :title="$t('ADMIN.CLASSES.EDIT_CLASS')">
    <template #body>
      <UForm
        v-if="classItem"
        :schema="updateClassSchema"
        :validate="validateForm"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField :label="$t('ADMIN.CLASSES.NAME')" name="name" required>
          <UInput v-model="state.name" :placeholder="$t('ADMIN.CLASSES.NAME')" class="w-full" />
        </UFormField>

        <UFormField :label="$t('ADMIN.CLASSES.COURSE')" name="courseId" required>
          <USelect
            v-model="state.courseId"
            :items="courseOptions"
            :placeholder="$t('ADMIN.CLASSES.SELECT_COURSE')"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="$t('ADMIN.CLASSES.TEACHER')" name="teacherId" required>
          <USelect
            v-model="state.teacherId"
            :items="teacherOptions"
            :placeholder="$t('ADMIN.CLASSES.SELECT_TEACHER')"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="$t('ADMIN.CLASSES.DESCRIPTION')" name="description">
          <UTextarea v-model="state.description" :placeholder="$t('ADMIN.CLASSES.DESCRIPTION')" rows="3" class="w-full" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField :label="$t('ADMIN.CLASSES.ROOM')" name="room">
            <UInput v-model="state.room" :placeholder="$t('ADMIN.CLASSES.ROOM')" class="w-full" />
          </UFormField>

          <UFormField :label="$t('ADMIN.CLASSES.MAX_STUDENTS')" name="maxStudents">
            <UInput v-model.number="state.maxStudents" type="number" min="1" max="200" class="w-full" />
          </UFormField>
        </div>

        <UFormField :label="$t('ADMIN.CLASSES.STATUS')" name="status">
          <USelect
            v-model="state.status"
            :items="[
              { label: $t('STATUS.CLASS.PENDING'), value: 'PENDING' },
              { label: $t('STATUS.CLASS.ACTIVE'), value: 'ACTIVE' },
              { label: $t('STATUS.CLASS.COMPLETED'), value: 'COMPLETED' },
              { label: $t('STATUS.CLASS.CANCELLED'), value: 'CANCELLED' },
            ]"
            class="w-full"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField :label="$t('ADMIN.CLASSES.START_DATE')" name="startDate">
            <UInput v-model="state.startDate" type="date" class="w-full" />
          </UFormField>

          <UFormField :label="$t('ADMIN.CLASSES.END_DATE')" name="endDate">
            <UInput v-model="state.endDate" type="date" class="w-full" />
          </UFormField>
        </div>

        <UFormField :label="$t('ADMIN.CLASSES.STUDENTS')" name="studentIds">
          <div class="space-y-2">
            <USelect
              :items="studentOptions"
              :placeholder="$t('ADMIN.CLASSES.SELECT_STUDENT')"
              class="w-full"
              @update:model-value="addSelectedStudent"
            />

            <div v-if="state.studentIds && state.studentIds.length > 0" class="space-y-1 max-h-32 overflow-y-auto">
              <div
                v-for="id in state.studentIds"
                :key="id"
                class="flex items-center justify-between bg-muted/10 px-2 py-1 rounded text-sm"
              >
                <span class="text-highlighted">{{ getStudentName(id) }}</span>
                <UButton
                  icon="i-lucide-x"
                  size="xs"
                  color="error"
                  variant="ghost"
                  @click="removeStudentId(id)"
                />
              </div>
            </div>
          </div>
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            :label="$t('COMMON.CANCEL')"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            :label="$t('COMMON.SAVE')"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
