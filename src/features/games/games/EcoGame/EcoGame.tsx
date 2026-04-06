import { Award, Radio } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GlobalFeedback } from '../../shared/GlobalFeedback'
import { GameTopbar } from '../../shared/GameTopbar'
import { useFeedback } from '../../shared/useFeedback'

interface EcoGameProps {
  onBack: () => void
}

export function EcoGame({ onBack }: EcoGameProps) {
  const [screen, setScreen] = useState<'start' | 'play'>('start')

  return (
    <div className="cg-page">
      {screen === 'start' ? (
        <EcoStart onBack={onBack} onPlay={() => setScreen('play')} />
      ) : (
        <EcoPlay onBack={() => setScreen('start')} />
      )}
    </div>
  )
}

function EcoStart({ onBack, onPlay }: { onBack: () => void; onPlay: () => void }) {
  return (
    <div className="cg-inner">
      <GameTopbar onBack={onBack} />
      <div className="cg-start-content cg-start-content--eco">
        <div className="cg-start-icon cg-start-icon--eco">
          <Radio size={48} color="white" />
        </div>
        <h2 className="cg-preview-title">Eco Visual</h2>
        <p className="cg-preview-desc">Memorize e repita a sequência luminosa.</p>
        <button type="button" className="cg-btn-pill" onClick={onPlay}>
          START GAME
        </button>
      </div>
    </div>
  )
}

function EcoPlay({ onBack }: { onBack: () => void }) {
  const { feedback, showFeedback } = useFeedback()
  const [score, setScore]           = useState(0)
  const [status, setStatus]         = useState('Prepare-se...')
  // activeIdx: which circle is lit (-1 = none)
  const [activeCircle, setActiveCircle] = useState(-1)
  const [rippleCircle, setRippleCircle] = useState(-1)
  const [gameOver, setGameOver]     = useState(false)

  // Game state kept in ref to avoid stale closures in setTimeout chains
  const sequenceRef      = useRef<number[]>([])
  const playerIndexRef   = useRef(0)
  const isShowingRef     = useRef(false)
  const isPlayingRef     = useRef(false)
  const timeoutsRef      = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }, [])

  const later = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    timeoutsRef.current.push(t)
  }, [])

  const flashCircle = useCallback((id: number, duration: number, isPlayer = false) => {
    setActiveCircle(id)
    if (isPlayer) {
      setRippleCircle(-1)
      setTimeout(() => setRippleCircle(id), 10)
    }
    later(() => {
      setActiveCircle(-1)
      if (isPlayer) later(() => setRippleCircle(-1), 600)
    }, duration)
  }, [later])

  const endGame = useCallback(() => {
    isPlayingRef.current = false
    setGameOver(true)
    setStatus('FIM DE JOGO!')
  }, [])

  const playSequence = useCallback((seq: number[]) => {
    isShowingRef.current = true
    setStatus('Observe o padrão...')
    const delay = 600
    seq.forEach((colorIdx, index) => {
      later(() => flashCircle(colorIdx, 400), delay * (index + 1))
    })
    later(() => {
      isShowingRef.current = false
      if (isPlayingRef.current) setStatus('Sua vez!')
    }, delay * (seq.length + 1))
  }, [later, flashCircle])

  const nextLevel = useCallback(() => {
    if (!isPlayingRef.current) return
    playerIndexRef.current = 0
    const newSeq = [...sequenceRef.current, Math.floor(Math.random() * 4)]
    sequenceRef.current = newSeq
    setScore(newSeq.length - 1)
    playSequence(newSeq)
  }, [playSequence])

  // Start game
  useEffect(() => {
    isPlayingRef.current = true
    isShowingRef.current = false
    sequenceRef.current  = []
    playerIndexRef.current = 0

    later(() => nextLevel(), 1000)

    return () => {
      isPlayingRef.current = false
      clearAll()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleTap(id: number) {
    if (!isPlayingRef.current || isShowingRef.current || gameOver) return
    flashCircle(id, 200, true)

    if (id === sequenceRef.current[playerIndexRef.current]) {
      playerIndexRef.current++
      if (playerIndexRef.current === sequenceRef.current.length) {
        isShowingRef.current = true
        setStatus('Perfeito!')
        later(() => nextLevel(), 1000)
      }
    } else {
      showFeedback(false)
      endGame()
    }
  }

  function restart() {
    clearAll()
    isPlayingRef.current = true
    isShowingRef.current = false
    sequenceRef.current  = []
    playerIndexRef.current = 0
    setScore(0)
    setGameOver(false)
    setStatus('Prepare-se...')
    setActiveCircle(-1)
    setRippleCircle(-1)
    later(() => nextLevel(), 1000)
  }

  return (
    <div className="cg-inner">
      <GlobalFeedback feedback={feedback} />
      <GameTopbar
        onBack={onBack}
        title="Eco Visual"
        right={
          <span className="cg-score-card">
            <Award size={14} style={{ color: '#06b6d4' }} />
            {score}
          </span>
        }
      />
      <div className="cg-eco-play">
        <div className="cg-eco-status">{status}</div>

        <div className="cg-eco-grid-wrap">
          {gameOver ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--cg-text-muted)', marginBottom: 8 }}>Sequência alcançada</p>
              <div className="cg-game-over-score">{score}</div>
              <button
                type="button"
                className="cg-btn-pill"
                style={{ margin: '0 auto' }}
                onClick={restart}
              >
                TENTAR NOVAMENTE
              </button>
            </div>
          ) : (
            <div className="cg-eco-grid">
              {[0, 1, 2, 3].map((id) => (
                <button
                  key={id}
                  type="button"
                  className={[
                    'cg-eco-circle',
                    `cg-eco-circle--${id}`,
                    activeCircle === id ? 'cg-eco-active' : '',
                    rippleCircle === id ? 'cg-eco-ripple' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleTap(id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
