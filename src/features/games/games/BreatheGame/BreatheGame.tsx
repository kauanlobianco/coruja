import { Wind } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { GameTopbar } from '../../shared/GameTopbar'

interface BreatheGameProps {
  onBack: () => void
}

export function BreatheGame({ onBack }: BreatheGameProps) {
  const [screen, setScreen] = useState<'start' | 'play'>('start')

  return (
    <div className="cg-page">
      {screen === 'start' ? (
        <BreatheStart onBack={onBack} onPlay={() => setScreen('play')} />
      ) : (
        <BreathePlay onBack={() => setScreen('start')} />
      )}
    </div>
  )
}

function BreatheStart({ onBack, onPlay }: { onBack: () => void; onPlay: () => void }) {
  return (
    <div className="cg-inner">
      <GameTopbar onBack={onBack} />
      <div className="cg-start-content cg-start-content--breathe">
        <div className="cg-start-icon cg-start-icon--breathe">
          <Wind size={48} color="white" />
        </div>
        <h2 className="cg-preview-title">Pausa para Respirar</h2>
        <p className="cg-preview-desc">
          Acompanhe o guia visual de respiração para reduzir o estresse e acalmar a mente.
        </p>
        <button type="button" className="cg-btn-pill" onClick={onPlay}>
          INICIAR GUIA
        </button>
      </div>
    </div>
  )
}

type BreathePhase = 'idle' | 'inhale' | 'hold' | 'exhale'

interface PhaseText {
  title: string
  sub: string
}

const PHASE_TEXT: Record<BreathePhase, PhaseText> = {
  idle:   { title: 'Preparando...', sub: 'Acomode-se' },
  inhale: { title: 'Inspire',       sub: 'Respire profundamente' },
  hold:   { title: 'Segure',        sub: 'Mantenha o ar nos pulmões' },
  exhale: { title: 'Expire',        sub: 'Solte o ar lentamente' },
}

function BreathePlay({ onBack }: { onBack: () => void }) {
  const [phase, setPhase]             = useState<BreathePhase>('idle')
  const [textVisible, setTextVisible] = useState(true)
  const [duration, setDuration]       = useState('0s')
  const [seconds, setSeconds]         = useState(0)
  const cycleRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  function changeText(next: BreathePhase) {
    setTextVisible(false)
    setTimeout(() => {
      setPhase(next)
      setTextVisible(true)
    }, 300)
  }

  function inhale() {
    changeText('inhale')
    setDuration('4s')
    cycleRef.current = setTimeout(() => hold(), 4000)
  }

  function hold() {
    changeText('hold')
    setDuration('4s')
    cycleRef.current = setTimeout(() => exhale(), 4000)
  }

  function exhale() {
    changeText('exhale')
    setDuration('6s')
    cycleRef.current = setTimeout(() => inhale(), 6000)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    const startTimeout = setTimeout(() => {
      inhale()
    }, 50)

    return () => {
      clearInterval(timerRef.current!)
      clearTimeout(cycleRef.current!)
      clearTimeout(startTimeout)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2, '0')
  const text = PHASE_TEXT[phase]

  return (
    <div className="cg-inner">
      <GameTopbar onBack={onBack} title="Pausa para Respirar" />
      <div className="cg-breathe-play">
        <div
          className={`cg-breathe-wrapper cg-${phase}`}
          style={{ '--bw-dur': duration } as React.CSSProperties}
        >
          <div className="cg-breathe-ring r1" />
          <div className="cg-breathe-ring r2" />
          <div className="cg-breathe-ring r3" />
          <div className="cg-breathe-circle" />
          <div className="cg-breathe-text" style={{ opacity: textVisible ? 1 : 0 }}>
            <div className="cg-breathe-text-title">{text.title}</div>
            <div className="cg-breathe-text-sub">{text.sub}</div>
          </div>
        </div>

        <div className="cg-breathe-timer-wrap">
          <div className="cg-breathe-timer-label">Tempo Total</div>
          <div className="cg-breathe-timer">
            {mins}:{secs}
          </div>
        </div>
      </div>
    </div>
  )
}
