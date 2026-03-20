import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import type { QuizAnswer } from '../types'
import { markerRules } from '../data'

interface RiskBand {
  label: string
  short: string
  color: string
  badgeClass: string
}

interface DiagnosisReport {
  band: RiskBand
  scorePercent: number
  markers: Array<{ id: string; title: string; copy: string }>
}

function getRiskBand(scorePercent: number): RiskBand {
  if (scorePercent >= 86) {
    return {
      label: 'Risco Crítico',
      short: 'Suas respostas indicam um padrão severo de dependência, com perda de controle real e impacto em múltiplas áreas da sua vida.',
      color: '#B14343',
      badgeClass: 'diagnosis-badge-critical',
    }
  }
  if (scorePercent >= 66) {
    return {
      label: 'Risco Alto',
      short: 'O que você respondeu mostra um ciclo entranhado, com dificuldade crescente de interromper e impacto concreto no dia a dia.',
      color: '#E35B2E',
      badgeClass: 'diagnosis-badge-high',
    }
  }
  if (scorePercent >= 41) {
    return {
      label: 'Risco Moderado',
      short: 'Suas respostas mostram sinais de repetição automática e desgaste emocional. Agir agora evita que o padrão se consolide.',
      color: '#EC9E32',
      badgeClass: 'diagnosis-badge-moderate',
    }
  }
  return {
    label: 'Referência Saudável',
    short: 'Seu resultado não mostra um padrão dominante neste momento, mas vale proteger sua rotina para isso não ganhar espaço.',
    color: '#409672',
    badgeClass: 'diagnosis-badge-safe',
  }
}

const MAX_SCORE = 20
const PROBLEMATIC_THRESHOLD = 20
const COUNT_UP_DURATION = 2800

const LINE1 = '⚠ ATENÇÃO'
const LINE2 = 'Acima de 20% já é'
const LINE3 = 'consumo problemático'

export function buildDiagnosisReport(
  rawScore: number,
  quizAnswers: QuizAnswer[],
): DiagnosisReport {
  const scorePercent = Math.round((rawScore / MAX_SCORE) * 100)
  const band = getRiskBand(scorePercent)
  const answersByQuestion = new Map<number, number>(
    quizAnswers.map((a) => [a.questionId, a.answerIndex]),
  )
  const markers = markerRules.filter((rule) => rule.matches(answersByQuestion)).slice(0, 3)
  return { band, scorePercent, markers }
}

interface DiagnosisStepProps {
  score: number
  diagnosis: DiagnosisReport
  onBack: () => void
  onContinue: () => void
}

export function DiagnosisStep({ diagnosis, onBack, onContinue }: DiagnosisStepProps) {
  const { band, scorePercent, markers } = diagnosis

  const [typedL1] = useState(LINE1)
  const [typedL2, setTypedL2] = useState('')
  const [typedL3, setTypedL3] = useState('')
  const [cursorLine, setCursorLine] = useState<2 | 3 | null>(null)
  const [showScore, setShowScore] = useState(false)
  const [displayCount, setDisplayCount] = useState(0)
  const [showBadge, setShowBadge] = useState(false)
  const [showRest, setShowRest] = useState(false)

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    function addTimeout(fn: () => void, delay: number) {
      const id = setTimeout(fn, delay)
      timeoutsRef.current.push(id)
    }

    function typeString(
      str: string,
      speed: number,
      setter: (s: string) => void,
      onDone: () => void,
      index = 0,
    ) {
      if (index >= str.length) {
        onDone()
        return
      }
      addTimeout(() => {
        setter(str.slice(0, index + 1))
        typeString(str, speed, setter, onDone, index + 1)
      }, speed)
    }

    // LINE1 já aparece imediato — digita LINE2 → LINE3 → score → badge → rest
    addTimeout(() => {
      setCursorLine(2)
      typeString(LINE2, 80, setTypedL2, () => {
        setCursorLine(null)
        addTimeout(() => {
          setCursorLine(3)
          typeString(LINE3, 60, setTypedL3, () => {
              setCursorLine(null)
              setShowScore(true)
              const startTime = performance.now()
              const tick = (now: number) => {
                const elapsed = now - startTime
                const progress = Math.min(elapsed / COUNT_UP_DURATION, 1)
                const eased = 1 - Math.pow(1 - progress, 3)
                setDisplayCount(Math.round(eased * scorePercent))
                if (progress < 1) {
                  rafRef.current = requestAnimationFrame(tick)
                } else {
                  addTimeout(() => {
                    setShowBadge(true)
                    addTimeout(() => setShowRest(true), 600)
                  }, 400)
                }
              }
              rafRef.current = requestAnimationFrame(tick)
            })
          }, 120)
        })
      }, 120)

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [scorePercent])

  const aboveThreshold = scorePercent > PROBLEMATIC_THRESHOLD
    ? scorePercent - PROBLEMATIC_THRESHOLD
    : null

  return (
    <section className="diagnosis">
      <div className="prepurchase-quiz-header-row" style={{ marginBottom: 0 }}>
        <button type="button" className="prepurchase-quiz-back" onClick={onBack}>
          <ChevronLeft size={20} strokeWidth={2.4} />
        </button>
        <div style={{ flex: 1 }} />
        <div className="prepurchase-quiz-badge">PT-BR</div>
      </div>

      <div className="diagnosis-scroll">

        <div className="diagnosis-context-block">
          <span className="diagnosis-attention">
            {typedL1}
          </span>
          {(typedL2.length > 0 || cursorLine === 2) && (
            <span className="diagnosis-context-text">
              {typedL2}
              {cursorLine === 2 && <span className="diagnosis-cursor">|</span>}
            </span>
          )}
          {(typedL3.length > 0 || cursorLine === 3) && (
            <span className="diagnosis-context-text">
              {typedL3}
              {cursorLine === 3 && <span className="diagnosis-cursor">|</span>}
            </span>
          )}
        </div>

        {showScore && (
          <div className="diagnosis-score-block">
            <p className="diagnosis-you-label">VOCÊ PONTUOU:</p>
            <p className="diagnosis-score-number" style={{ color: band.color }}>
              {displayCount}<span className="diagnosis-compare-unit">%</span>
            </p>
          </div>
        )}

        {showBadge && (
          <motion.div
            className="diagnosis-badge-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <span className={`diagnosis-badge ${band.badgeClass}`}>
              {band.label.toUpperCase()}
            </span>
            {aboveThreshold !== null && (
              <p className="diagnosis-impact-line">
                Você está {aboveThreshold}% acima do consumo problemático
              </p>
            )}
            <p className="diagnosis-band-short">{band.short}</p>
          </motion.div>
        )}

        {showRest && (
          <motion.div
            className="diagnosis-rest"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="diagnosis-markers">
              {markers.map((marker) => (
                <div
                  key={marker.id}
                  className="diagnosis-marker-card"
                  style={{ borderLeftColor: band.color }}
                >
                  <span className="diagnosis-marker-icon">⚠</span>
                  <p className="diagnosis-marker-copy">{marker.copy}</p>
                </div>
              ))}
            </div>

            <p className="diagnosis-disclaimer">
              * Este resultado é apenas uma indicação, não um diagnóstico médico.
            </p>

            <button type="button" className="diagnosis-cta" onClick={onContinue}>
              Verificar seus sintomas
            </button>
          </motion.div>
        )}

      </div>
    </section>
  )
}
