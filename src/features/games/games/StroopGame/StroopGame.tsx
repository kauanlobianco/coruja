import { Clock, Palette } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { GlobalFeedback } from '../../shared/GlobalFeedback'
import { GameTopbar } from '../../shared/GameTopbar'
import { useFeedback } from '../../shared/useFeedback'

const COLORS = [
  { id: 'vermelho', label: 'VERMELHO', hex: '#ef4444' },
  { id: 'azul',     label: 'AZUL',     hex: '#3b82f6' },
  { id: 'verde',    label: 'VERDE',    hex: '#10b981' },
  { id: 'amarelo',  label: 'AMARELO',  hex: '#eab308' },
  { id: 'laranja',  label: 'LARANJA',  hex: '#f97316' },
  { id: 'roxo',     label: 'ROXO',     hex: '#a855f7' },
]

interface StroopGameProps {
  onBack: () => void
}

export function StroopGame({ onBack }: StroopGameProps) {
  const [screen, setScreen] = useState<'start' | 'play'>('start')

  return (
    <div className="cg-page">
      {screen === 'start' ? (
        <StroopStart onBack={onBack} onPlay={() => setScreen('play')} />
      ) : (
        <StroopPlay onBack={() => setScreen('start')} />
      )}
    </div>
  )
}

function StroopStart({ onBack, onPlay }: { onBack: () => void; onPlay: () => void }) {
  return (
    <div className="cg-inner">
      <GameTopbar onBack={onBack} />
      <div className="cg-start-content cg-start-content--stroop">
        <div className="cg-start-icon cg-start-icon--stroop">
          <Palette size={48} color="white" />
        </div>
        <h2 className="cg-preview-title">Teste de Stroop</h2>
        <p className="cg-preview-desc">Toque na COR, não na palavra!</p>
        <button type="button" className="cg-btn-pill" onClick={onPlay}>
          INICIAR JOGO
        </button>
      </div>
    </div>
  )
}

interface WordState {
  text: string
  color: string
  correctId: string
}

function nextWordState(): WordState {
  const wordObj  = COLORS[Math.floor(Math.random() * COLORS.length)]
  let colorObj
  if (Math.random() > 0.2) {
    const diff = COLORS.filter((c) => c.id !== wordObj.id)
    colorObj = diff[Math.floor(Math.random() * diff.length)]
  } else {
    colorObj = wordObj
  }
  return { text: wordObj.label, color: colorObj.hex, correctId: colorObj.id }
}

function StroopPlay({ onBack }: { onBack: () => void }) {
  const { feedback, showFeedback } = useFeedback()
  const [score, setScore]       = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [word, setWord]         = useState<WordState>(() => nextWordState())
  const [locked, setLocked]     = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          setGameOver(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [])

  function handleGuess(id: string) {
    if (locked || gameOver) return
    const correct = id === word.correctId
    showFeedback(correct)
    if (correct) setScore((s) => s + 1)

    setLocked(true)
    setTimeout(() => {
      setWord(nextWordState())
      setLocked(false)
    }, 300)
  }

  return (
    <div className="cg-inner">
      <GlobalFeedback feedback={feedback} />
      <GameTopbar
        onBack={onBack}
        title="Teste de Stroop"
        right={
          <span className="cg-score-card">
            <Clock size={14} />
            {timeLeft}s
          </span>
        }
      />
      <div className="cg-stroop-play">
        <div className="cg-stroop-word-area">
          {gameOver ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--cg-text-muted)', marginBottom: 8 }}>Sua pontuação</p>
              <div className="cg-game-over-score">{score}</div>
              <button
                type="button"
                className="cg-btn-pill"
                style={{ margin: '0 auto' }}
                onClick={() => {
                  setScore(0)
                  setTimeLeft(30)
                  setGameOver(false)
                  setWord(nextWordState())
                }}
              >
                JOGAR DE NOVO
              </button>
            </div>
          ) : (
            <div
              className="cg-stroop-word"
              style={{
                color: word.color,
                textShadow: `0 0 25px ${word.color}66`,
              }}
            >
              {word.text}
            </div>
          )}
        </div>

        {!gameOver && (
          <>
            <div className="cg-stroop-grid">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="cg-stroop-btn"
                  style={{ borderColor: c.hex }}
                  disabled={locked}
                  onClick={() => handleGuess(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="cg-game-footer">
              Pontuação:<span>{score}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
