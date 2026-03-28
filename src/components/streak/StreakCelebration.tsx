import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const PT_DAY_INITIAL = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] // Dom→Sáb

function getWeekDayInitials(now: Date): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (6 - i))
    return PT_DAY_INITIAL[d.getDay()]
  })
}

function getMotivationalLine(days: number): string {
  if (days >= 60) return 'Você está transformando sua vida.'
  if (days >= 30) return 'Um mês. Você provou que consegue.'
  if (days >= 21) return 'Três semanas. O hábito está se formando.'
  if (days >= 14) return 'Duas semanas. Seu cérebro já está mudando.'
  if (days >= 7) return 'Uma semana inteira. Isso é real.'
  return 'Cada dia conta. Continue.'
}

function useCountUp(target: number, duration = 1000) {
  const [count, setCount] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return count
}

interface StreakCelebrationProps {
  diasStreak: number
  diasRecentes: boolean[]
  demoNow: Date
  onDismiss: () => void
}

export function StreakCelebration({
  diasStreak,
  diasRecentes,
  demoNow,
  onDismiss,
}: StreakCelebrationProps) {
  const count = useCountUp(diasStreak, 1000)
  const dayInitials = getWeekDayInitials(demoNow)
  const motivationalLine = getMotivationalLine(diasStreak)

  return (
    <motion.div
      className="streak-cel-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onDismiss}
    >
      {/* Background glows */}
      <div className="streak-cel-bg-amber" aria-hidden="true" />
      <div className="streak-cel-bg-cyan" aria-hidden="true" />

      <div className="streak-cel-inner" onClick={(e) => e.stopPropagation()}>

        {/* Número com count-up */}
        <motion.div
          className="streak-cel-number-wrap"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
          <span className="streak-cel-number">{count}</span>
          <motion.span
            className="streak-cel-unit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            dias limpo
          </motion.span>
        </motion.div>

        {/* Linha motivacional */}
        <motion.p
          className="streak-cel-motto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4, ease: 'easeOut' }}
        >
          {motivationalLine}
        </motion.p>

        {/* Calendário dos últimos 7 dias */}
        <motion.div
          className="streak-cel-calendar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.4, ease: 'easeOut' }}
          aria-label="Últimos 7 dias"
        >
          {diasRecentes.map((clean, i) => {
            const isToday = i === 6
            return (
              <div
                key={i}
                className={`streak-cel-day${isToday ? ' streak-cel-day-today' : ''}`}
              >
                <span className="streak-cel-weekday">{dayInitials[i]}</span>
                <div
                  className={[
                    'streak-cel-dot',
                    clean ? 'streak-cel-dot-clean' : '',
                    isToday ? 'streak-cel-dot-today' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {clean ? <Check size={9} strokeWidth={2.5} /> : null}
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* Botão */}
        <motion.button
          type="button"
          className="button button-primary shimmer streak-cel-btn"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.4, ease: 'easeOut' }}
          onClick={onDismiss}
        >
          Continuar
        </motion.button>

      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────
   Hook que encapsula a lógica de trigger/storage.
   Retorna `true` quando a celebração deve ser exibida.
   Chame `dismiss()` para fechar e marcar o dia como visto.
───────────────────────────────────────────────────── */

const CELEBRATION_DATE_KEY = 'coruja.celebration.lastDate'

function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

export function useStreakCelebration(
  streakCurrent: number,
  demoNow: Date,
) {
  const [visible, setVisible] = useState(false)

  // Ref para sempre capturar os valores mais recentes sem recriar o interval
  const checkRef = useRef<() => void>(() => {})

  checkRef.current = () => {
    if (streakCurrent <= 0) return
    const todayStr = toDateStr(demoNow)
    if (localStorage.getItem(CELEBRATION_DATE_KEY) === todayStr) return
    localStorage.setItem(CELEBRATION_DATE_KEY, todayStr)
    setVisible(true)
  }

  useEffect(() => {
    // Trigger 1: app abre
    checkRef.current()

    // Trigger 2: virada de meia-noite — verifica a cada minuto
    const id = setInterval(() => {
      checkRef.current()
    }, 60_000)

    return () => clearInterval(id)
  }, []) // roda só na montagem; o ref mantém valores frescos

  function dismiss() {
    setVisible(false)
  }

  return { visible, dismiss }
}

/* Wrapper com AnimatePresence para o fade-out suave */
export function StreakCelebrationGate({
  diasStreak,
  diasRecentes,
  demoNow,
}: {
  diasStreak: number
  diasRecentes: boolean[]
  demoNow: Date
}) {
  const { visible, dismiss } = useStreakCelebration(diasStreak, demoNow)

  return (
    <AnimatePresence>
      {visible && (
        <StreakCelebration
          diasStreak={diasStreak}
          diasRecentes={diasRecentes}
          demoNow={demoNow}
          onDismiss={dismiss}
        />
      )}
    </AnimatePresence>
  )
}
