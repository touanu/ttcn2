<script setup lang="ts">
definePageMeta({
  title: 'Terms of Service',
})
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-16">
    <div class="mb-12 text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
        {{ $t('LEGAL.TERMS_OF_SERVICE') }}
      </h1>
      <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Last updated: {{ new Date().toLocaleDateString() }}
      </p>
    </div>

    <div class="prose prose-gray mx-auto dark:prose-invert">
      <UCard>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Zenlish, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily access the materials (information or software) on Zenlish's platform
          for personal, non-commercial use only.
        </p>

        <h2>3. User Account</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account and password. You agree to accept
          responsibility for all activities that occur under your account.
        </p>

        <h2>4. Course Access</h2>
        <p>
          Course enrollment grants you access to course materials for the duration of your subscription. Access may be
          revoked if terms are violated.
        </p>

        <h2>5. Intellectual Property</h2>
        <p>
          All content, including but not limited to text, graphics, logos, and software, is the property of Zenlish
          and protected by copyright laws.
        </p>

        <h2>6. Prohibited Uses</h2>
        <p>
          You may not use our platform for any illegal purpose or to violate any laws. You may not attempt to gain
          unauthorized access to any part of the platform.
        </p>

        <h2>7. Disclaimer</h2>
        <p>
          The materials on Zenlish's platform are provided on an 'as is' basis. Zenlish makes no warranties,
          expressed or implied, and hereby disclaims all warranties.
        </p>

        <h2>8. Limitations</h2>
        <p>
          In no event shall Zenlish be liable for any damages arising out of the use or inability to use the
          materials on our platform.
        </p>

        <h2>9. Modifications</h2>
        <p>
          Zenlish may revise these terms of service at any time without notice. By using this platform you are
          agreeing to be bound by the current version of these terms.
        </p>

        <h2>10. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at info@englearn.com.
        </p>
      </UCard>
    </div>
  </div>
</template>
