import { type CSSProperties, type PointerEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, Sun } from 'lucide-react'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { buildCheckInStrategy, hasCheckInToday } from '../../core/domain/check-in'
import { appRoutes } from '../../core/config/routes'

type MoodTone = 'danger' | 'warning' | 'amber' | 'good' | 'calm'

interface MoodOption {
  id: string
  emoji: string
  label: string
  context: string
  color: string
  tone: MoodTone
}

const moodOptions: MoodOption[] = [
  {
    id: 'ansioso',
    emoji: '😞',
    label: 'Muito mal',
    context: 'O check-in de hoje vai considerar isso.',
    color: '#C44B4B',
    tone: 'danger',
  },
  {
    id: 'cansado',
    emoji: '😔',
    label: 'Cansado',
    context: 'O check-in de hoje vai considerar isso.',
    color: '#E07428',
    tone: 'warning',
  },
  {
    id: 'calmo',
    emoji: '😐',
    label: 'Neutro',
    context: 'Tudo bem. Vamos registrar o dia.',
    color: '#EC9731',
    tone: 'amber',
  },
  {
    id: 'bem',
    emoji: '🙂',
    label: 'Bem',
    context: 'Otimo momento para registrar no jornal.',
    color: '#5EBD8A',
    tone: 'good',
  },
  {
    id: 'tranquilo',
    emoji: '😌',
    label: 'Tranquilo',
    context: 'Otimo momento para registrar no jornal.',
    color: '#3DAA7D',
    tone: 'calm',
  },
]

const fallbackTriggers = [
  'Redes sociais',
  'Celular na cama',
  'Tedio',
  'Depois de um dia estressante',
]

const cravingSegmentColors = [
  '#3DAA7D',
  '#3DAA7D',
  '#3DAA7D',
  '#EC9731',
  '#EC9731',
  '#EC9731',
  '#E07428',
  '#E07428',
  '#C44B4B',
  '#C44B4B',
]

function formatPtDay(value: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(value)
}

function getCravingStateCopy(craving: number) {
  if (craving >= 9) {
    return { label: 'Critico - considere usar o SOS', color: '#C44B4B' }
  }

  if (craving >= 7) {
    return { label: 'Alto', color: '#E07428' }
  }

  if (craving >= 4) {
    return { label: 'Atencao', color: '#EC9731' }
  }

  return { label: 'Estavel', color: '#3DAA7D' }
}

function getSegmentStyle(index: number, animatedValue: number, hoveredIndex: number | null) {
  const active = animatedValue >= index + 1
  const color = cravingSegmentColors[index]
  const isHovered = hoveredIndex === index
  const distance = hoveredIndex === null ? null : Math.abs(hoveredIndex - index)
  const scale =
    hoveredIndex === null
      ? 1
      : isHovered
        ? 1.3
        : distance === 1
          ? 1.16
          : distance === 2
            ? 1.08
            : 1

  return {
    '--segment-color': color,
    background: active ? color : 'rgba(255,255,255,0.06)',
    boxShadow: isHovered ? `0 0 16px ${color}66` : 'none',
    transform: `scale(${scale})`,
  } as CSSProperties
}

function CheckInSeparator() {
  return <div className="checkin-separator" aria-hidden="true" />
}

function CheckInSection({
  index,
  label,
  title,
  description,
  locked = false,
  children,
}: {
  index: number
  label: string
  title: string
  description?: string
  locked?: boolean
  children: React.ReactNode
}) {
  return (
    <motion.section
      className={locked ? 'checkin-section checkin-section-locked' : 'checkin-section'}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: 'easeOut', delay: index * 0.08 }}
    >
      <p className="checkin-section-label">{label}</p>
      <div className="checkin-section-copy">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {locked ? (
        <div className="checkin-lock-hint">
          <span className="checkin-lock-dot" aria-hidden="true" />
          <span>Disponivel depois de confirmar o compromisso acima.</span>
        </div>
      ) : null}
      {children}
    </motion.section>
  )
}

function CommitmentButton({
  confirmed,
  locked,
  onConfirm,
}: {
  confirmed: boolean
  locked: boolean
  onConfirm: (event: PointerEvent<HTMLButtonElement>) => void
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  function handleClick(event: PointerEvent<HTMLButtonElement>) {
    if (confirmed || locked) {
      return
    }

    const button = buttonRef.current
    if (button) {
      const rect = button.getBoundingClientRect()
      const ripple = document.createElement('span')
      const size = Math.max(rect.width, rect.height) * 1.4
      ripple.className = 'commitment-ripple'
      ripple.style.width = `${size}px`
      ripple.style.height = `${size}px`
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`
      button.appendChild(ripple)
      ripple
        .animate(
          [
            { transform: 'scale(0.2)', opacity: 0.45 },
            { transform: 'scale(1)', opacity: 0 },
          ],
          {
            duration: 520,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          },
        )
        .onfinish = () => ripple.remove()
    }

    onConfirm(event)
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={confirmed ? 'commitment-button commitment-button-confirmed' : 'commitment-button'}
      onClick={handleClick}
      disabled={locked}
    >
      <motion.div
        className="commitment-button-icon"
        initial={false}
        animate={confirmed ? { scale: [0.8, 1.14, 1], rotate: [0, -6, 0] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        {confirmed ? <Check size={28} /> : <Sun size={32} />}
      </motion.div>
      <strong>{confirmed ? 'Sobriedade confirmada' : 'Confirmar sobriedade hoje'}</strong>
      <span>
        {confirmed ? 'Agora o restante do check-in foi liberado' : 'Toque para liberar o check-in'}
      </span>
    </button>
  )
}

function CravingSelector({
  value,
  disabled,
  onChange,
  onSosClick,
}: {
  value: number
  disabled: boolean
  onChange: (next: number) => void
  onSosClick: () => void
}) {
  const [animatedValue, setAnimatedValue] = useState(value)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const animatedValueRef = useRef(value)

  useEffect(() => {
    animatedValueRef.current = animatedValue
  }, [animatedValue])

  useEffect(() => {
    let frame = 0
    const startValue = animatedValueRef.current
    const delta = value - startValue
    const duration = 260
    const startedAt = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedValue(startValue + delta * eased)

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])

  const cravingCopy = getCravingStateCopy(value)

  return (
    <div className="craving-selector">
      <p className="craving-selector-label">Nivel de vontade agora</p>
      <div className="craving-number-row">
        {Array.from({ length: 10 }, (_, index) => {
          const number = index + 1
          const active = value === number

          return (
            <button
              key={number}
              type="button"
              className={active ? 'craving-number active' : 'craving-number'}
              disabled={disabled}
              onClick={() => onChange(number)}
            >
              {number}
            </button>
          )
        })}
      </div>

      <div className="craving-bar" role="group" aria-label="Intensidade da vontade">
        {Array.from({ length: 10 }, (_, index) => (
          <button
            key={index}
            type="button"
            className="craving-segment"
            style={getSegmentStyle(index, animatedValue, hoveredIndex)}
            disabled={disabled}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            onClick={() => onChange(index + 1)}
          />
        ))}
      </div>

      <div className="craving-state-slot">
        <AnimatePresence mode="wait">
          <motion.div
            key={cravingCopy.label}
            className="craving-state"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
          >
            <strong style={{ color: cravingCopy.color }}>{cravingCopy.label}</strong>
            {value >= 9 ? (
              <button type="button" className="checkin-inline-link" onClick={onSosClick}>
                Ir para o SOS
              </button>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function MoodRating({
  value,
  disabled,
  onChange,
}: {
  value: string | null
  disabled: boolean
  onChange: (next: string) => void
}) {
  const selectedMood = moodOptions.find((item) => item.id === value) ?? null

  return (
    <div className="mood-rating">
      <div className="mood-rating-row">
        {moodOptions.map((item) => {
          const selected = value === item.id
          const dimmed = value !== null && !selected

          return (
            <button
              key={item.id}
              type="button"
              className="mood-option"
              disabled={disabled}
              onClick={() => onChange(item.id)}
              style={
                {
                  '--mood-color': item.color,
                  filter: selected
                    ? `grayscale(0) drop-shadow(0 0 8px ${item.color}40)`
                    : dimmed
                      ? 'grayscale(0.8)'
                      : 'grayscale(0.6)',
                  opacity: selected ? 1 : dimmed ? 0.4 : 0.7,
                  transform: selected ? 'scale(1.2)' : 'scale(1)',
                } as CSSProperties
              }
            >
              <span className="mood-option-emoji" aria-hidden="true">
                {item.emoji}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mood-state-slot">
        <AnimatePresence mode="wait">
          {selectedMood ? (
            <motion.div
              key={selectedMood.id}
              className="mood-state-copy"
              initial={{ opacity: 0, filter: 'blur(8px)', y: 4 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(8px)', y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <strong style={{ color: selectedMood.color }}>{selectedMood.label}</strong>
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: 0.15 }}
              >
                {selectedMood.context}
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="mood-state-copy mood-state-copy-empty"
              initial={{ opacity: 0, filter: 'blur(8px)', y: 4 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              exit={{ opacity: 0, filter: 'blur(8px)', y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <strong>Escolha como voce esta</strong>
              <p>Isso ajuda o app a interpretar melhor este momento.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function CheckInPage() {
  const navigate = useNavigate()
  const { state, saveCheckIn, demoNow } = useAppState()
  const [pledgeConfirmed, setPledgeConfirmed] = useState(false)
  const [craving, setCraving] = useState(0)
  const [mentalState, setMentalState] = useState<string | null>(null)
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const alreadyCheckedIn = useMemo(
    () => hasCheckInToday(state.checkIns, demoNow),
    [demoNow, state.checkIns],
  )
  const availableTriggers =
    state.profile.triggers.length > 0 ? state.profile.triggers : fallbackTriggers

  const strategy =
    mentalState === null
      ? null
      : buildCheckInStrategy({
          craving,
          mentalState,
          triggers: selectedTriggers,
        })

  function toggleTrigger(trigger: string) {
    setSelectedTriggers((current) =>
      current.includes(trigger)
        ? current.filter((item) => item !== trigger)
        : [...current, trigger],
    )
  }

  const suggestSos = craving >= 7

  async function handlePersistAndGoHome() {
    if (!mentalState || !strategy || isSaving) {
      return
    }

    setIsSaving(true)

    const result = await saveCheckIn({
      craving,
      mentalState,
      triggers: selectedTriggers,
      notes,
      strategy,
      escalatedToSos: suggestSos,
    })

    if (!result.saved) {
      setIsSaving(false)
      return
    }

    navigate(appRoutes.home, { replace: true })
  }

  return (
    <AppShell title="" eyebrow="" hideTopbar>
      <section className="checkin-screen">
        <header className="checkin-header">
          <button className="app-back-button" type="button" onClick={() => navigate(appRoutes.home)}>
            <ChevronLeft size={18} strokeWidth={2.2} />
          </button>
          <div className="checkin-header-copy">
            <p className="checkin-date">{formatPtDay(demoNow)}</p>
            <h1>Check-in de hoje</h1>
          </div>
        </header>

        {alreadyCheckedIn && !isSaving ? (
          <motion.section
            className="checkin-section checkin-section-complete"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <p className="checkin-section-label">registrado hoje</p>
            <div className="checkin-complete-card">
              <div className="checkin-complete-icon">
                <Check size={28} />
              </div>
              <div className="checkin-section-copy">
                <h2>Seu check-in de hoje ja foi feito</h2>
                <p>O app libera um check-in por dia para manter o historico mais confiavel.</p>
              </div>
            </div>
            <div className="hero-actions">
              <button className="button button-secondary" onClick={() => navigate(appRoutes.home)}>
                Voltar para a Home
              </button>
              <button className="button button-primary" onClick={() => navigate(appRoutes.sos)}>
                Ir para o SOS
              </button>
            </div>
          </motion.section>
        ) : (
          <>
            <CheckInSection
              index={0}
              label="compromisso"
              title="Confirme a direcao de hoje"
              description="Isso libera o restante do check-in."
            >
              <CommitmentButton
                confirmed={pledgeConfirmed}
                locked={false}
                onConfirm={() => setPledgeConfirmed(true)}
              />
            </CheckInSection>

            <CheckInSeparator />

            <motion.div
              className={pledgeConfirmed ? 'checkin-unlocked checkin-unlocked-active' : 'checkin-unlocked'}
              initial={false}
              animate={
                pledgeConfirmed
                  ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
                  : { opacity: 0.38, y: 10, scale: 0.985, filter: 'blur(1.5px)' }
              }
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <CheckInSection
                index={1}
                label="vontade"
                title="Como esta sua vontade agora?"
                description="Registre de 1 a 10."
                locked={!pledgeConfirmed}
              >
                <CravingSelector
                  value={craving}
                  disabled={!pledgeConfirmed}
                  onChange={setCraving}
                  onSosClick={() => navigate(appRoutes.sos)}
                />
              </CheckInSection>

              <CheckInSeparator />

              <CheckInSection
                index={2}
                label="estado mental"
                title="Como voce se percebe agora?"
                description="Escolha o estado que mais combina."
                locked={!pledgeConfirmed}
              >
                <MoodRating
                  value={mentalState}
                  disabled={!pledgeConfirmed}
                  onChange={setMentalState}
                />
              </CheckInSection>

              <CheckInSeparator />

              <CheckInSection
                index={3}
                label="gatilhos"
                title="O que pode estar contribuindo?"
                description="Marque o que pesa hoje."
                locked={!pledgeConfirmed}
              >
                <div className="checkin-trigger-list">
                  {availableTriggers.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={
                        selectedTriggers.includes(item)
                          ? 'trigger-chip selected'
                          : 'trigger-chip'
                      }
                      disabled={!pledgeConfirmed}
                      onClick={() => toggleTrigger(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </CheckInSection>

              <CheckInSeparator />

              <CheckInSection
                index={4}
                label="observacao"
                title="Algo importante sobre este momento?"
                description="Opcional."
                locked={!pledgeConfirmed}
              >
                <textarea
                  id="notes"
                  className="textarea checkin-notes"
                  value={notes}
                  disabled={!pledgeConfirmed}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="O que esta pesando mais agora?"
                />
              </CheckInSection>

              <motion.div
                className="checkin-submit-footer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.35 }}
              >
                <button
                  className="button button-primary shimmer checkin-submit"
                  type="button"
                  disabled={!pledgeConfirmed || !mentalState || isSaving}
                  onClick={() => void handlePersistAndGoHome()}
                >
                  {isSaving ? 'Salvando...' : 'Salvar check-in'}
                </button>
              </motion.div>
            </motion.div>

            <div className="checkin-footer-spacer" />
          </>
        )}
      </section>
    </AppShell>
  )
}
