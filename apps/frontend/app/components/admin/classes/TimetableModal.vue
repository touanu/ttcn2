<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CreateTimeTableDto } from '@shared/schemas'
import type { Class, TimeTable } from '@shared/types'
import { DAY_OF_WEEK } from '@shared/constants'
import { createTimeTableSchema } from '@shared/schemas'

const props = defineProps<{
  classItem: Class
}>()

const emit = defineEmits<{
  updated: []
}>()

const open = defineModel<boolean>('open', { required: true })
const { $api } = useNuxtApp()
const { t: $t } = useI18n()

const addMode = ref(false)
const editMode = ref(false)
const selectedTimetable = ref<TimeTable | null>(null)

const state = reactive<Partial<CreateTimeTableDto>>({
  classId: props.classItem._id,
  dayOfWeek: undefined,
  startTime: undefined,
  endTime: undefined,
})

const deleteModalOpen = ref(false)
const timetableToDelete = ref<TimeTable | null>(null)

const startTimeInput = ref<string>()
const endTimeInput = ref<string>()

const validateForm = createFormValidator(createTimeTableSchema)

// Fetch timetables for this class
const { data: timetables, status, refresh: refreshTimetables } = await useAPI<TimeTable[]>(
  `/api/admin/classes/${props.classItem._id}/timetables`,
  {
    lazy: true,
    server: false,
    immediate: false,
    watch: [open],
  },
)

// Watch for modal open to fetch data
watch(open, (isOpen) => {
  if (isOpen) {
    refreshTimetables()
  }
})

const dayOfWeekOptions = computed(() => [
  { label: $t('COMMON.DAYS.MONDAY'), value: DAY_OF_WEEK.MONDAY },
  { label: $t('COMMON.DAYS.TUESDAY'), value: DAY_OF_WEEK.TUESDAY },
  { label: $t('COMMON.DAYS.WEDNESDAY'), value: DAY_OF_WEEK.WEDNESDAY },
  { label: $t('COMMON.DAYS.THURSDAY'), value: DAY_OF_WEEK.THURSDAY },
  { label: $t('COMMON.DAYS.FRIDAY'), value: DAY_OF_WEEK.FRIDAY },
  { label: $t('COMMON.DAYS.SATURDAY'), value: DAY_OF_WEEK.SATURDAY },
  { label: $t('COMMON.DAYS.SUNDAY'), value: DAY_OF_WEEK.SUNDAY },
])

const sortedTimetables = computed(() => {
  if (!timetables.value)
    return []
  return [...timetables.value]
    .filter(t => t.dayOfWeek !== undefined && t.dayOfWeek !== null)
    .sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) {
        return a.dayOfWeek - b.dayOfWeek
      }
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    })
})

function formatTime(date: Date | string) {
  try {
    const d = new Date(date)
    if (Number.isNaN(d.getTime())) {
      return '--:--'
    }
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }
  catch {
    return '--:--'
  }
}

function formatTimeForInput(date?: Date | string) {
  if (!date)
    return undefined

  try {
    const d = new Date(date)
    if (Number.isNaN(d.getTime())) {
      return undefined
    }
    return d.toTimeString().slice(0, 5) // HH:MM format
  }
  catch {
    return undefined
  }
}

function getDayName(dayOfWeek: number) {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
  if (dayOfWeek === undefined || dayOfWeek === null || !days[dayOfWeek]) {
    return 'UNKNOWN'
  }
  return $t(`COMMON.DAYS.${days[dayOfWeek]}`)
}

function openAddForm() {
  addMode.value = true
  editMode.value = false
  selectedTimetable.value = null
  state.classId = props.classItem._id
  state.dayOfWeek = undefined
  state.startTime = undefined
  state.endTime = undefined
  startTimeInput.value = ''
  endTimeInput.value = ''
}

function openEditForm(timetable: TimeTable) {
  addMode.value = false
  editMode.value = true
  selectedTimetable.value = timetable
  state.dayOfWeek = timetable.dayOfWeek
  startTimeInput.value = formatTimeForInput(timetable.startTime)
  endTimeInput.value = formatTimeForInput(timetable.endTime)
}

function cancelForm() {
  addMode.value = false
  editMode.value = false
  selectedTimetable.value = null
  state.dayOfWeek = undefined
  state.startTime = undefined
  state.endTime = undefined
  startTimeInput.value = ''
  endTimeInput.value = ''
}

// Watch time inputs and convert to Date objects
watch([startTimeInput, endTimeInput], ([start, end]) => {
  if (start) {
    const [hours = '0', minutes = '0'] = start.split(':')
    const date = new Date()
    date.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10), 0, 0)
    state.startTime = date
  }
  if (end) {
    const [hours = '0', minutes = '0'] = end.split(':')
    const date = new Date()
    date.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10), 0, 0)
    state.endTime = date
  }
})

async function onSubmit(event: FormSubmitEvent<CreateTimeTableDto>) {
  if (editMode.value && selectedTimetable.value) {
    await $api(`/api/admin/classes/${props.classItem._id}/timetables/${selectedTimetable.value._id}`, {
      method: 'PATCH',
      body: {
        dayOfWeek: event.data.dayOfWeek,
        startTime: event.data.startTime,
        endTime: event.data.endTime,
      },
    })
  }
  else {
    await $api(`/api/admin/classes/${props.classItem._id}/timetables`, {
      method: 'POST',
      body: event.data,
    })
  }

  await refreshTimetables()
  cancelForm()
  emit('updated')
}

function openDeleteModal(timetable: TimeTable) {
  timetableToDelete.value = timetable
  deleteModalOpen.value = true
}

async function confirmDelete() {
  if (!timetableToDelete.value)
    return

  await $api(`/api/admin/classes/${props.classItem._id}/timetables/${timetableToDelete.value._id}`, {
    method: 'DELETE',
  })

  await refreshTimetables()
  deleteModalOpen.value = false
  timetableToDelete.value = null
  emit('updated')
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="$t('ADMIN.CLASSES.TIMETABLE.TITLE')"
    :description="classItem.name"
    :ui="{ content: 'sm:max-w-2xl' }"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div>
          <h3 class="text-xl font-semibold">
            {{ $t('ADMIN.CLASSES.TIMETABLE.TITLE') }}
          </h3>
          <p class="text-sm text-muted mt-1">
            {{ classItem.name }}
          </p>
        </div>
        <UButton
          v-if="!addMode && !editMode"
          color="primary"
          icon="i-heroicons-plus"
          @click="openAddForm"
        >
          {{ $t('ADMIN.CLASSES.TIMETABLE.ADD') }}
        </UButton>
      </div>
    </template>

    <template #body>
      <!-- Add/Edit Form -->
      <div v-if="addMode || editMode" class="space-y-4 mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div class="flex items-center justify-between mb-4">
          <h4 class="font-medium">
            {{ editMode ? $t('ADMIN.CLASSES.TIMETABLE.EDIT') : $t('ADMIN.CLASSES.TIMETABLE.ADD') }}
          </h4>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-x-mark"
            size="sm"
            @click="cancelForm"
          />
        </div>

        <UForm :state="state" :validate="validateForm" @submit="onSubmit">
          <UFormField :label="$t('ADMIN.CLASSES.TIMETABLE.DAY_OF_WEEK')" name="dayOfWeek" required>
            <USelect
              v-model="state.dayOfWeek"
              :items="dayOfWeekOptions"
              :placeholder="$t('ADMIN.CLASSES.TIMETABLE.SELECT_DAY')"
            />
          </UFormField>

          <div class="grid grid-cols-2 gap-4 mt-4">
            <UFormField :label="$t('ADMIN.CLASSES.TIMETABLE.START_TIME')" name="startTime" required>
              <UInput
                v-model="startTimeInput"
                type="time"
                :placeholder="$t('ADMIN.CLASSES.TIMETABLE.START_TIME')"
              />
            </UFormField>

            <UFormField :label="$t('ADMIN.CLASSES.TIMETABLE.END_TIME')" name="endTime" required>
              <UInput
                v-model="endTimeInput"
                type="time"
                :placeholder="$t('ADMIN.CLASSES.TIMETABLE.END_TIME')"
              />
            </UFormField>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <UButton type="button" color="neutral" variant="subtle" @click="cancelForm">
              {{ $t('COMMON.CANCEL') }}
            </UButton>
            <UButton type="submit" color="primary">
              {{ editMode ? $t('COMMON.UPDATE') : $t('COMMON.ADD') }}
            </UButton>
          </div>
        </UForm>
      </div>

      <!-- Timetable List -->
      <div v-if="!addMode && !editMode" class="space-y-3">
        <div v-if="status === 'pending'" class="flex items-center justify-center py-8">
          <CommonLoading />
        </div>

        <div v-else-if="!sortedTimetables.length" class="text-center py-8">
          <UIcon name="i-heroicons-calendar" class="text-4xl text-muted mb-2" />
          <p class="text-muted">
            {{ $t('ADMIN.CLASSES.TIMETABLE.NO_TIMETABLES') }}
          </p>
        </div>

        <div
          v-for="timetable in sortedTimetables"
          v-else
          :key="timetable._id"
          class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <UBadge color="primary" variant="subtle">
                {{ getDayName(timetable.dayOfWeek) }}
              </UBadge>
              <div class="flex items-center gap-2 text-sm">
                <UIcon name="i-heroicons-clock" class="text-muted" />
                <span>{{ formatTime(timetable.startTime) }} - {{ formatTime(timetable.endTime) }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-pencil"
              size="sm"
              @click="openEditForm(timetable)"
            />
            <UButton
              color="error"
              variant="ghost"
              icon="i-heroicons-trash"
              size="sm"
              @click="openDeleteModal(timetable)"
            />
          </div>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex justify-end">
        <UButton color="neutral" variant="subtle" @click="close">
          {{ $t('COMMON.CLOSE') }}
        </UButton>
      </div>
    </template>
  </UModal>

  <!-- Delete Confirmation Modal -->
  <UModal
    v-model:open="deleteModalOpen"
    :title="$t('COMMON.DELETE')"
  >
    <template #body>
      <p class="text-muted">
        {{ $t('ADMIN.CLASSES.TIMETABLE.DELETE_CONFIRM') }}
      </p>
    </template>

    <template #footer="{ close }">
      <div class="flex justify-end gap-2">
        <UButton color="neutral" variant="subtle" @click="close">
          {{ $t('COMMON.CANCEL') }}
        </UButton>
        <UButton color="error" @click="confirmDelete">
          {{ $t('COMMON.DELETE') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
