export const DEFAULT_BLOCKED_DOMAINS = [
  'pornhub.com',
  'xvideos.com',
  'xnxx.com',
  'xhamster.com',
  'redtube.com',
  'youporn.com',
  'tube8.com',
  'spankbang.com',
  'onlyfans.com',
  'brazzers.com',
  'bangbros.com',
]

export function normalizeDomainInput(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]
}
