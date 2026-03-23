import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Clock, Frown, Zap } from 'lucide-react'
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

export function DiagnosisStep({ diagnosis, onBack, onContinue }: DiagnosisStepProps) {
  const { band, scorePercent, markers } = diagnosis
  const aboveThreshold = Math.max(scorePercent - PROBLEMATIC_THRESHOLD, 0)
  const referencePercent = PROBLEMATIC_THRESHOLD
  const referenceBarHeight = 30
  const userBarHeight =
    scorePercent <= referencePercent
      ? Math.max(18, Math.round((scorePercent / referencePercent) * referenceBarHeight))
      : Math.min(100, referenceBarHeight + aboveThreshold * 2)

  const [showScore, setShowScore] = useState(false)
  const [displayCount, setDisplayCount] = useState(0)
  const [showBadge, setShowBadge] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showRest, setShowRest] = useState(false)

  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    setShowScore(true)
  }, [])

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
          setTimeout(() => {
            setShowComparison(true)
            setTimeout(() => setShowRest(true), 1800)
          }, 350)
        }, 400)
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [showScore, scorePercent])

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
          <p className="diagnosis-context-text">
            Seu resultado indica como esse consumo esta impactando sua rotina hoje.
          </p>
        </div>

        {showScore && (
          <motion.div
            className="diagnosis-score-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
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
              </motion.div>
            )}
          </motion.div>
        )}

        {showComparison ? (
          <motion.div
            className="diagnosis-compare-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <div className="diagnosis-compare-card-copy">
              <span className="diagnosis-compare-card-kicker">Comparacao com a referencia</span>
              <p className="diagnosis-compare-card-title">
                Seu padrao esta {aboveThreshold}% acima da linha de consumo problematico.
              </p>
            </div>

            <div className="diagnosis-compare-chart" aria-label="Comparacao entre seu resultado e a referencia de risco">
              <div className="diagnosis-compare-column">
                <div className="diagnosis-compare-track">
                  <motion.div
                    className="diagnosis-compare-bar diagnosis-compare-bar-user"
                    initial={{ height: 12, opacity: 0.5 }}
                    animate={{ height: `${userBarHeight}%`, opacity: 1 }}
                    transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                  >
                    <span className="diagnosis-compare-bar-value">{scorePercent}%</span>
                  </motion.div>
                </div>
                <span className="diagnosis-compare-bar-label">Seu resultado</span>
              </div>

              <div className="diagnosis-compare-column">
                <div className="diagnosis-compare-track">
                  <motion.div
                    className="diagnosis-compare-bar diagnosis-compare-bar-reference"
                    initial={{ height: 12, opacity: 0.5 }}
                    animate={{ height: `${referenceBarHeight}%`, opacity: 1 }}
                    transition={{ duration: 1.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                  >
                    <span className="diagnosis-compare-bar-value">{referencePercent}%</span>
                  </motion.div>
                </div>
                <span className="diagnosis-compare-bar-label">Referencia</span>
              </div>
            </div>

            <div className="diagnosis-compare">
              <div className="diagnosis-compare-item">
                <p className="diagnosis-compare-number">{scorePercent}<span className="diagnosis-compare-unit">%</span></p>
              </div>
              <div className="diagnosis-compare-divider" />
              <div className="diagnosis-compare-item">
                <p className="diagnosis-compare-number diagnosis-compare-number-safe">
                  {referencePercent}<span className="diagnosis-compare-unit">%</span>
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}

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
              Entender consequencias
            </button>
          </motion.div>
        )}

      </div>
    </section>
  )
}
