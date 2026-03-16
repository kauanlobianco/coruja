import type { PrePurchaseState } from './types'

const STORAGE_KEY = 'coruja.prepurchase.session'
const PREFILL_NAME_KEY = 'coruja.prepurchase.name'

export function savePrePurchaseState(state: PrePurchaseState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  sessionStorage.setItem(PREFILL_NAME_KEY, state.name)
}

export function loadPrePurchaseState() {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw) as PrePurchaseState
  } catch {
    return null
  }
}

export function clearPrePurchaseState() {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function getPrePurchaseName() {
  return sessionStorage.getItem(PREFILL_NAME_KEY) ?? ''
}
