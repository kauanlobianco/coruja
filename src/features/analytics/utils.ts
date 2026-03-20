// Pure SVG path helpers
export function buildLinePath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
}

export function buildAreaPath(points: Array<{ x: number; y: number }>, baseY: number) {
  if (points.length === 0) return ''
  const line = buildLinePath(points)
  const first = points[0]
  const last = points[points.length - 1]
  return `${line} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`
}

// Date utilities
export function startOfWeekMonday(value: Date) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  return date
}

export function addDays(value: Date, amount: number) {
  const next = new Date(value)
  next.setDate(next.getDate() + amount)
  return next
}

export function differenceInDays(from: Date, to: Date) {
  const start = new Date(from)
  const end = new Date(to)
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  return Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86400000) + 1)
}

export function formatTodayLabel(value: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).format(value)
}

export function formatShortDate(value: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'short',
  }).format(value)
}

// Domain helpers
export function getMentalStateMeta(value: string | null | undefined) {
  const normalized = value?.toLowerCase() ?? ''
  if (normalized.includes('ans')) return { emoji: '😞', tone: '#C44B4B', label: 'Muito mal' }
  if (normalized.includes('cans') || normalized.includes('triste')) return { emoji: '😔', tone: '#E07428', label: 'Cansado' }
  if (normalized.includes('calmo') || normalized.includes('neutro')) return { emoji: '😐', tone: '#EC9731', label: 'Neutro' }
  if (normalized.includes('bem')) return { emoji: '🙂', tone: '#5EBD8A', label: 'Bem' }
  if (normalized.includes('tranquilo')) return { emoji: '😌', tone: '#3DAA7D', label: 'Tranquilo' }
  return { emoji: '•', tone: 'rgba(255,255,255,0.18)', label: 'Sem registro' }
}

export const weekdayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
export const triggerColors = ['#7C5CBF', '#EC9731', '#C44B4B', '#3DAA7D', '#4455CC']
