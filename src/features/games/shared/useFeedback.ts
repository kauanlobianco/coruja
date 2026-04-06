import { useCallback, useState } from 'react'

export interface FeedbackState {
  visible: boolean
  correct: boolean
}

export function useFeedback() {
  const [feedback, setFeedback] = useState<FeedbackState>({ visible: false, correct: false })

  const showFeedback = useCallback((correct: boolean) => {
    setFeedback({ visible: true, correct })
    setTimeout(() => setFeedback((prev) => ({ ...prev, visible: false })), 400)
  }, [])

  return { feedback, showFeedback }
}
