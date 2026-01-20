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
const { $api } = useNuxtApp()

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

const validateForm = createFormValidator(updateClassSchema)

// Fetch courses
const { data: courses } = await useAPI<Course[]>('/api/admin/courses', {
  server: false,
})

// Fetch teachers and students
const { data: users } = await useAPI<User[]>('/api/admin/users', {
  lazy: true,
  server: false,
})

const startDateInput = ref<string>()
const endDateInput = ref<string>()

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

function formatDateForInput(date?: Date | string) {
  if (!date)
    return undefined
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

// Watch for classItem changes to populate form
watch(() => props.classItem, (classItem) => {
  if (classItem) {
    const startDateStr = formatDateForInput(classItem.startDate)
    const endDateStr = formatDateForInput(classItem.endDate)

    Object.assign(state, {
      name: classItem.name,
      courseId: classItem.courseId,
      teacherId: classItem.teacherId,
      studentIds: [...(classItem.studentIds || [])],
      room: classItem.room,
      maxStudents: classItem.maxStudents || 30,
      status: classItem.status || 'PENDING',
      startDate: startDateStr ? new Date(startDateStr) : undefined,
      endDate: endDateStr ? new Date(endDateStr) : undefined,
    })

    startDateInput.value = startDateStr || ''
    endDateInput.value = endDateStr || ''
  }
}, { immediate: true })

async function onSubmit(event: FormSubmitEvent<UpdateClassDto>) {
  if (!props.classItem?._id)
    return

  await $api(`/api/admin/classes/${props.classItem._id}`, {
    method: 'PATCH',
    body: event.data,
  })

  open.value = false
  emit('updated')

  // Refresh the classes list
  await refreshNuxtData()
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
