export const iconBank = [
  'moon', 'sun', 'star', 'cloud', 'anchor', 'coffee', 'feather', 'flower',
  'heart', 'key', 'leaf', 'music', 'umbrella', 'zap', 'droplet', 'compass',
  'camera', 'headphones', 'watch', 'book', 'award', 'bell', 'gift', 'map',
  'shield', 'snowflake', 'flame', 'wind', 'palette', 'clock', 'calculator',
  'target', 'brain', 'type', 'check-circle-2', 'x-circle', 'radio', 'atom',
] as const

export type IconName = (typeof iconBank)[number]

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
