<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const { setLocale, getLocaleCookie } = useI18n()
const route = useRoute()
const { loggedIn, user } = useUserSession()

const currentLanguageIcon = ref('')

async function selectLanguage(language: 'vi' | 'en', icon: string) {
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

const userActionItems = computed<DropdownMenuItem[]>(() => [
  {
    label: $t('USER_DROPDOWN_PROFILE'),
    to: '/profile',
    icon: 'i-ph-user-circle',
  },
  {
    label: $t('USER_DROPDOWN_SETTINGS'),
    to: '/settings',
    icon: 'i-ph-gear',
  },
  {
    label: $t('USER_DROPDOWN_LOGOUT'),
    onClick: async () => {
      const { error } = await useAPI('/auth/logout', { method: 'POST' })
      if (error.value) {
        console.error('Logout failed:', error.value)
        return
      }
      await navigateTo('/')
    },
    icon: 'i-ph-sign-out',
  },
])

const combinedItems = computed<NavigationMenuItem[]>(() => [
  {
    label: $t('NAVIGATION_MENU_TITLE'),
    type: 'label',
  },
  ...navigaionItems.value,
])
if (loggedIn.value && user.value) {
  userActionItems.value.toReversed().forEach((item) => {
    combinedItems.value
      .unshift({
        label: item.label,
        onClick: item.onClick,
        icon: item.icon,
      })
  })
}
else {
  combinedItems.value.unshift({
    label: $t('LOGIN_BUTTON_TEXT'),
    icon: 'i-ph-sign-in-bold',
    type: 'link',
    to: '/login',
  })
}
combinedItems.value.unshift({
  label: $t('USER_ACTION_MENU_TITLE'),
  type: 'label',
})
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
        class="h-8 m-2"
      />

      <div
        v-if="loggedIn && user"
        class="items-center gap-2 hidden sm:flex"
      >
        <UUser
          :name="user.name || user.id"
          :description="user.role || 'Student'"
          :avatar="{
            src: 'https://i.pravatar.cc/150?u=john-doe',
          }"
          :chip="{
            color: 'primary',
            position: 'top-right',
          }"

          class="capitalize"
        />
        <UDropdownMenu
          :items="userActionItems"
          :content="{
            align: 'end',
            side: 'bottom',
            sideOffset: 10,
          }"
        >
          <UButton
            color="neutral"
            variant="link"
            class="hover:bg-elevated cursor-pointer"
            icon="i-ph-dots-three-vertical"
          />
        </UDropdownMenu>
      </div>
      <div v-else class="hidden sm:block">
        <AuthModal />
      </div>
    </template>

    <template #body>
      <SearchBox
        :placeholder="$t('SEARCH_PLACEHOLDER')"
        class="mb-4"
      />

      <UNavigationMenu
        :items="combinedItems"
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
          <ULink to="tel:0987654321" class="hover:underline">
            0987654321
          </ULink>

          <br>

          <label>{{ $t('INFO_EMAIL') }}: </label>
          <ULink to="mailto:info@englearn.com" class="hover:underline">
            info@englearn.com
          </ULink>

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
            <ULink to="/about" class="hover:underline">
              {{ $t('ABOUT_LINK') }}
            </ULink>
          </li>
          <li>
            <ULink to="/contact" class="hover:underline">
              {{ $t('ABOUT_CONTACT_LINK') }}
            </ULink>
          </li>
          <li>
            <ULink to="/team" class="hover:underline">
              {{ $t('ABOUT_TEAM_LINK') }}
            </ULink>
          </li>
          <li>
            <ULink to="/careers" class="hover:underline">
              {{ $t('ABOUT_CAREERS_LINK') }}
            </ULink>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="font-semibold mb-2">
          {{ $t('SUPPORT_TITLE') }}
        </h3>
        <ul class="flex flex-col gap-1 text-sm">
          <li>
            <ULink to="/help-center" class="hover:underline">
              {{ $t('SUPPORT_HELP_CENTER') }}
            </ULink>
          </li>
          <li>
            <ULink to="/terms" class="hover:underline">
              {{ $t('SUPPORT_TERMS_OF_SERVICE') }}
            </ULink>
          </li>
          <li>
            <ULink to="/privacy" class="hover:underline">
              {{ $t('SUPPORT_PRIVACY_POLICY') }}
            </ULink>
          </li>
          <li>
            <ULink to="/payment-policy" class="hover:underline">
              {{ $t('SUPPORT_PAYMENT_POLICY') }}
            </ULink>
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
