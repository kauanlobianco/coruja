import { ArrowLeft, ArrowRight, CalendarCheck } from 'lucide-react'
import { motion } from 'framer-motion'
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

const SUBTITLE = 'seu plano personalizado está pronto'
const COUNT_UP_TARGET = 90

export function PlanRevealStep({ name, onBack, onContinue }: PlanRevealStepProps) {
  const displayName = name || 'Você'
  const planDate = getPlanDate()
  const planDateShort = getPlanDateShort()

  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showDate, setShowDate] = useState(false)
  const [streakCount, setStreakCount] = useState(0)
  const [settled, setSettled] = useState(false)

  const isCounting = streakCount > 0 && !settled

  useEffect(() => {
    const cleanups: (() => void)[] = []
    const animateCount = (
      from: number,
      to: number,
      duration: number,
      easing: (t: number) => number,
      onFinish?: () => void,
    ) => {
      const start = performance.now()
      let rafId = 0

      const frame = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = easing(progress)
        setStreakCount(Math.round(from + (to - from) * eased))

        if (progress < 1) {
          rafId = requestAnimationFrame(frame)
        } else {
          onFinish?.()
        }
      }

      rafId = requestAnimationFrame(frame)
      cleanups.push(() => cancelAnimationFrame(rafId))
    }

    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms)
      cleanups.push(() => clearTimeout(t))
    }
    // Fase 1: pausa inicial, depois revela o subtitulo
    later(() => {
      setShowSubtitle(true)

      // Fase 2: pausa, mostra bloco de data
      later(() => {
        setShowDate(true)

        // Fase 3: pausa, conta streak 0 -> 90
        later(() => {
          animateCount(0, COUNT_UP_TARGET, 1280, (t) => 1 - Math.pow(1 - t, 3), () => {
            later(() => {
              animateCount(COUNT_UP_TARGET, 0, 820, (t) => 1 - Math.pow(1 - t, 2), () => {
                setStreakCount(0)
                later(() => setSettled(true), 250)
              })
            }, 380)
          })
        }, 500)
      }, 420)
    }, 500)

    return () => cleanups.forEach((fn) => fn())
  }, [])

  return (
    <section className="pr-page">
      <div className="foco-landing-particles" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="foco-particle" />
        ))}
      </div>

      <div className="pr-scroll">
        <button type="button" onClick={onBack} aria-label="Voltar" className="cp-back-button pr-back">
          <ArrowLeft size={18} />
        </button>

        {/* Hero — nome sempre visível, subtítulo e data revelados progressivamente */}
        <div className="pr-hero">
          <h1 className="pr-name">{displayName}</h1>

          <motion.p
            className="pr-plan-ready"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: showSubtitle ? 1 : 0, y: showSubtitle ? 0 : 10 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {SUBTITLE}
          </motion.p>

          <motion.div
            className="pr-date-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: showDate ? 1 : 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <CalendarCheck size={18} className="pr-date-icon" />
            <div>
              <p className="pr-date-label">Você vai parar a pornografia até:</p>
              <span className="pr-date-text">{planDate}</span>
            </div>
          </motion.div>
        </div>

        {/* Card — entra lentamente de baixo */}
        <div className="pr-card-wrapper">
          <motion.div
            initial={{ y: 440, opacity: 0, scale: 0.92, rotateX: 14, filter: 'blur(10px)' }}
            animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.95, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'center bottom' }}
          >
            <motion.div
              animate={isCounting
                ? {
                    x: [0, -1.5, 1.5, -1, 1, 0],
                    y: [0, -1, 0.5, -0.5, 0],
                    rotateZ: [0, -0.35, 0.35, -0.2, 0.2, 0],
                    scale: [1, 1.006, 0.998, 1.004, 1],
                  }
                : { x: 0, y: 0, rotateZ: 0, scale: 1 }}
              transition={isCounting
                ? { duration: 0.42, ease: 'easeInOut', repeat: Infinity }
                : { duration: 0.22, ease: 'easeOut' }}
              style={{ transformOrigin: 'center center' }}
            >
            <div className="pp-identity-card">
              <div className="pp-identity-card-shine" aria-hidden="true" />

              <div className="pp-identity-card-header">
                <div className="foco-brand-logo foco-brand-logo--card">
                  <div className="foco-brand-top">FOCO</div>
                  <div className="foco-brand-bottom">
                    <span>M</span>
                    <div className="foco-brand-toggle is-on">
                      <div className="foco-brand-toggle-knob" />
                    </div>
                    <span>E</span>
                  </div>
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
          </motion.div>
        </div>

        <motion.p
          className="pr-outro"
          initial={{ opacity: 0 }}
          animate={{ opacity: settled ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        >
          Construído em torno de você. Cada dia registrado aqui.
        </motion.p>
      </div>

      <motion.div
        className="pr-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={settled ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <button type="button" className="button button-ember-brand pr-cta" onClick={onContinue}>
          Ver meu plano personalizado
          <ArrowRight size={16} />
        </button>
      </motion.div>
    </section>
  )
}


