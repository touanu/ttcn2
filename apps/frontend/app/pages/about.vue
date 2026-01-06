<script setup lang="ts">
definePageMeta({
  title: 'About Us',
})
</script>

<template>
  <div class="container mx-auto max-w-5xl px-4 py-16">
    <PageHeader
      :title="$t('FOOTER.ABOUT.LINK')"
      :subtitle="$t('ABOUT.SUBTITLE')"
      icon="i-heroicons-heart"
      icon-gradient-from="from-primary-500"
      icon-gradient-to="to-primary-600"
    />

    <div class="space-y-8">
      <UCard class="overflow-hidden">
        <div class="space-y-8 p-8">
          <div class="flex items-start gap-6">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900">
              <UIcon name="i-heroicons-light-bulb" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ $t('ABOUT.MISSION_TITLE') }}
              </h2>
              <p class="mt-3 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                {{ $t('ABOUT.MISSION_DESC') }}
              </p>
            </div>
          </div>
          <USeparator />
          <div class="flex items-start gap-6">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <UIcon name="i-heroicons-book-open" class="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ $t('ABOUT.STORY_TITLE') }}
              </h2>
              <p class="mt-3 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                {{ $t('ABOUT.STORY_DESC') }}
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-pink-500">
              <UIcon name="i-heroicons-sparkles" class="h-5 w-5 text-white" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ $t('ABOUT.VALUES_TITLE') }}
            </h2>
          </div>
        </template>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="flex gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <UIcon name="i-heroicons-trophy" class="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white">
                {{ $t('ABOUT.VALUES.EXCELLENCE') }}
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ $t('ABOUT.VALUES.EXCELLENCE_DESC') }}
              </p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <UIcon name="i-heroicons-rocket-launch" class="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white">
                {{ $t('ABOUT.VALUES.INNOVATION') }}
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ $t('ABOUT.VALUES.INNOVATION_DESC') }}
              </p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
              <UIcon name="i-heroicons-globe-alt" class="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white">
                {{ $t('ABOUT.VALUES.ACCESSIBILITY') }}
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ $t('ABOUT.VALUES.ACCESSIBILITY_DESC') }}
              </p>
            </div>
          </div>
          <div class="flex gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <UIcon name="i-heroicons-users" class="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white">
                {{ $t('ABOUT.VALUES.COMMUNITY') }}
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ $t('ABOUT.VALUES.COMMUNITY_DESC') }}
              </p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
