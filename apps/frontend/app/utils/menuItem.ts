import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

export function toNavigationMenuItem(item: DropdownMenuItem[]): NavigationMenuItem[] {
  return item.map((menuItem) => {
    const navMenuItem: NavigationMenuItem = {
      label: menuItem.label,
      to: menuItem.to,
      icon: menuItem.icon,
      class: menuItem.class,
    }

    if (menuItem.onClick) {
      navMenuItem.onClick = menuItem.onClick
    }

    if (menuItem.children) {
      navMenuItem.children = toNavigationMenuItem(menuItem.children)
    }

    return navMenuItem
  })
}
