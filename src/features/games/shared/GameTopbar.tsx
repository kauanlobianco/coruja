import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'

interface GameTopbarProps {
  onBack: () => void
  title?: string
  right?: ReactNode
}

export function GameTopbar({ onBack, title, right }: GameTopbarProps) {
  return (
    <div className="cg-topbar">
      <button type="button" className="cg-btn-back" onClick={onBack} aria-label="Voltar">
        <ChevronLeft size={20} />
      </button>

      {title ? (
        <span className="cg-view-title">{title}</span>
      ) : (
        <span />
      )}

      {right ? right : <span className="cg-spacer" />}
    </div>
  )
}
