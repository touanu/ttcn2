<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

const { $api } = useNuxtApp()
const { setLocale, getLocaleCookie } = useI18n()
const route = useRoute()
const { loggedIn, user, fetch: fetchSession } = useUserSession()

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

const loginItem: NavigationMenuItem = {
  label: $t('AUTH.BUTTON.LOGIN'),
  to: '/login',
  icon: 'i-ph-sign-in',
  active: route.path.startsWith('/login'),
}

const userActionItems = ref<DropdownMenuItem[]>([
  {
    label: $t('NAVIGATION.USER.DROPDOWN.PROFILE'),
    to: '/profile',
    icon: 'i-ph-user-circle',
  },
  {
    label: $t('NAVIGATION.USER.DROPDOWN.MY_COURSES'),
    to: '/my-courses',
    icon: 'i-ph-book-open',
  },
  {
    label: $t('NAVIGATION.USER.DROPDOWN.SETTINGS'),
    to: '/settings',
    icon: 'i-ph-gear',
  },
  {
    label: $t('NAVIGATION.USER.DROPDOWN.LOGOUT'),
    onClick: async () => {
      await $api('/api/auth/logout', { method: 'POST' })
      fetchSession()
      await navigateTo('/')
    },
    icon: 'i-ph-sign-out',
    class: 'cursor-pointer',
  },
])

const navigationUserActionMenuItems = computed(() => {
  const items: NavigationMenuItem[] = [
    {
      type: 'label',
      label: $t('NAVIGATION.USER.ACTION_MENU_TITLE'),
    },
  ]

  if (loggedIn.value)
    items.push(...toNavigationMenuItem(userActionItems.value))
  else
    items.push(loginItem)
  return items
})

async function addAdminLink() {
  const firstLink = userActionItems.value[0]
  const student = await allows(isStudent)
  const isFirstLinkAdmin = firstLink?.to === '/admin'

  if (isFirstLinkAdmin && student) {
    userActionItems.value.shift()
  }
  else if (!isFirstLinkAdmin && !student) {
    userActionItems.value.unshift({
      label: $t('ADMIN.TITLE'),
      to: '/admin',
      icon: 'i-ph-shield-checkered',
    })
  }
}
</script>

<template>
  <UHeader>
    <template #title>
      <div class="flex items-center gap-2 font-semibold text-lg">
        <LayoutLogo class="w-auto h-8 shrink-0" />
        <span>Zenlish</span>
      </div>
    </template>

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
            src: '',
            icon: 'i-ph-user-circle',
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
          @update:open="addAdminLink"
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
      <UInput
        icon="i-lucide-search"
        size="md" variant="outline"
        :placeholder="$t('FORMS.SEARCH_PLACEHOLDER')"
        class="mb-4 h-9 flex items-center gap-2"
        :loading="false"
      />

      <UNavigationMenu
        :items="navigationUserActionMenuItems"
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
          <LayoutLogo class="w-auto h-6 shrink-0" />
          <span class="">Zenlish</span>
        </div>

        <div class="text-muted text-sm">
          <label>{{ $t('CONTACT.PHONE_NUMBER') }}: </label>
          <ULink to="tel:0987654321" class="hover:underline">
            0987654321
          </ULink>

          <br>

          <label>{{ $t('CONTACT.EMAIL') }}: </label>
          <ULink to="mailto:info@englearn.com" class="hover:underline">
            info@englearn.com
          </ULink>

          <br>

          <label>{{ $t('CONTACT.ADDRESS') }}: </label>
          123 Đường ABC, Quận XYZ, Thành phố HCM
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-2">
          {{ $t('FOOTER.ABOUT.TITLE') }}
        </h3>
        <ul class="flex flex-col gap-1 text-sm">
          <li>
            <ULink to="/about" class="hover:underline">
              {{ $t('FOOTER.ABOUT.LINK') }}
            </ULink>
          </li>
          <li>
            <ULink to="/contact" class="hover:underline">
              {{ $t('FOOTER.ABOUT.CONTACT') }}
            </ULink>
          </li>
          <li>
            <ULink to="/team" class="hover:underline">
              {{ $t('FOOTER.ABOUT.TEAM') }}
            </ULink>
          </li>
          <li>
            <ULink to="/careers" class="hover:underline">
              {{ $t('FOOTER.ABOUT.CAREERS') }}
            </ULink>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="font-semibold mb-2">
          {{ $t('FOOTER.SUPPORT.TITLE') }}
        </h3>
        <ul class="flex flex-col gap-1 text-sm">
          <li>
            <ULink to="/help-center" class="hover:underline">
              {{ $t('FOOTER.SUPPORT.HELP_CENTER') }}
            </ULink>
          </li>
          <li>
            <ULink to="/terms" class="hover:underline">
              {{ $t('LEGAL.TERMS_OF_SERVICE') }}
            </ULink>
          </li>
          <li>
            <ULink to="/privacy" class="hover:underline">
              {{ $t('LEGAL.PRIVACY_POLICY') }}
            </ULink>
          </li>
          <li>
            <ULink to="/payment-policy" class="hover:underline">
              {{ $t('LEGAL.PAYMENT_POLICY') }}
            </ULink>
          </li>
        </ul>
      </div>

      <div>
        <h3>{{ $t('FOOTER.NEWSLETTER.TITLE') }}</h3>
        <p class="text-sm text-muted mb-2">
          {{ $t('FOOTER.NEWSLETTER.DESCRIPTION') }}
        </p>

        <LayoutInputWithButton
          :placeholder="$t('FOOTER.NEWSLETTER.PLACEHOLDER')"
          :button-text="$t('FOOTER.NEWSLETTER.BUTTON')"
        />
      </div>
    </div>
  </UFooter>

  <USeparator />

  <UFooter>
    <template #left>
      <p class="text-sm text-muted">
        &copy; {{ new Date().getFullYear() }} Zenlish. All rights reserved.
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
