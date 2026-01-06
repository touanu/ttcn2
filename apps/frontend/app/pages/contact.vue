<script setup lang="ts">
definePageMeta({
  title: 'Contact Us',
})
</script>

<template>
  <div class="container mx-auto max-w-6xl px-4 py-16">
    <PageHeader
      :title="$t('FOOTER.ABOUT.CONTACT')"
      :subtitle="$t('CONTACT.SUBTITLE')"
      icon="i-heroicons-chat-bubble-left-right"
      icon-gradient-from="from-blue-500"
      icon-gradient-to="to-purple-600"
    />
    <div class="grid gap-8 md:grid-cols-3">
      <InfoCard
        icon="i-heroicons-phone"
        :title="$t('CONTACT.PHONE_NUMBER')"
        value="0987654321"
      />

      <InfoCard
        icon="i-heroicons-envelope"
        :title="$t('CONTACT.EMAIL')"
        value="info@englearn.com"
      />

      <InfoCard
        icon="i-heroicons-map-pin"
        :title="$t('CONTACT.ADDRESS')"
        value="123 English Street, Learning City, Vietnam"
      />
    </div>
  </div>
</template>
