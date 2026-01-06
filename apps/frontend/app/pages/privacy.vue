<script setup lang="ts">
definePageMeta({
  title: 'Privacy Policy',
})
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-16">
    <div class="mb-12 text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
        {{ $t('LEGAL.PRIVACY_POLICY') }}
      </h1>
      <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Last updated: {{ new Date().toLocaleDateString() }}
      </p>
    </div>

    <div class="prose prose-gray mx-auto dark:prose-invert">
      <UCard>
        <h2>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, including your name, email address, and learning progress.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our services, to communicate with you,
          and to personalize your learning experience.
        </p>

        <h2>3. Information Sharing</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share your information
          with service providers who assist us in operating our platform.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information against
          unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2>5. Cookies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our platform and hold certain information.
          You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal information. You can do this through your
          account settings or by contacting us.
        </p>

        <h2>7. Children's Privacy</h2>
        <p>
          Our services are not directed to children under 13. We do not knowingly collect personal information from
          children under 13.
        </p>

        <h2>8. Changes to Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page.
        </p>

        <h2>9. International Data Transfers</h2>
        <p>
          Your information may be transferred to and maintained on servers located outside of your country where
          data protection laws may differ.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at privacy@englearn.com.
        </p>
      </UCard>
    </div>
  </div>
</template>
