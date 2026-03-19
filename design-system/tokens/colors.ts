export const colors = {
  brand: {
    primaryGradient: {
      heroMesh: ['#E35B2E', '#F97316', '#FBBF24'],
      ember: ['#EC9E32', '#E35B2E', '#F97316', '#FBBF24'],
      usage:
        'Hero principal, barras de progresso de conquista, badges positivas, momentos de energia e celebracao.',
    },
    ctaGradient: {
      blue: ['#2AA5C0', '#258BB6', '#277BC4', '#3055CF'],
      usage: 'Acoes principais, avatar, destaques de navegacao e foco operacional.',
    },
    emergencyGradient: {
      panic: ['#BB4444', '#B6423A', '#C84C2D'],
      usage: 'Panico, alertas criticos e chamadas de emergencia.',
    },
  },
  background: {
    base: '#0D0F1A',
    baseMuted: '#0B0D16',
    frame: '#0D0E14',
    appGlow: '#131830',
    appGlowStrong: '#1C2566',
    card: '#1B1F3C',
    cardElevated: '#232848',
    cardStrong: '#121521',
    cardAnalytics: '#1A2040',
  },
  text: {
    primary: '#E9E6E2',
    secondary: '#7B879D',
    tertiary: 'rgba(233, 230, 226, 0.72)',
    inverted: '#FFFFFF',
    emphasisDark: '#0E1120',
  },
  accent: {
    blue: '#268EBA',
    cyan: '#2BB5C4',
    indigo: '#384A94',
    purple: '#4353CB',
    amber: '#EC9E32',
    gold: '#FBBF24',
    orange: '#F97316',
    ember: '#E35B2E',
    red: '#B14343',
    rose: '#FF8F8F',
    green: '#409672',
  },
  semantic: {
    success: '#409672',
    warning: '#EC9E32',
    error: '#B14343',
    info: '#268EBA',
    neutral: '#7B879D',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.04)',
    soft: 'rgba(255, 255, 255, 0.06)',
    strong: 'rgba(255, 255, 255, 0.08)',
    accent: 'rgba(56, 74, 148, 0.40)',
    success: 'rgba(64, 150, 114, 0.22)',
    danger: 'rgba(177, 67, 67, 0.24)',
    amber: 'rgba(236, 158, 50, 0.22)',
  },
  overlay: {
    glass: 'rgba(255, 255, 255, 0.04)',
    glassStrong: 'rgba(255, 255, 255, 0.08)',
    nav: 'rgba(9, 11, 24, 0.58)',
    scrim: 'rgba(13, 15, 26, 0.72)',
  },
} as const

export type Colors = typeof colors
