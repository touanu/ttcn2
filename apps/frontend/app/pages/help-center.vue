<script setup lang="ts">
definePageMeta({
  title: 'Help Center',
})

interface FAQ {
  question: string
  answer: string
}

const { data: faqsData, pending, error } = await useAPI<FAQ[]>('/api/faqs')
const faqs = computed(() => faqsData.value || [])
</script>

<template>
  <div class="container mx-auto max-w-5xl px-4 py-16">
    <PageHeader
      :title="$t('FOOTER.SUPPORT.HELP_CENTER')"
      :subtitle="$t('HELP.SUBTITLE')"
      icon="i-heroicons-question-mark-circle"
      icon-gradient-from="from-blue-500"
      icon-gradient-to="to-cyan-600"
    />
    <UCard class="shadow-lg">
      <UInput
        icon="i-heroicons-magnifying-glass"
        size="xl"
        :placeholder="$t('HELP.SEARCH_PLACEHOLDER')"
      >
        <template #trailing>
          <UButton color="primary" size="xs" trailing-icon="i-heroicons-arrow-right">
            Search
          </UButton>
        </template>
      </UInput>
    </UCard>
  </div>

  <AppLoading v-if="pending" />
  <AppError v-else-if="error" :message="error.message" />
  <AppEmpty
    v-else-if="faqs.length === 0"
    title="No FAQs available"
    description="Check back later"
    icon="i-heroicons-question-mark-circle"
  />

  <div v-else class="mb-12">
    <div class="mb-8 flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-primary-500 to-primary-600">
        <UIcon name="i-heroicons-chat-bubble-bottom-center-text" class="h-5 w-5 text-white" />
      </div>
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ $t('HELP.FAQS') }}
      </h2>
    </div>
    <UCard>
      <UAccordion :items="faqs.map(faq => ({ label: faq.question, content: faq.answer, icon: 'i-heroicons-question-mark-circle' }))" size="xl" />
    </UCard>
  </div>

  <UCard class="bg-linear-to-br from-primary-50 to-blue-50 dark:from-primary-950 dark:to-blue-950">
    <div class="text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary-500 to-primary-600 shadow-lg">
        <UIcon name="i-heroicons-chat-bubble-left-right" class="h-8 w-8 text-white" />
      </div>
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('HELP.STILL_NEED_HELP') }}
      </h3>
      <p class="mx-auto mt-3 max-w-md text-gray-600 dark:text-gray-400">
        {{ $t('HELP.CONTACT_SUPPORT') }}
      </p>
      <UButton to="/contact" color="primary" size="lg" class="mt-6" trailing-icon="i-heroicons-arrow-right">
        {{ $t('HELP.CONTACT_US') }}
      </UButton>
    </div>
  </UCard>
</template>
