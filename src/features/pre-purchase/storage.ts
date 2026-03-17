import type { PrePurchaseState } from './types'

const STORAGE_KEY = 'coruja.prepurchase.session'
const PREFILL_NAME_KEY = 'coruja.prepurchase.name'
const PREFILL_AGE_KEY = 'coruja.prepurchase.age'

export function savePrePurchaseState(state: PrePurchaseState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  sessionStorage.setItem(PREFILL_NAME_KEY, state.name)
  sessionStorage.setItem(PREFILL_AGE_KEY, state.age)
}

export function loadPrePurchaseState() {
  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as PrePurchaseState & {
      quizAnswers?: Array<number | { questionId: number; answerIndex: number; points: number }>
    }

    return {
      ...parsed,
      pendingQuizAnswerIndex:
        typeof parsed.pendingQuizAnswerIndex === 'number' ? parsed.pendingQuizAnswerIndex : null,
      quizAnswers: Array.isArray(parsed.quizAnswers)
        ? parsed.quizAnswers
            .map((answer, index) => {
              if (typeof answer === 'number') {
                return {
                  questionId: index + 1,
                  answerIndex: 0,
                  points: answer,
                }
              }

              return answer
            })
            .filter(Boolean)
        : [],
    }
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

export function getPrePurchaseAge() {
  return sessionStorage.getItem(PREFILL_AGE_KEY) ?? ''
}
