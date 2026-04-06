import { Calculator, Clock } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { GlobalFeedback } from '../../shared/GlobalFeedback'
import { GameTopbar } from '../../shared/GameTopbar'
import { shuffleArray } from '../../shared/gameUtils'
import { useFeedback } from '../../shared/useFeedback'

interface MathGameProps {
  onBack: () => void
}

export function MathGame({ onBack }: MathGameProps) {
  const [screen, setScreen] = useState<'start' | 'play'>('start')

  return (
    <div className="cg-page">
      {screen === 'start' ? (
        <MathStart onBack={onBack} onPlay={() => setScreen('play')} />
      ) : (
        <MathPlay onBack={() => setScreen('start')} />
      )}
    </div>
  )
}

function MathStart({ onBack, onPlay }: { onBack: () => void; onPlay: () => void }) {
  return (
    <div className="cg-inner" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="cg-math-watermark" aria-hidden="true">
        <span className="cg-mw-1">+</span>
        <span className="cg-mw-2">−</span>
        <span className="cg-mw-3">×</span>
        <span className="cg-mw-4">÷</span>
        <span className="cg-mw-5">=</span>
        <span className="cg-mw-6">+</span>
        <span className="cg-mw-7">×</span>
      </div>
      <GameTopbar onBack={onBack} />
      <div className="cg-start-content cg-start-content--math">
        <div className="cg-math-icon">√x</div>
        <h2 className="cg-preview-title">Desafio Matemático</h2>
        <p className="cg-preview-desc">Resolva problemas o mais rápido que puder.</p>
        <button type="button" className="cg-btn-pill" onClick={onPlay}>
          INICIAR JOGO
        </button>
      </div>
    </div>
  )
}

interface Question {
  text: string
  answer: number
  options: number[]
}

function generateQuestion(): Question {
  const ops = ['+', '-', '×']
  const op = ops[Math.floor(Math.random() * ops.length)]
  let n1: number, n2: number, ans: number

  if (op === '+') {
    n1 = Math.floor(Math.random() * 40) + 1
    n2 = Math.floor(Math.random() * 40) + 1
    ans = n1 + n2
  } else if (op === '-') {
    n1 = Math.floor(Math.random() * 40) + 10
    n2 = Math.floor(Math.random() * n1) + 1
    ans = n1 - n2
  } else {
    n1 = Math.floor(Math.random() * 10) + 2
    n2 = Math.floor(Math.random() * 10) + 2
    ans = n1 * n2
  }

  const opts = [ans]
  while (opts.length < 4) {
    const offset = Math.floor(Math.random() * 5) + 1
    const sign = Math.random() > 0.5 ? 1 : -1
    let wrong = ans + offset * sign
    if (Math.random() > 0.8) wrong = ans + 10 * sign
    if (wrong >= 0 && !opts.includes(wrong)) opts.push(wrong)
  }

  return { text: `${n1} ${op} ${n2}`, answer: ans, options: shuffleArray(opts) }
}

function MathPlay({ onBack }: { onBack: () => void }) {
  const { feedback, showFeedback } = useFeedback()
  const [score, setScore]       = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [question, setQuestion] = useState<Question>(() => generateQuestion())
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

  function handleGuess(val: number) {
    if (gameOver) return
    showFeedback(val === question.answer)
    if (val === question.answer) setScore((s) => s + 1)
    setQuestion(generateQuestion())
  }

  return (
    <div className="cg-inner" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="cg-math-watermark" aria-hidden="true">
        <span className="cg-mw-1">+</span><span className="cg-mw-2">−</span>
        <span className="cg-mw-3">×</span><span className="cg-mw-4">÷</span>
        <span className="cg-mw-5">=</span><span className="cg-mw-6">+</span>
        <span className="cg-mw-7">×</span>
      </div>
      <GlobalFeedback feedback={feedback} />
      <GameTopbar
        onBack={onBack}
        title="Desafio Matemático"
        right={
          <span className="cg-score-card">
            <Clock size={14} />
            {timeLeft}s
          </span>
        }
      />
      <div className="cg-math-play">
        <div
          className="cg-math-question"
          style={gameOver ? { fontSize: '2.2rem' } : undefined}
        >
          {gameOver ? 'FIM!' : question.text}
        </div>

        {gameOver ? (
          <div className="cg-math-grid">
            <div className="cg-game-over" style={{ gridColumn: 'span 2' }}>
              <p>Sua pontuação final</p>
              <span className="cg-game-over-score">{score}</span>
              <button
                type="button"
                className="cg-btn-pill"
                style={{ margin: '0 auto' }}
                onClick={() => {
                  setScore(0)
                  setTimeLeft(30)
                  setGameOver(false)
                  setQuestion(generateQuestion())
                }}
              >
                JOGAR DE NOVO
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="cg-math-grid">
              {question.options.map((val) => (
                <button
                  key={val}
                  type="button"
                  className="cg-math-btn"
                  onClick={() => handleGuess(val)}
                >
                  {val}
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
