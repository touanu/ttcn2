<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CreateClassDto } from '@shared/schemas'
import type { Course, User } from '@shared/types'
import { createClassSchema } from '@shared/schemas'

const open = ref(false)

const state = reactive<Partial<CreateClassDto>>({
  name: undefined,
  courseId: undefined,
  teacherId: undefined,
  studentIds: [],
  room: undefined,
  description: undefined,
  maxStudents: 30,
  status: 'PENDING',
  startDate: undefined,
  endDate: undefined,
})

const startDateInput = ref('')
const endDateInput = ref('')

const toast = useToast()
const validateForm = createFormValidator(createClassSchema)

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

async function onSubmit(event: FormSubmitEvent<CreateClassDto>) {
  try {
    await $fetch('/api/admin/classes', {
      method: 'POST',
      body: event.data,
    })

    toast.add({
      title: $t('COMMON.SUCCESS'),
      description: $t('ADMIN.CLASSES.CLASS_CREATED', { name: event.data.name }),
      color: 'success',
    })

    open.value = false

    // Reset form
    Object.assign(state, {
      name: undefined,
      courseId: undefined,
      teacherId: undefined,
      studentIds: [],
      room: undefined,
      description: undefined,
      maxStudents: 30,
      status: 'PENDING',
      startDate: undefined,
      endDate: undefined,
    })
    startDateInput.value = ''
    endDateInput.value = ''

    // Refresh the classes list
    await refreshNuxtData()
  }
  catch (err: any) {
    toast.add({
      title: $t('ERRORS.TITLE'),
      description: err?.message || $t('ADMIN.CLASSES.CREATE_ERROR'),
      color: 'error',
    })
  }
}
</script>

<template>
  <UModal v-model:open="open" :title="$t('ADMIN.ADD_CLASS')" :description="$t('ADMIN.CLASSES.ADD_CLASS_DESC')">
    <UButton :label="$t('ADMIN.ADD_CLASS')" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="createClassSchema"
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
          <UTextarea v-model="state.description" :placeholder="$t('ADMIN.CLASSES.DESCRIPTION')" :rows="3" class="w-full" />
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
            <UInput v-model="startDateInput" type="date" class="w-full" @update:model-value="(val) => state.startDate = val ? new Date(val) : undefined" />
          </UFormField>

          <UFormField :label="$t('ADMIN.CLASSES.END_DATE')" name="endDate">
            <UInput v-model="endDateInput" type="date" class="w-full" @update:model-value="(val) => state.endDate = val ? new Date(val) : undefined" />
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
            :label="$t('COMMON.CREATE')"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
