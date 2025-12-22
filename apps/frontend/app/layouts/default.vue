<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const { setLocale, getLocaleCookie } = useI18n()
const route = useRoute()

const currentLanguageIcon = ref('')
function selectLanguage(language: 'vi' | 'en', icon: string) {
  setLocale(language)
  currentLanguageIcon.value = icon
}

const languageItems = ref<DropdownMenuItem[]>([
  {
    label: 'Tiếng Việt',
    value: 'vi',
    icon: 'i-twemoji-flag-vietnam',
    onClick: () => selectLanguage('vi', 'i-twemoji-flag-vietnam'),
  },
  {
    label: 'English',
    value: 'en',
    icon: 'i-twemoji-flag-united-kingdom',
    onClick: () => selectLanguage('en', 'i-twemoji-flag-united-kingdom'),
  },
])

// Đặt biểu tượng ngôn ngữ hiện tại khi component được mounted
onMounted(() => {
  const locale = getLocaleCookie()
  languageItems.value.forEach((item) => {
    if (item.value === locale) {
      currentLanguageIcon.value = item.icon as string
    }
  })
})

const navigaionItems = computed<NavigationMenuItem[]>(() => [
  {
    label: $t('NAV_HOME'),
    to: '/',
    icon: 'i-ph-house',
    active: route.path.startsWith('/'),
  },
  {
    label: $t('NAV_COURSES'),
    to: '/courses',
    icon: 'i-ph-book-open',
    active: route.path.startsWith('/courses'),
  },
  {
    label: $t('NAV_ROADMAP'),
    to: '/roadmap',
    icon: 'i-ph-map-trifold',
    active: route.path.startsWith('/roadmap'),
  },
  {
    label: $t('NAV_BLOG'),
    to: '/blog',
    icon: 'i-ph-newspaper',
    active: route.path.startsWith('/blog'),
  },
])
</script>

<template>
  <UHeader>
    <template #title>
      <div class="flex items-center gap-2 font-semibold text-lg">
        <AppLogo class="w-auto h-8 shrink-0" />
        <span class="">Englearn</span>
      </div>
    </template>

    <UNavigationMenu
      :items="navigaionItems"
    />

    <template #right>
      <UDropdownMenu :items="languageItems">
        <UButton
          :icon="currentLanguageIcon"
          color="neutral"
          variant="link"
          class="hover:bg-elevated cursor-pointer"
        />
      </UDropdownMenu>

      <UColorModeButton />

      <USeparator
        orientation="vertical"
        class="h-8"
      />

      <AuthModal />
    </template>

    <template #body>
      <SearchBox
        :placeholder="$t('SEARCH_PLACEHOLDER')"
        class="mb-4"
      />

      <UNavigationMenu
        :items="navigaionItems"
        orientation="vertical"
      />
    </template>
  </UHeader>

  <UMain>
    <NuxtPage />
  </UMain>

  <USeparator icon="i-ph-graduation-cap" />

  <UFooter>
    <div class="columns-1 grid md:grid-cols-4 md:columns-4 gap-6 md:gap-8 lg:gap-12">
      <div>
        <div class="flex items-center gap-2 font-semibold text-lg">
          <AppLogo class="w-auto h-6 shrink-0" />
          <span class="">Englearn</span>
        </div>

        <div class="text-muted text-sm">
          <label>{{ $t('INFO_PHONE_NUMBER') }}: </label>
          <NuxtLink to="tel:0987654321" class="hover:underline">
            0987654321
          </NuxtLink>

          <br>

          <label>{{ $t('INFO_EMAIL') }}: </label>
          <NuxtLink to="mailto:info@englearn.com" class="hover:underline">
            info@englearn.com
          </NuxtLink>

          <br>

          <label>{{ $t('INFO_ADDRESS') }}: </label>
          123 Đường ABC, Quận XYZ, Thành phố HCM
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-2">
          {{ $t('ABOUT_TITLE') }}
        </h3>
        <ul class="flex flex-col gap-1 text-sm">
          <li>
            <NuxtLink to="/about" class="hover:underline">
              {{ $t('ABOUT_LINK') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contact" class="hover:underline">
              {{ $t('ABOUT_CONTACT_LINK') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/team" class="hover:underline">
              {{ $t('ABOUT_TEAM_LINK') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/careers" class="hover:underline">
              {{ $t('ABOUT_CAREERS_LINK') }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="font-semibold mb-2">
          {{ $t('SUPPORT_TITLE') }}
        </h3>
        <ul class="flex flex-col gap-1 text-sm">
          <li>
            <NuxtLink to="/help-center" class="hover:underline">
              {{ $t('SUPPORT_HELP_CENTER') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/terms" class="hover:underline">
              {{ $t('SUPPORT_TERMS_OF_SERVICE') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/privacy" class="hover:underline">
              {{ $t('SUPPORT_PRIVACY_POLICY') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/payment-policy" class="hover:underline">
              {{ $t('SUPPORT_PAYMENT_POLICY') }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div>
        <h3>{{ $t('NEWSLETTER_TITLE') }}</h3>
        <p class="text-sm text-muted mb-2">
          {{ $t('NEWSLETTER_DESCRIPTION') }}
        </p>

        <InputWithButton
          :placeholder="$t('NEWSLETTER_PLACEHOLDER')"
          :button-text="$t('NEWSLETTER_BUTTON_TEXT')"
        />
      </div>
    </div>
  </UFooter>

  <USeparator />

  <UFooter>
    <template #left>
      <p class="text-sm text-muted">
        &copy; {{ new Date().getFullYear() }} Englearn. All rights reserved.
      </p>
    </template>

    <template #right>
      <UButton
        icon="i-simple-icons-facebook"
        to="https://www.facebook.com/englearn"
        variant="link"
        size="xs"
        color="neutral"
      />

      <UButton
        icon="i-simple-icons-twitter"
        to="https://www.twitter.com/englearn"
        variant="link"
        size="xs"
        color="neutral"
      />

      <UButton
        icon="i-simple-icons-instagram"
        to="https://www.instagram.com/englearn"
        variant="link"
        size="xs"
        color="neutral"
      />

      <UButton
        icon="i-simple-icons-linkedin"
        to="https://www.linkedin.com/company/englearn"
        variant="link"
        size="xs"
        color="neutral"
      />

      <UButton
        icon="i-simple-icons-youtube"
        to="https://www.youtube.com/englearn"
        variant="link"
        size="xs"
        color="neutral"
      />
    </template>
  </UFooter>
</template>
