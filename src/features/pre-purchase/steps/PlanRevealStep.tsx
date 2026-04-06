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

  const [typedSubtitle, setTypedSubtitle] = useState('')
  const [showDate, setShowDate] = useState(false)
  const [streakCount, setStreakCount] = useState(0)
  const [settled, setSettled] = useState(false)

  const subtitleDone = typedSubtitle.length >= SUBTITLE.length

  useEffect(() => {
    const cleanups: (() => void)[] = []
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms)
      cleanups.push(() => clearTimeout(t))
    }
    const interval = (fn: () => void, ms: number) => {
      const t = setInterval(fn, ms)
      cleanups.push(() => clearInterval(t))
      return t
    }

    // Fase 1: pausa inicial, depois digita o subtítulo no lugar certo
    later(() => {
      let i = 0
      const t = interval(() => {
        i++
        setTypedSubtitle(SUBTITLE.slice(0, i))
        if (i >= SUBTITLE.length) {
          clearInterval(t)

          // Fase 2: pausa, mostra bloco de data
          later(() => {
            setShowDate(true)

            // Fase 3: pausa, conta streak 0 → 90
            later(() => {
              let count = 0
              const up = interval(() => {
                count++
                setStreakCount(count)
                if (count >= COUNT_UP_TARGET) {
                  clearInterval(up)

                  // Fase 4: pausa, volta para 0
                  later(() => {
                    const down = interval(() => {
                      count--
                      setStreakCount(count)
                      if (count <= 0) {
                        clearInterval(down)
                        setStreakCount(0)

                        // Fase 5: settled
                        later(() => setSettled(true), 250)
                      }
                    }, 8)
                  }, 350)
                }
              }, 20)
            }, 500)
          }, 280)
        }
      }, 30)
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

          <p className="pr-plan-ready">
            {typedSubtitle}
            {typedSubtitle.length > 0 && !subtitleDone && <span className="pr-cursor" />}
          </p>

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
            initial={{ y: 360, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
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
