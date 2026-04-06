import { Brain } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GlobalFeedback } from '../../shared/GlobalFeedback'
import { GameTopbar } from '../../shared/GameTopbar'
import { useFeedback } from '../../shared/useFeedback'
import { useMemoryGame } from './useMemoryGame'
import { LucideIcon } from '../../shared/LucideIcon'

type Screen = 'start' | 'play'

interface MemoryGameProps {
  onBack: () => void
}

export function MemoryGame({ onBack }: MemoryGameProps) {
  const [screen, setScreen] = useState<Screen>('start')

  return (
    <div className="cg-page">
      {screen === 'start' ? (
        <MemoryStart onBack={onBack} onPlay={() => setScreen('play')} />
      ) : (
        <MemoryPlay onBack={() => setScreen('start')} />
      )}
    </div>
  )
}

function MemoryStart({ onBack, onPlay }: { onBack: () => void; onPlay: () => void }) {
  return (
    <div className="cg-inner">
      <GameTopbar onBack={onBack} />
      <div className="cg-start-content cg-start-content--memory">
        <div className="cg-start-icon cg-start-icon--memory">
          <Brain size={48} color="white" />
        </div>
        <h2 className="cg-preview-title">Jogo da Memória</h2>
        <p className="cg-preview-desc">
          Encontre os pares correspondentes para exercitar sua memória de curto prazo.
        </p>
        <button type="button" className="cg-btn-pill" onClick={onPlay}>
          INICIAR JOGO
        </button>
      </div>
    </div>
  )
}

function MemoryPlay({ onBack }: { onBack: () => void }) {
  const { feedback, showFeedback } = useFeedback()
  const { state, start, flipCard } = useMemoryGame(showFeedback)

  useEffect(() => {
    start()
  }, [start])

  return (
    <div className="cg-inner">
      <GlobalFeedback feedback={feedback} />
      <GameTopbar
        onBack={onBack}
        title="Jogo da Memória"
        right={
          <span className="cg-score-card">
            Movs: <strong>{state.moves}</strong>
          </span>
        }
      />
      <div className="cg-memory-grid">
        {state.cards.map((card) => (
          <div
            key={card.id}
            className={[
              'cg-mem-card',
              card.flipped || card.matched ? 'cg-flipped' : '',
              card.matched ? 'cg-matched' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => flipCard(card.id)}
          >
            <div className="cg-mem-face cg-mem-front" />
            <div className="cg-mem-face cg-mem-back">
              <LucideIcon name={card.icon} size={28} color="white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
