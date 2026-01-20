<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CreateClassDto } from '@shared/schemas'
import type { Course, User } from '@shared/types'
import { createClassSchema } from '@shared/schemas'

const open = ref(false)
const { $api } = useNuxtApp()

const state = reactive<Partial<CreateClassDto>>({
  name: undefined,
  courseId: undefined,
  teacherId: undefined,
  studentIds: [],
  room: undefined,
  maxStudents: 30,
  status: 'PENDING',
  startDate: undefined,
  endDate: undefined,
})

const startDateInput = ref('')
const endDateInput = ref('')

const validateForm = createFormValidator(createClassSchema)

// Fetch courses
const { data: courses } = await useAPI<Course[]>('/api/admin/courses', {
  server: false,
})

// Fetch teachers and students
const { data: users } = await useAPI<User[]>('/api/admin/users', {
  lazy: true,
  server: false,
})

const courseOptions = computed(() => {
  if (!courses.value || courses.value.length === 0) {
    return []
  }
  return courses.value
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

async function onSubmit(event: FormSubmitEvent<CreateClassDto>) {
  await $api('/api/admin/classes', {
    lazy: true,
    method: 'POST',
    body: event.data,
  })

  open.value = false

  // Reset form
  Object.assign(state, {
    name: undefined,
    courseId: undefined,
    teacherId: undefined,
    studentIds: [],
    room: undefined,
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

        <div class="grid grid-cols-2 gap-4">
          <UFormField :label="$t('ADMIN.CLASSES.ROOM')" name="room">
            <UInput v-model="state.room" :placeholder="$t('ADMIN.CLASSES.ROOM')" class="w-full" />
          </UFormField>

          <UFormField :label="$t('ADMIN.CLASSES.MAX_STUDENTS')" name="maxStudents">
            <UInput v-model.number="state.maxStudents" type="number" min="1" max="200" class="w-full" />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <UFormField :label="$t('ADMIN.CLASSES.START_DATE')" name="startDate">
            <UInput v-model="startDateInput" type="date" class="w-full" @update:model-value="(val) => state.startDate = val ? new Date(val) : undefined" />
          </UFormField>

          <UFormField :label="$t('ADMIN.CLASSES.END_DATE')" name="endDate">
            <UInput v-model="endDateInput" type="date" class="w-full" @update:model-value="(val) => state.endDate = val ? new Date(val) : undefined" />
          </UFormField>
        </div>

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
