export const radius = {
  scale: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 28,
    shell: 30,
    frame: 34,
    pill: 999,
  },
  semantic: {
    button: 12,
    card: 16,
    cardFeatured: 20,
    hero: 28,
    nav: 24,
    iconContainer: 14,
    iconContainerLarge: 16,
    avatar: 999,
    progress: 999,
    pill: 999,
  },
} as const

export type Radius = typeof radius
