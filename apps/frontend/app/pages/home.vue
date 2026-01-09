<script setup lang="ts">
import { isAuthenticated } from '~~/shared/utils/abilities'

definePageMeta({
  title: 'Home',
})
</script>

<template>
  <div class="container mx-auto px-4 py-16">
    <!-- Hero section for unauthenticated users using Cannot component -->
    <Cannot :ability="isAuthenticated">
      <div class="mb-16 text-center">
        <h1 class="mb-6 text-5xl font-bold text-gray-900 dark:text-white">
          Welcome to English Platform
        </h1>
        <p class="mb-8 text-xl text-gray-600 dark:text-gray-400">
          Learn English online with our comprehensive courses and interactive lessons
        </p>
        <div class="flex justify-center gap-4">
          <UButton to="/login" color="primary" size="xl" trailing-icon="i-heroicons-arrow-right">
            Get Started
          </UButton>
          <UButton to="/courses" color="neutral" variant="soft" size="xl">
            View Courses
          </UButton>
        </div>
      </div>
    </Cannot>

    <!-- Hero section for authenticated users using Can component -->
    <Can :ability="isAuthenticated">
      <div class="mb-16 text-center">
        <h1 class="mb-6 text-5xl font-bold text-gray-900 dark:text-white">
          Welcome Back!
        </h1>
        <p class="mb-8 text-xl text-gray-600 dark:text-gray-400">
          Continue your learning journey
        </p>
        <div class="flex justify-center gap-4">
          <UButton to="/dashboard" color="primary" size="xl" trailing-icon="i-heroicons-arrow-right">
            Go to Dashboard
          </UButton>
          <UButton to="/courses" color="neutral" variant="soft" size="xl">
            Browse Courses
          </UButton>
        </div>
      </div>
    </Can>

    <!-- Features section -->
    <div class="mb-16 grid gap-8 md:grid-cols-3">
      <UCard>
        <div class="text-center">
          <div class="mb-4 flex justify-center">
            <UIcon name="i-heroicons-academic-cap" class="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="mb-2 text-xl font-semibold">
            Quality Courses
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Learn from expertly crafted courses designed for all skill levels
          </p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <div class="mb-4 flex justify-center">
            <UIcon name="i-heroicons-users" class="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="mb-2 text-xl font-semibold">
            Expert Teachers
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Get guidance from experienced English language instructors
          </p>
        </div>
      </UCard>

      <UCard>
        <div class="text-center">
          <div class="mb-4 flex justify-center">
            <UIcon name="i-heroicons-chart-bar" class="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="mb-2 text-xl font-semibold">
            Track Progress
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Monitor your learning journey with detailed progress tracking
          </p>
        </div>
      </UCard>
    </div>

    <!-- CTA section using Bouncer for cleaner conditional rendering -->
    <UCard class="bg-primary-50 dark:bg-primary-950">
      <div class="py-8 text-center">
        <h2 class="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
          Ready to Start Learning?
        </h2>
        <p class="mb-6 text-lg text-gray-600 dark:text-gray-400">
          Join thousands of students improving their English skills every day
        </p>
        <Bouncer :ability="isAuthenticated">
          <template #cannot>
            <UButton to="/login" color="primary" size="xl" trailing-icon="i-heroicons-arrow-right">
              Sign Up Now
            </UButton>
          </template>
          <template #can>
            <UButton to="/courses" color="primary" size="xl" trailing-icon="i-heroicons-arrow-right">
              View All Courses
            </UButton>
          </template>
        </Bouncer>
      </div>
    </UCard>
  </div>
</template>
