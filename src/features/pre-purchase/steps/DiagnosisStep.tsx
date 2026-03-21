import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Clock, Frown, Zap } from 'lucide-react'
import type { QuizAnswer } from '../types'
import { markerRules } from '../data'
import { TypewriterLine } from '../../../components/ui/TypewriterLine'

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
  if (scorePercent >= 75) {
    return {
      label: 'Risco Crítico',
      short: 'Suas respostas indicam um padrão severo de dependência, com perda de controle real e impacto em múltiplas áreas da sua vida.',
      color: '#B14343',
      badgeClass: 'diagnosis-badge-critical',
    }
  }
  if (scorePercent >= 50) {
    return {
      label: 'Risco Alto',
      short: 'O que você respondeu mostra um ciclo entranhado, com dificuldade crescente de interromper e impacto concreto no dia a dia.',
      color: '#E35B2E',
      badgeClass: 'diagnosis-badge-high',
    }
  }
  if (scorePercent >= 20) {
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

// activeLine: 0 = L1 revelando, 1 = L2 revelando, 2 = L3 revelando, 3 = tudo pronto
export function DiagnosisStep({ diagnosis, onBack, onContinue }: DiagnosisStepProps) {
  const { band, scorePercent, markers } = diagnosis

  const [activeLine, setActiveLine] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [displayCount, setDisplayCount] = useState(0)
  const [showBadge, setShowBadge] = useState(false)
  const [showRest, setShowRest] = useState(false)

  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!showScore) return

    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / COUNT_UP_DURATION, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayCount(Math.round(eased * scorePercent))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setShowBadge(true)
          setTimeout(() => setShowRest(true), 600)
        }, 400)
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [showScore, scorePercent])

  const aboveThreshold = scorePercent > PROBLEMATIC_THRESHOLD
    ? scorePercent - PROBLEMATIC_THRESHOLD
    : null

  return (
    <section className="diagnosis">
      <div className="prepurchase-quiz-header-row">
        <button type="button" className="prepurchase-quiz-back" aria-label="Voltar" onClick={onBack}>
          <ChevronLeft size={20} strokeWidth={2.4} />
        </button>
        <div className="diagnosis-header-spacer" />
        <div className="prepurchase-quiz-badge">PT-BR</div>
      </div>

      <div className={`diagnosis-scroll ${band.badgeClass.replace('badge', 'band')}`}>

        <div className="diagnosis-context-block">
          {/* L1 — digita imediatamente ao montar */}
          <TypewriterLine
            text="⚠ ATENÇÃO"
            charDelay={80}
            onComplete={() => setTimeout(() => setActiveLine(1), 150)}
            className="diagnosis-attention"
          />

          {/* L2 — monta quando L1 termina */}
          {activeLine >= 1 && (
            <TypewriterLine
              text="Acima de 20% já é"
              charDelay={70}
              onComplete={() => setTimeout(() => setActiveLine(2), 150)}
              className="diagnosis-context-text"
            />
          )}

          {/* L3 — monta quando L2 termina */}
          {activeLine >= 2 && (
            <TypewriterLine
              text="consumo problemático"
              charDelay={60}
              onComplete={() => {
                setActiveLine(3)
                setShowScore(true)
              }}
              className="diagnosis-context-text diagnosis-context-text--orange"
            />
          )}
        </div>

        {showScore && (
          <div className="diagnosis-score-card">
            <p className="diagnosis-you-label">RESULTADO DA AVALIAÇÃO</p>
            <p className="diagnosis-score-number">
              {displayCount}<span className="diagnosis-compare-unit">%</span>
            </p>
            {showBadge && (
              <motion.div
                className="diagnosis-badge-inner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <span className={`diagnosis-badge ${band.badgeClass}`}>
                  ⚠ {band.label.toUpperCase()}
                </span>
                {aboveThreshold !== null && (
                  <p className="diagnosis-impact-line">
                    Você está {aboveThreshold}% acima<br />do consumo problemático
                  </p>
                )}
              </motion.div>
            )}
          </div>
        )}

        {showRest && (
          <motion.div
            className="diagnosis-rest"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="diagnosis-markers">
              <div className="diagnosis-markers-header">
                <span className="diagnosis-markers-title">Observações críticas</span>
                <span className="diagnosis-markers-badge">{markers.length} detectadas</span>
              </div>
              {markers.map((marker, index) => {
                const Icon = [Zap, Clock, Frown][index] ?? Zap
                return (
                  <div key={marker.id} className="diagnosis-marker-card">
                    <div className={`diagnosis-marker-icon-shell diagnosis-marker-icon-shell--${index}`}>
                      <Icon size={18} strokeWidth={1.8} />
                    </div>
                    <div className="diagnosis-marker-body">
                      <p className="diagnosis-marker-title">{marker.title}</p>
                      <p className="diagnosis-marker-copy">{marker.copy}</p>
                    </div>
                  </div>
                )
              })}
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
