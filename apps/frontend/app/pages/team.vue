<script setup lang="ts">
import type { User } from '@shared/interfaces'

definePageMeta({
  title: 'Our Team',
})

const { data: response, pending, error } = await useFetch<{ data: User[] }>('/api/team')
const teamMembers = computed(() => response.value?.data || [])
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <PageHeader
      :title="$t('FOOTER.ABOUT.TEAM')"
      :subtitle="$t('TEAM.SUBTITLE')"
      icon="i-heroicons-users"
      icon-gradient-from="from-purple-500"
      icon-gradient-to="to-pink-600"
    />

    <AppLoading v-if="pending" />
    <AppError v-else-if="error" :message="error.message" />
    <AppEmpty
      v-else-if="teamMembers.length === 0"
      title="No team members found"
      description="Check back later"
      icon="i-heroicons-users"
    />

    <div v-else class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <UCard v-for="member in teamMembers" :key="member._id?.toString()" class="group hover:shadow-xl transition-all duration-300">
        <div class="text-center">
          <div class="relative mx-auto mb-4 inline-block">
            <UAvatar :src="member.profilePictureUrl" :alt="member.fullName" size="3xl" class="ring-4 ring-primary-100 dark:ring-primary-900" />
            <div class="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-between rounded-full bg-linear-to-br from-primary-500 to-primary-600 shadow-lg">
              <UIcon name="i-heroicons-check-badge" class="h-5 w-5 text-white" />
            </div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ member.fullName }}
          </h3>
          <p class="mt-2 text-sm font-medium text-primary-600 dark:text-primary-400">
            {{ member.role ? $t(`ROLES.${member.role.toUpperCase()}`) : '' }}
          </p>
          <div class="mt-4 flex justify-center gap-2">
            <UButton color="neutral" variant="ghost" size="xs" icon="i-heroicons-envelope" square :to="`mailto:${member.email}`" />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
