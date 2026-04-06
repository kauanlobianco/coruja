import { CheckCircle2, XCircle } from 'lucide-react'
import type { FeedbackState } from './useFeedback'

interface GlobalFeedbackProps {
  feedback: FeedbackState
}

export function GlobalFeedback({ feedback }: GlobalFeedbackProps) {
  const cls = [
    'cg-feedback',
    feedback.visible ? 'cg-show' : '',
    feedback.correct ? 'cg-correct' : 'cg-wrong',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls} aria-hidden="true">
      {feedback.correct ? (
        <CheckCircle2 size={64} />
      ) : (
        <XCircle size={64} />
      )}
    </div>
  )
}
