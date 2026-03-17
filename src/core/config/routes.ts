export const appRoutes = {
  root: '/',
  prePurchase: '/pre-purchase',
  onboarding: '/onboarding',
  paywall: '/paywall',
  accountRequired: '/account/required',
  accountAuth: '/account/auth',
  home: '/app',
  checkIn: '/check-in',
  sos: '/sos',
  journal: '/journal',
  relapse: '/relapse',
  analytics: '/analytics',
  settings: '/settings',
  library: '/library',
  blocker: '/blocker',
  blocked: '/blocked',
} as const

export const appShellNavItems = [
  { to: appRoutes.home, label: 'Home' },
  { to: appRoutes.analytics, label: 'Analytics' },
  { to: appRoutes.sos, label: 'Panico' },
  { to: appRoutes.library, label: 'Biblioteca' },
  { to: appRoutes.settings, label: 'Settings' },
] as const
