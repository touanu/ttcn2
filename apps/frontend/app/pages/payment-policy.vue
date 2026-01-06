<script setup lang="ts">
definePageMeta({
  title: 'Payment Policy',
})
</script>

<template>
  <div class="container mx-auto max-w-4xl px-4 py-16">
    <div class="mb-12 text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
        {{ $t('LEGAL.PAYMENT_POLICY') }}
      </h1>
      <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Last updated: {{ new Date().toLocaleDateString() }}
      </p>
    </div>

    <div class="prose prose-gray mx-auto dark:prose-invert">
      <UCard>
        <h2>1. Payment Methods</h2>
        <p>
          We accept various payment methods including credit cards (Visa, Mastercard, American Express), PayPal,
          and local payment methods depending on your region.
        </p>

        <h2>2. Pricing</h2>
        <p>
          All prices are listed in USD unless otherwise stated. Prices are subject to change, but changes will not
          affect existing subscriptions until renewal.
        </p>

        <h2>3. Subscription Billing</h2>
        <p>
          Subscriptions are billed in advance on a recurring basis (monthly or annually). Your subscription will
          automatically renew unless cancelled before the renewal date.
        </p>

        <h2>4. Refund Policy</h2>
        <p>
          We offer a 14-day money-back guarantee for new subscriptions. If you're not satisfied with our service,
          contact us within 14 days of purchase for a full refund.
        </p>

        <h2>5. Cancellation</h2>
        <p>
          You may cancel your subscription at any time through your account settings. Cancellation will take effect
          at the end of your current billing period.
        </p>

        <h2>6. Failed Payments</h2>
        <p>
          If a payment fails, we will attempt to process it again. If payment continues to fail, your subscription
          may be suspended until payment is successfully processed.
        </p>

        <h2>7. Taxes</h2>
        <p>
          Prices do not include applicable taxes. You are responsible for paying all taxes associated with your purchase.
        </p>

        <h2>8. Currency Conversion</h2>
        <p>
          If you pay in a currency other than USD, the amount charged may vary based on exchange rates and your
          financial institution's conversion fees.
        </p>

        <h2>9. Payment Security</h2>
        <p>
          We use industry-standard encryption and security measures to protect your payment information. We do not
          store your credit card details on our servers.
        </p>

        <h2>10. Contact</h2>
        <p>
          For any payment-related questions or issues, please contact our support team at billing@englearn.com.
        </p>
      </UCard>
    </div>
  </div>
</template>
