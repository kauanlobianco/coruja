import { Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { GlobalFeedback } from '../../shared/GlobalFeedback'
import { GameTopbar } from '../../shared/GameTopbar'
import { LucideIcon } from '../../shared/LucideIcon'
import { iconBank, shuffleArray } from '../../shared/gameUtils'
import { useFeedback } from '../../shared/useFeedback'

interface FindGameProps {
  onBack: () => void
}

export function FindGame({ onBack }: FindGameProps) {
  const [screen, setScreen] = useState<'start' | 'play'>('start')

  return (
    <div className="cg-page">
      {screen === 'start' ? (
        <FindStart onBack={onBack} onPlay={() => setScreen('play')} />
      ) : (
        <FindPlay onBack={() => setScreen('start')} />
      )}
    </div>
  )
}

function FindStart({ onBack, onPlay }: { onBack: () => void; onPlay: () => void }) {
  return (
    <div className="cg-inner">
      <GameTopbar onBack={onBack} />
      <div className="cg-start-content cg-start-content--find">
        <div className="cg-start-icon cg-start-icon--find">
          <Search size={48} color="white" />
        </div>
        <h2 className="cg-preview-title">Foco e Percepção</h2>
        <p className="cg-preview-desc">
          Encontre o símbolo em destaque na grade. Sem tempo, apenas relaxe.
        </p>
        <button
          type="button"
          className="cg-btn-pill"
          style={{ background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', color: 'white' }}
          onClick={onPlay}
        >
          INICIAR JOGO
        </button>
      </div>
    </div>
  )
}

function FindPlay({ onBack }: { onBack: () => void }) {
  const { feedback, showFeedback } = useFeedback()
  const [score, setScore] = useState(0)
  const [targetIcon, setTargetIcon] = useState('')
  const [gridIcons, setGridIcons] = useState<string[]>([])

  const nextRound = useCallback(() => {
    const shuffled = shuffleArray([...iconBank])
    const target = shuffled[0]
    let grid = shuffled.slice(1, 25) as string[]
    grid.splice(Math.floor(Math.random() * 25), 0, target)
    setTargetIcon(target)
    setGridIcons(grid)
  }, [])

  useEffect(() => {
    nextRound()
  }, [nextRound])

  function handleTap(icon: string) {
    if (icon === targetIcon) {
      showFeedback(true)
      setScore((s) => s + 1)
      setTimeout(() => nextRound(), 150)
    } else {
      showFeedback(false)
    }
  }

  return (
    <div className="cg-inner">
      <GlobalFeedback feedback={feedback} />
      <GameTopbar onBack={onBack} title="Encontre Rápido" />
      <div className="cg-find-play">
        <div className="cg-find-target-area">
          <div className="cg-find-target-label">ENCONTRE ISTO</div>
          <div className="cg-find-target-circle">
            <LucideIcon name={targetIcon} size={36} color="white" />
          </div>
        </div>

        <div className="cg-find-grid">
          {gridIcons.map((icon, i) => (
            <button
              key={i}
              type="button"
              className="cg-find-item"
              onClick={() => handleTap(icon)}
            >
              <LucideIcon name={icon} size={24} />
            </button>
          ))}
        </div>

        <div className="cg-find-score-area">
          <p>Pontuação</p>
          <span>{score}</span>
        </div>
      </div>
    </div>
  )
}
