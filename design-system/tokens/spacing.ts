export const spacing = {
  unit: 4,
  scale: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    10: 40,
    12: 48,
  },
  semantic: {
    stackXs: 8,
    stackSm: 12,
    stackMd: 16,
    stackLg: 18,
    stackXl: 24,
    insetSm: 12,
    insetMd: 16,
    insetLg: 20,
    insetXl: 24,
    screenX: 16,
    topbarX: 20,
    navInset: 10,
    cardGap: 12,
  },
} as const

export type Spacing = typeof spacing
