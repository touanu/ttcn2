<script setup lang="ts">
definePageMeta({
  title: 'Careers',
})

interface Position {
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
  responsibilities: string[]
}

const { data: positions, pending, error } = await useFetch<Position[]>('/api/careers')

/* const openPositions: Position[] = [
  {
    title: 'Senior English Teacher',
    department: 'Education',
    location: 'Remote',
    type: 'Full-time',
    description: 'Lead curriculum development and teach advanced English courses to help students achieve their learning goals.',
    requirements: [
      'Bachelor\'s degree in English, Education, or related field',
      '5+ years of teaching experience',
      'Native or near-native English proficiency',
      'Strong communication and presentation skills',
    ],
    responsibilities: [
      'Develop and deliver engaging English courses',
      'Create comprehensive curriculum materials',
      'Mentor junior teachers and provide feedback',
      'Track student progress and adjust teaching methods',
    ],
  },
  {
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Hanoi, Vietnam',
    type: 'Full-time',
    description: 'Build amazing user experiences with Vue.js and Nuxt to create the best learning platform.',
    requirements: [
      '3+ years of experience with Vue.js/Nuxt.js',
      'Strong TypeScript and JavaScript knowledge',
      'Experience with responsive design and UI/UX principles',
      'Familiarity with modern build tools and Git',
    ],
    responsibilities: [
      'Develop and maintain frontend applications',
      'Collaborate with designers and backend developers',
      'Write clean, maintainable, and testable code',
      'Optimize applications for maximum speed and scalability',
    ],
  },
  {
    title: 'Content Creator',
    department: 'Content',
    location: 'Remote',
    type: 'Full-time',
    description: 'Create engaging educational content and videos that inspire learners around the world.',
    requirements: [
      '2+ years of content creation experience',
      'Excellent writing and communication skills',
      'Proficiency with video editing tools',
      'Understanding of SEO and content marketing',
    ],
    responsibilities: [
      'Create educational videos and written content',
      'Develop engaging lesson materials',
      'Collaborate with the education team',
      'Analyze content performance and optimize strategies',
    ],
  },
  {
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Ho Chi Minh City, Vietnam',
    type: 'Full-time',
    description: 'Develop and execute marketing strategies to grow our platform and reach more learners.',
    requirements: [
      '3+ years of digital marketing experience',
      'Strong understanding of SEO, SEM, and social media',
      'Experience with marketing analytics tools',
      'Excellent project management skills',
    ],
    responsibilities: [
      'Plan and execute marketing campaigns',
      'Manage social media channels',
      'Analyze campaign performance and ROI',
      'Collaborate with content and design teams',
    ],
  },
] */
</script>

<template>
  <div class="container mx-auto max-w-5xl px-4 py-16">
    <PageHeader
      :title="$t('FOOTER.ABOUT.CAREERS')"
      :subtitle="$t('CAREERS.SUBTITLE')"
      icon="i-heroicons-briefcase"
      icon-gradient-from="from-green-500"
      icon-gradient-to="to-teal-600"
    />
    <UCard class="bg-linear-to-br from-primary-50 to-blue-50 dark:from-primary-950 dark:to-blue-950">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-primary-500 to-primary-600">
            <UIcon name="i-heroicons-sparkles" class="h-5 w-5 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ $t('CAREERS.WHY_WORK_TITLE') }}
          </h2>
        </div>
      </template>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="flex items-start gap-3">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
            <UIcon name="i-heroicons-heart" class="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <p class="text-gray-700 dark:text-gray-300">
            {{ $t('CAREERS.WHY_WORK.PASSIONATE_TEAM') }}
          </p>
        </div>
        <div class="flex items-start gap-3">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
            <UIcon name="i-heroicons-home" class="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p class="text-gray-700 dark:text-gray-300">
            {{ $t('CAREERS.WHY_WORK.FLEXIBLE') }}
          </p>
        </div>
        <div class="flex items-start gap-3">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
            <UIcon name="i-heroicons-currency-dollar" class="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p class="text-gray-700 dark:text-gray-300">
            {{ $t('CAREERS.WHY_WORK.COMPETITIVE') }}
          </p>
        </div>
        <div class="flex items-start gap-3">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
            <UIcon name="i-heroicons-academic-cap" class="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p class="text-gray-700 dark:text-gray-300">
            {{ $t('CAREERS.WHY_WORK.LEARNING') }}
          </p>
        </div>
        <div class="flex items-start gap-3 md:col-span-2">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
            <UIcon name="i-heroicons-globe-alt" class="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <p class="text-gray-700 dark:text-gray-300">
            {{ $t('CAREERS.WHY_WORK.IMPACT') }}
          </p>
        </div>
      </div>
    </UCard>
  </div>

  <CommonLoading v-if="pending" />
  <CommonError v-else-if="error" :message="error.message" />
  <CommonEmpty
    v-else-if="!positions || positions.length === 0"
    title="No open positions"
    description="Check back later for new opportunities"
    icon="i-heroicons-briefcase"
  />

  <div v-else>
    <div class="mb-8 flex items-center justify-between">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ $t('CAREERS.OPEN_POSITIONS') }}
      </h2>
      <UBadge color="primary" size="lg">
        {{ positions.length }} positions
      </UBadge>
    </div>
    <div class="space-y-6">
      <UCard v-for="position in positions" :key="position.title" class="hover:shadow-xl transition-all duration-300">
        <div class="space-y-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex-1 space-y-3">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ position.title }}
              </h3>
              <div class="flex flex-wrap items-center gap-3">
                <UBadge color="primary" size="md" variant="subtle">
                  <UIcon name="i-heroicons-briefcase" class="h-3 w-3" />
                  {{ position.department }}
                </UBadge>
                <UBadge color="success" size="md" variant="subtle">
                  <UIcon name="i-heroicons-map-pin" class="h-3 w-3" />
                  {{ position.location }}
                </UBadge>
                <UBadge color="info" size="md" variant="subtle">
                  <UIcon name="i-heroicons-clock" class="h-3 w-3" />
                  {{ position.type }}
                </UBadge>
              </div>
              <p class="text-gray-600 dark:text-gray-400">
                {{ position.description }}
              </p>
            </div>
            <UButton color="primary" size="lg" trailing-icon="i-heroicons-arrow-right">
              {{ $t('CAREERS.APPLY_NOW') }}
            </UButton>
          </div>

          <USeparator />

          <div class="grid gap-6 md:grid-cols-2">
            <div>
              <h4 class="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <UIcon name="i-heroicons-check-badge" class="h-5 w-5 text-primary-500" />
                Requirements
              </h4>
              <ul class="space-y-2">
                <li v-for="(req, idx) in position.requirements" :key="idx" class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <UIcon name="i-heroicons-check-circle" class="mt-0.5 h-4 w-4 shrink-0 text-success-500" />
                  <span>{{ req }}</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 class="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <UIcon name="i-heroicons-clipboard-document-list" class="h-5 w-5 text-primary-500" />
                Responsibilities
              </h4>
              <ul class="space-y-2">
                <li v-for="(resp, idx) in position.responsibilities" :key="idx" class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <UIcon name="i-heroicons-arrow-right-circle" class="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                  <span>{{ resp }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
