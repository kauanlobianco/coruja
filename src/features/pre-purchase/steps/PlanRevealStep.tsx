import { ArrowLeft, CalendarCheck, Flame, Lock } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PlanRevealStepProps {
  name: string
  onBack: () => void
  onContinue: () => void
}

function getPlanDate() {
  const date = new Date()
  date.setDate(date.getDate() + 90)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
}

function getPlanDateShort() {
  const date = new Date()
  date.setDate(date.getDate() + 90)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
}

const SHAKE_DURATION = 1600
const COUNT_TARGET = 30

export function PlanRevealStep({ name, onBack, onContinue }: PlanRevealStepProps) {
  const displayName = name || 'Você'
  const planDate = getPlanDate()
  const planDateShort = getPlanDateShort()

  const [streakCount, setStreakCount] = useState(0)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const stepInterval = SHAKE_DURATION / COUNT_TARGET
    let current = 0

    const counter = setInterval(() => {
      current++
      setStreakCount(current)
      if (current >= COUNT_TARGET) clearInterval(counter)
    }, stepInterval)

    const settle = setTimeout(() => setSettled(true), SHAKE_DURATION + 200)

    return () => {
      clearInterval(counter)
      clearTimeout(settle)
    }
  }, [])

  return (
    <section className="pr-page">
      {/* Overlay de cor — fade via opacidade, sem interpolação de gradientes */}
      <AnimatePresence>
        {settled && (
          <motion.div
            className="pr-bg-overlay"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: 'easeIn' }}
          />
        )}
      </AnimatePresence>

      <div className="pr-scroll">
        <button type="button" onClick={onBack} aria-label="Voltar" className="cp-back-button pr-back">
          <ArrowLeft size={18} />
        </button>

        {/* Hero sempre montado e reservando espaço — só opacidade anima.
            Isso garante que o card nunca mude de posição. */}
        <motion.div
          className="pr-hero"
          animate={{ opacity: settled ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h1 className="pr-name">
            {displayName}
            <span className="pr-name-accent">,</span>
          </h1>
          <p className="pr-plan-ready">seu plano personalizado está pronto</p>
          <p className="pr-subtitle">você vai parar a pornografia até:</p>
          <div className="pr-date-block">
            <CalendarCheck size={18} className="pr-date-icon" />
            <span className="pr-date-text">{planDate}</span>
          </div>
        </motion.div>

        {/* Card sempre na posição final — apenas vibra no lugar */}
        <div className="pr-card-wrapper">
          <motion.div
            animate={settled
              ? { x: 0, rotate: 0 }
              : {
                  x: [0, -10, 10, -8, 8, -5, 5, -2, 2, 0],
                  rotate: [0, -1.5, 1.5, -1, 1, -0.3, 0.3, 0],
                }
            }
            transition={{ duration: SHAKE_DURATION / 1000, ease: 'easeOut' }}
          >
            <div className="pp-identity-card">
              <div className="pp-identity-card-shine" aria-hidden="true" />

              <div className="pp-identity-card-header">
                <div className="pp-identity-brand">
                  <Flame size={14} />
                  <span>CORUJA</span>
                </div>
                <div className="pp-identity-card-badge">
                  <span>Premium</span>
                </div>
              </div>

              <div className="pp-identity-streak-block">
                <p className="pp-identity-streak-label">Sequência ativa</p>
                <div className="pp-identity-streak-row">
                  <span className="pp-identity-streak-number">{streakCount}</span>
                  <span className="pp-identity-streak-unit">dias</span>
                </div>
              </div>

              <div className="pp-identity-card-footer">
                <div className="pp-identity-meta">
                  <p className="pp-identity-meta-label">Nome</p>
                  <p className="pp-identity-meta-value">{displayName}</p>
                </div>
                <div className="pp-identity-meta pp-identity-meta--right">
                  <p className="pp-identity-meta-label">Meta</p>
                  <p className="pp-identity-meta-value">{planDateShort}</p>
                </div>
                <div className="pp-identity-meta pp-identity-meta--right">
                  <p className="pp-identity-meta-label">Livre desde</p>
                  <p className="pp-identity-meta-value">hoje</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Outro sempre montado, só opacidade */}
        <motion.p
          className="pr-outro"
          animate={{ opacity: settled ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        >
          Construído em torno de você. Cada dia registrado aqui.
        </motion.p>
      </div>

      {/* Footer sempre montado, anima posição só uma vez */}
      <motion.div
        className="pr-footer"
        animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <button type="button" className="button button-ember-brand pr-cta" onClick={onContinue}>
          <Lock size={16} />
          Desbloquear plano personalizado
        </button>
        <p className="pr-disclaimer">A compra aparece discretamente</p>
      </motion.div>
    </section>
  )
}
