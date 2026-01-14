<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CreateUserWithRoleDto } from '@shared/schemas'
import { createUserWithRoleSchema } from '@shared/schemas'

const open = ref(false)

const state = reactive<Partial<CreateUserWithRoleDto>>({
  fullName: undefined,
  username: undefined,
  email: undefined,
  password: undefined,
  role: 'student',
})

const toast = useToast()
const validateForm = createFormValidator(createUserWithRoleSchema)

async function onSubmit(event: FormSubmitEvent<CreateUserWithRoleDto>) {
  try {
    await $fetch('/api/admin/users', {
      method: 'POST',
      body: event.data,
    })

    toast.add({
      title: $t('COMMON.SUCCESS'),
      description: $t('ADMIN.USERS.USER_CREATED', { name: event.data.fullName }),
      color: 'success',
    })

    open.value = false

    // Reset form
    Object.assign(state, {
      fullName: undefined,
      username: undefined,
      email: undefined,
      password: undefined,
      role: 'student',
    })

    // Refresh the users list
    await refreshNuxtData()
  }
  catch (err: any) {
    toast.add({
      title: $t('ERRORS.TITLE'),
      description: err?.message || $t('ADMIN.USERS.CREATE_ERROR'),
      color: 'error',
    })
  }
}
</script>

<template>
  <UModal v-model:open="open" :title="$t('ADMIN.ADD_USER')" :description="$t('ADMIN.USERS.ADD_USER_DESC')">
    <UButton :label="$t('ADMIN.ADD_USER')" icon="i-heroicons-plus" />

    <template #body>
      <UForm
        :schema="createUserWithRoleSchema"
        :validate="validateForm"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField :label="$t('COMMON.FULL_NAME')" placeholder="John Doe" name="fullName">
          <UInput v-model="state.fullName" class="w-full" />
        </UFormField>

        <UFormField :label="$t('COMMON.USERNAME')" placeholder="johndoe" name="username">
          <UInput v-model="state.username" class="w-full" />
        </UFormField>

        <UFormField :label="$t('COMMON.EMAIL')" placeholder="john.doe@example.com" name="email">
          <UInput v-model="state.email" type="email" class="w-full" />
        </UFormField>

        <UFormField :label="$t('COMMON.PASSWORD')" placeholder="••••••••" name="password">
          <UInput v-model="state.password" type="password" class="w-full" />
        </UFormField>

        <UFormField :label="$t('COMMON.ROLE')" name="role">
          <USelect
            v-model="state.role"
            :items="[
              { label: $t('ROLES.STUDENT'), value: 'student' },
              { label: $t('ROLES.TEACHER'), value: 'teacher' },
              { label: $t('ROLES.ADMIN'), value: 'admin' },
              { label: $t('ROLES.SUPERADMIN'), value: 'superadmin' },
            ]"
            class="w-full"
          />
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
