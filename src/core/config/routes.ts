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
  sosSetup: '/sos/setup',
  journal: '/journal',
  relapse: '/relapse',
  analytics: '/analytics',
  settings: '/settings',
  library: '/library',
  libraryMedia: '/library/media',
  libraryGames: '/library/games',
  blocker: '/blocker',
  blocked: '/blocked',
} as const

export const appShellNavItems = [
  { to: appRoutes.home, label: 'Home' },
  { to: appRoutes.analytics, label: 'Analises' },
  { to: appRoutes.sos, label: 'Sos' },
  { to: appRoutes.library, label: 'Biblioteca' },
  { to: appRoutes.settings, label: 'Ajustes' },
] as const
