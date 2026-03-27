import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Briefcase,
  Clock3,
  Compass,
  HeartHandshake,
  House,
  ListTodo,
  Monitor,
  MoonStar,
  Plus,
  SendHorizontal,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { getPrePurchaseAge, getPrePurchaseName } from '../../features/pre-purchase/storage'

type IconKey =
  | 'brain'
  | 'target'
  | 'heart'
  | 'clock'
  | 'moon'
  | 'sparkles'
  | 'shield'
  | 'briefcase'
  | 'house'
  | 'phone'
  | 'alert'
  | 'tasks'
  | 'monitor'
  | 'compass'

interface TagOption {
  id: string
  label: string
  icon: IconKey
  custom?: boolean
}

interface GoalOption {
  id: string
  days: number
  title: string
  desc: string
}

interface CompletionData {
  name: string
  goalDays: number
  goalTitle: string
}

interface ChatMessage {
  id: string
  role: 'app' | 'user'
  kind: 'text' | 'typing'
  text?: string
  chips?: string[]
}

type OnboardingStep = 'motivations' | 'triggers' | 'goal' | 'done'

const WAVE = '\u{1F44B}'
const OWL = '\u{1F989}'

function FocoBotAvatar() {
  return (
    <div className="ob-chat-avatar-foco" aria-hidden="true">
      <div className="ob-chat-avatar-foco-top">FOCO</div>
      <div className="ob-chat-avatar-foco-bottom">
        <span>M</span>
        <div className="ob-chat-avatar-foco-toggle">
          <div className="ob-chat-avatar-foco-knob" />
        </div>
        <span>E</span>
      </div>
    </div>
  )
}

const iconMap: Record<IconKey, LucideIcon> = {
  brain: Brain,
  target: Target,
  heart: HeartHandshake,
  clock: Clock3,
  moon: MoonStar,
  sparkles: Sparkles,
  shield: Shield,
  briefcase: Briefcase,
  house: House,
  phone: Smartphone,
  alert: TriangleAlert,
  tasks: ListTodo,
  monitor: Monitor,
  compass: Compass,
}

const motivationOptions: TagOption[] = [
  { id: 'clareza', label: 'Mais clareza mental', icon: 'brain' },
  { id: 'controle', label: 'Voltar a ter controle', icon: 'target' },
  { id: 'relacionamentos', label: 'Melhorar relacionamentos', icon: 'heart' },
  { id: 'tempo', label: 'Parar de perder tempo', icon: 'clock' },
  { id: 'sono', label: 'Dormir melhor', icon: 'moon' },
  { id: 'presente', label: 'Estar mais presente', icon: 'sparkles' },
  { id: 'autoestima', label: 'Autoestima mais solida', icon: 'shield' },
  { id: 'trabalho', label: 'Foco no trabalho', icon: 'briefcase' },
]

const triggerOptions: TagOption[] = [
  { id: 'quarto', label: 'Sozinho no quarto', icon: 'house' },
  { id: 'celular', label: 'Celular na cama', icon: 'phone' },
  { id: 'madrugada', label: 'Madrugada', icon: 'moon' },
  { id: 'redes', label: 'Redes sociais', icon: 'sparkles' },
  { id: 'conflito', label: 'Apos um conflito', icon: 'alert' },
  { id: 'tedio', label: 'Enrolando tarefas', icon: 'tasks' },
  { id: 'fds', label: 'Fim de semana', icon: 'clock' },
  { id: 'beber', label: 'Depois de beber', icon: 'clock' },
  { id: 'acordar', label: 'Ao acordar', icon: 'sparkles' },
  { id: 'banho', label: 'No banho', icon: 'sparkles' },
  { id: 'banheiro', label: 'No banheiro', icon: 'house' },
  { id: 'computador', label: 'No computador sozinho', icon: 'monitor' },
  { id: 'insonia', label: 'Deitado sem sono', icon: 'moon' },
  { id: 'navegar', label: 'Navegando sem rumo', icon: 'compass' },
  { id: 'dormir', label: 'Antes de dormir', icon: 'moon' },
]

const goalOptions: GoalOption[] = [
  { id: '5', days: 5, title: 'Ganhar tracao', desc: 'Sair do automatico com firmeza' },
  { id: '10', days: 10, title: 'Criar consistencia', desc: 'Firmar rotina e criar distancia' },
  { id: '15', days: 15, title: 'Recomeco firme', desc: 'Virar a chave com mais estrutura' },
  { id: '30', days: 30, title: 'Marco maior', desc: 'Um compromisso mais longo' },
]

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function TypewriterBubble() {
  return (
    <motion.div
      className="ob-chat-row ob-chat-row--app"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="ob-chat-avatar" aria-hidden="true">
        <FocoBotAvatar />
      </div>
      <motion.div
        className="ob-chat-bubble ob-chat-bubble--app ob-chat-bubble--typing"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24, mass: 0.8 }}
      >
        <span className="ob-chat-dots">
          <motion.span
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          />
          <motion.span
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.16,
            }}
          />
          <motion.span
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{
              duration: 1.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: 0.32,
            }}
          />
        </span>
      </motion.div>
    </motion.div>
  )
}

function TextBubble({
  role,
  text,
  chips,
}: {
  role: 'app' | 'user'
  text?: string
  chips?: string[]
}) {
  return (
    <motion.div
      className={`ob-chat-row ob-chat-row--${role}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {role === 'app' ? (
        <div className="ob-chat-avatar" aria-hidden="true">
          <FocoBotAvatar />
        </div>
      ) : null}
      <motion.div
        className={`ob-chat-bubble ob-chat-bubble--${role}`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24, mass: 0.8 }}
      >
        {chips && chips.length > 0 ? (
          <div className="ob-chat-bubble-chips">
            {chips.map((chip) => (
              <span key={chip} className="ob-chat-bubble-chip">
                {chip}
              </span>
            ))}
          </div>
        ) : null}
        {text ? <span>{text}</span> : null}
      </motion.div>
    </motion.div>
  )
}

function TagsSelector({
  title,
  accent,
  tags,
  selectedTags,
  minimumRequired,
  inputValue,
  onInputChange,
  onAddCustom,
  onToggle,
  allowCustom = true,
}: {
  title: string
  accent: 'cyan' | 'ember'
  tags: TagOption[]
  selectedTags: TagOption[]
  minimumRequired: number
  inputValue: string
  onInputChange: (value: string) => void
  onAddCustom: () => void
  onToggle: (tag: TagOption) => void
  allowCustom?: boolean
}) {
  const selectedContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const selectedIds = new Set(selectedTags.map((tag) => tag.id))
  const availableTags = tags.filter((tag) => !selectedIds.has(tag.id))
  const [isInputExpanded, setIsInputExpanded] = useState(false)

  useEffect(() => {
    if (!selectedContainerRef.current) return
    selectedContainerRef.current.scrollTo({ left: selectedContainerRef.current.scrollWidth, behavior: 'smooth' })
  }, [selectedTags])

  useEffect(() => {
    if (!isInputExpanded) return
    inputRef.current?.focus()
  }, [isInputExpanded])

  return (
    <motion.div
      className="ob-chat-selector"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="ob-chat-selector-head" aria-label={title}>
        <h3>{title} — mín. {minimumRequired}</h3>
        <span className={`ob-chat-selected-count${selectedTags.length >= minimumRequired ? ' ob-chat-selected-count--met' : ''}`}>
          {selectedTags.length} selecionadas
        </span>
      </div>

      {/* Horizontal selected strip */}
      <motion.div className="ob-chat-tags-selected" ref={selectedContainerRef} layout>
        <AnimatePresence initial={false}>
          {selectedTags.length === 0 ? (
            <motion.span
              className="ob-chat-selected-placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Suas escolhas aparecem aqui...
            </motion.span>
          ) : null}
          {selectedTags.map((tag) => {
            const Icon = iconMap[tag.icon] ?? Sparkles
            return (
              <motion.div
                key={tag.id}
                className={`ob-chat-tag ob-chat-tag--selected ob-chat-tag--${accent}`}
                layoutId={`chat-tag-${tag.id}`}
              >
                <span className="ob-chat-tag-icon" aria-hidden="true">
                  <Icon size={14} strokeWidth={2} />
                </span>
                <motion.span layoutId={`chat-tag-label-${tag.id}`} className="ob-chat-tag-label">
                  {tag.label}
                </motion.span>
                <button type="button" className="ob-chat-tag-remove" onClick={() => onToggle(tag)} aria-label={`Remover ${tag.label}`}>
                  {'\u00D7'}
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Available tags + add custom */}
      <motion.div className="ob-chat-tags-available" layout>
        {allowCustom ? (
          isInputExpanded ? (
            <div className="ob-chat-inline-input-shell">
              <input
                ref={inputRef}
                className="ob-chat-inline-input"
                value={inputValue}
                onChange={(event) => onInputChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    onAddCustom()
                    setIsInputExpanded(false)
                  }
                  if (event.key === 'Escape') {
                    setIsInputExpanded(false)
                  }
                }}
                onBlur={() => {
                  if (!inputValue.trim()) setIsInputExpanded(false)
                }}
                placeholder="Adicionar outro..."
              />
              <button
                type="button"
                className="ob-chat-inline-send"
                aria-label="Confirmar"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => { onAddCustom(); setIsInputExpanded(false) }}
              >
                <SendHorizontal size={14} strokeWidth={2} />
              </button>
            </div>
          ) : (
            <button type="button" className="ob-chat-inline-add" onClick={() => setIsInputExpanded(true)}>
              <Plus size={14} strokeWidth={2.2} />
              <span>Adicionar</span>
            </button>
          )
        ) : null}
        {availableTags.map((tag) => {
          const Icon = iconMap[tag.icon] ?? Sparkles
          return (
            <motion.button
              key={tag.id}
              type="button"
              className="ob-chat-tag ob-chat-tag--available"
              layoutId={`chat-tag-${tag.id}`}
              onClick={() => onToggle(tag)}
            >
              <span className="ob-chat-tag-icon" aria-hidden="true">
                <Icon size={14} strokeWidth={2} />
              </span>
              <motion.span layoutId={`chat-tag-label-${tag.id}`} className="ob-chat-tag-label">
                {tag.label}
              </motion.span>
            </motion.button>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

function CompletionOverlay({
  name,
  goalDays,
  goalTitle,
  onDismiss,
}: {
  name: string
  goalDays: number
  goalTitle: string
  onDismiss: () => void
}) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 2800)
    return () => window.clearTimeout(timer)
  }, [onDismiss])

  const displayName = name.charAt(0).toUpperCase() + name.slice(1)

  return (
    <motion.div
      className="ob-completion-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="ob-completion-content">
        <motion.div
          className="ob-completion-goal-orb"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.1 }}
        >
          <span className="ob-completion-orb-days">{goalDays}</span>
          <span className="ob-completion-orb-unit">dias</span>
        </motion.div>

        <motion.h1
          className="ob-completion-title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: 'easeOut', delay: 0.28 }}
        >
          Pronto, {displayName}.
        </motion.h1>

        <motion.span
          className="ob-completion-goal-chip"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.44 }}
        >
          {goalTitle}
        </motion.span>

        <motion.p
          className="ob-completion-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.62 }}
        >
          Sua jornada começa agora.
        </motion.p>
      </div>
    </motion.div>
  )
}

function ChatProgress({ step }: { step: OnboardingStep }) {
  const activeIndex = step === 'motivations' ? 0 : step === 'triggers' ? 1 : 2
  const labels = ['Motivos', 'Gatilhos', 'Meta']

  return (
    <div className="ob-chat-progress" aria-label="Progresso do onboarding">
      <div className="ob-chat-progress-track">
        {labels.map((label, index) => (
          <div
            key={label}
            className={`ob-chat-progress-segment${index <= activeIndex ? ' is-active' : ''}`}
          />
        ))}
      </div>
      <div className="ob-chat-progress-labels">
        {labels.map((label, index) => (
          <span key={label} className={index === activeIndex ? 'is-active' : ''}>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

function GoalSelector({
  selectedGoalId,
  onSelect,
}: {
  selectedGoalId: string | null
  onSelect: (goal: GoalOption) => void
}) {
  return (
    <motion.div
      className="ob-chat-selector"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="ob-chat-selector-head">
        <h3>Sua meta inicial — escolha o ritmo</h3>
      </div>
      <div className="ob-chat-goal-grid">
        {goalOptions.map((goal) => {
          const isSelected = selectedGoalId === goal.id

          return (
            <motion.button
              key={goal.id}
              type="button"
              className={`ob-chat-goal-card${isSelected ? ' ob-chat-goal-card--selected' : ''}`}
              onClick={() => onSelect(goal)}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -2 }}
            >
              <div className="ob-chat-goal-days">
                <strong>{goal.days}</strong>
                <span>dias</span>
              </div>
              <div className="ob-chat-goal-copy">
                <span className="ob-chat-goal-title">{goal.title}</span>
                <span className="ob-chat-goal-desc">{goal.desc}</span>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

export function OnboardingChat() {
  const navigate = useNavigate()
  const { state, completeOnboarding } = useAppState()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('motivations')
  const [isTyping, setIsTyping] = useState(false)
  const [motivationInput, setMotivationInput] = useState('')
  const [triggerInput, setTriggerInput] = useState('')
  const [selectedMotivations, setSelectedMotivations] = useState<TagOption[]>(
    (state.profile.motivations ?? []).map((label) => {
      const existing = motivationOptions.find((option) => option.label === label)
      return existing ?? { id: `custom-${slugify(label)}`, label, icon: 'sparkles', custom: true }
    }),
  )
  const [selectedTriggers, setSelectedTriggers] = useState<TagOption[]>(
    (state.profile.triggers ?? []).map((label) => {
      const existing = triggerOptions.find((option) => option.label === label)
      return existing ?? { id: `custom-${slugify(label)}`, label, icon: 'sparkles', custom: true }
    }),
  )
  const [selectedGoal, setSelectedGoal] = useState<GoalOption | null>(
    goalOptions.find((goal) => goal.days === state.profile.goalDays) ?? null,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [completionData, setCompletionData] = useState<CompletionData | null>(null)
  const timersRef = useRef<number[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  const name = (state.profile.name || getPrePurchaseName() || 'voce').trim()
  const canSendMotivations = selectedMotivations.length >= 4
  const canSendTriggers = selectedTriggers.length >= 4

  useEffect(() => {
    queueAppMessage(
      `Oi, ${name}! ${WAVE} Para personalizar sua jornada, me conta: quais sao seus motivos para querer mudar?`,
    )

    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
      timersRef.current = []
      setMessages([])
      setIsTyping(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, currentStep, isTyping])

  function queueAppMessage(text: string, nextStep?: OnboardingStep, onDelivered?: () => void) {
    const typingId = createId('typing')
    setIsTyping(true)
    setMessages((current) => [...current, { id: typingId, role: 'app', kind: 'typing' }])

    const timer = window.setTimeout(() => {
      setMessages((current) =>
        current.map((message) =>
          message.id === typingId
            ? {
                id: createId('app'),
                role: 'app',
                kind: 'text',
                text,
              }
            : message,
        ),
      )
      if (nextStep) {
        setCurrentStep(nextStep)
      }
      setIsTyping(false)
      onDelivered?.()
    }, 1200)

    timersRef.current.push(timer)
  }

  function toggleTag(
    tag: TagOption,
    setter: Dispatch<SetStateAction<TagOption[]>>,
  ) {
    setter((current) =>
      current.some((item) => item.id === tag.id)
        ? current.filter((item) => item.id !== tag.id)
        : [...current, tag],
    )
  }

  function addCustomTag(
    value: string,
    setter: Dispatch<SetStateAction<TagOption[]>>,
    reset: () => void,
  ) {
    const trimmed = value.trim()
    if (!trimmed) return

    const id = `custom-${slugify(trimmed)}`
    setter((current) => {
      if (current.some((item) => item.id === id || item.label.toLowerCase() === trimmed.toLowerCase())) {
        return current
      }

      return [...current, { id, label: trimmed, icon: 'sparkles', custom: true }]
    })
    reset()
  }

  function handleBack() {
    if (currentStep === 'triggers') {
      setMessages((prev) => prev.slice(0, -2))
      setCurrentStep('motivations')
    } else if (currentStep === 'goal') {
      setMessages((prev) => prev.slice(0, -2))
      setCurrentStep('triggers')
    }
  }

  async function handleMotivationsSubmit() {
    if (!canSendMotivations) return

    setMessages((current) => [
      ...current,
      {
        id: createId('user'),
        role: 'user',
        kind: 'text',
        chips: selectedMotivations.map((item) => item.label),
      },
    ])
    queueAppMessage(
      'Entendido! Agora me ajuda a entender: em quais momentos você se sente mais vulnerável?',
      'triggers',
    )
  }

  async function handleTriggersSubmit() {
    if (!canSendTriggers) return

    setMessages((current) => [
      ...current,
      {
        id: createId('user'),
        role: 'user',
        kind: 'text',
        chips: selectedTriggers.map((item) => item.label),
      },
    ])
    queueAppMessage(
      'Perfeito. Qual é sua meta inicial? Escolha o ritmo que faz sentido pra você agora.',
      'goal',
    )
  }

  async function handleGoalSubmit() {
    if (!selectedGoal || isSubmitting) return

    setIsSubmitting(true)
    setSubmitError(null)
    setMessages((current) => [
      ...current,
      {
        id: createId('user'),
        role: 'user',
        kind: 'text',
        chips: [`${selectedGoal.days} dias`, selectedGoal.title],
      },
    ])

    const prePurchaseAge = getPrePurchaseAge()
    const resolvedAge =
      state.profile.age ?? (prePurchaseAge.trim() ? Number(prePurchaseAge) : null)

    try {
      await completeOnboarding({
        name: name || 'Usuario',
        age: resolvedAge,
        goalDays: selectedGoal.days,
        motivations: selectedMotivations.map((item) => item.label),
        triggers: selectedTriggers.map((item) => item.label),
      })

      queueAppMessage(
      `Perfeito. ${OWL} Seu perfil está configurado.`,
      'done',
      () => {
        const timer = window.setTimeout(() => {
          setCompletionData({
            name,
            goalDays: selectedGoal.days,
            goalTitle: selectedGoal.title,
          })
        }, 600)
        timersRef.current.push(timer)
      },
    )
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Nao foi possivel concluir seu onboarding.',
      )
      setMessages((current) => [
        ...current,
        {
          id: createId('app'),
          role: 'app',
          kind: 'text',
          text: 'Nao consegui salvar agora. Tente novamente em instantes.',
        },
      ])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
    <AnimatePresence onExitComplete={() => navigate('/app', { replace: true })}>
      {completionData ? (
        <CompletionOverlay
          key="completion"
          name={completionData.name}
          goalDays={completionData.goalDays}
          goalTitle={completionData.goalTitle}
          onDismiss={() => setCompletionData(null)}
        />
      ) : null}
    </AnimatePresence>
    <AppShell
      title=""
      eyebrow=""
      shellMode="entry"
      hideTopbar
      contentClassName="app-content-onboarding"
    >
      <div className="ob-chat-screen">
        <div className="ob-chat-header">
          <div className="ob-chat-header-row">
            {(currentStep === 'triggers' || currentStep === 'goal') ? (
              <button type="button" className="ob-chat-back" onClick={handleBack}>
                <ArrowLeft size={14} strokeWidth={2.2} />
                Voltar
              </button>
            ) : null}
          </div>
          <h1 className="ob-chat-title">Vamos começar.</h1>
          <p className="ob-chat-subtitle">Personalize sua jornada em poucos passos.</p>
          <ChatProgress step={currentStep} />
        </div>

        <div className="ob-chat-scroll">
          <div className="ob-chat-stack">
            {messages.map((message) =>
              message.kind === 'typing' ? (
                <TypewriterBubble key={message.id} />
              ) : (
                <TextBubble
                  key={message.id}
                  role={message.role}
                  text={message.text}
                  chips={message.chips}
                />
              ),
            )}

            {!isTyping && currentStep === 'motivations' ? (
              <motion.div
                className="ob-chat-composer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <TagsSelector
                  title="Motivacoes"
                  accent="cyan"
                  tags={motivationOptions}
                  selectedTags={selectedMotivations}
                  minimumRequired={4}
                  inputValue={motivationInput}
                  onInputChange={setMotivationInput}
                  onAddCustom={() =>
                    addCustomTag(motivationInput, setSelectedMotivations, () => setMotivationInput(''))
                  }
                  onToggle={(tag) => toggleTag(tag, setSelectedMotivations)}
                />
                <button
                  type="button"
                  className={`button ob-chat-send${canSendMotivations ? ' ob-chat-send--active' : ' ob-chat-send--pending'}`}
                  disabled={!canSendMotivations}
                  onClick={() => void handleMotivationsSubmit()}
                >
                  {canSendMotivations
                    ? <><span>Enviar</span> <ArrowRight size={16} strokeWidth={2.2} /></>
                    : `Selecione mais ${Math.max(0, 4 - selectedMotivations.length)}`
                  }
                </button>
              </motion.div>
            ) : null}

            {!isTyping && currentStep === 'triggers' ? (
              <motion.div
                className="ob-chat-composer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <TagsSelector
                  title="Gatilhos"
                  accent="ember"
                  tags={triggerOptions}
                  selectedTags={selectedTriggers}
                  minimumRequired={4}
                  inputValue={triggerInput}
                  onInputChange={setTriggerInput}
                  onAddCustom={() =>
                    addCustomTag(triggerInput, setSelectedTriggers, () => setTriggerInput(''))
                  }
                  onToggle={(tag) => toggleTag(tag, setSelectedTriggers)}
                  allowCustom={false}
                />
                <button
                  type="button"
                  className={`button ob-chat-send${canSendTriggers ? ' ob-chat-send--active' : ' ob-chat-send--pending'}`}
                  disabled={!canSendTriggers}
                  onClick={() => void handleTriggersSubmit()}
                >
                  {canSendTriggers
                    ? <><span>Enviar</span> <ArrowRight size={16} strokeWidth={2.2} /></>
                    : `Selecione mais ${Math.max(0, 4 - selectedTriggers.length)}`
                  }
                </button>
              </motion.div>
            ) : null}

            {!isTyping && currentStep === 'goal' ? (
              <motion.div
                className="ob-chat-composer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <GoalSelector selectedGoalId={selectedGoal?.id ?? null} onSelect={setSelectedGoal} />
                <button
                  type="button"
                  className={`button ob-chat-send${selectedGoal && !isSubmitting ? ' ob-chat-send--active' : ' ob-chat-send--pending'}`}
                  disabled={!selectedGoal || isSubmitting}
                  onClick={() => void handleGoalSubmit()}
                >
                  {isSubmitting
                    ? 'Salvando...'
                    : selectedGoal
                      ? <><span>Confirmar meta</span> <ArrowRight size={16} strokeWidth={2.2} /></>
                      : 'Escolha uma meta'
                  }
                </button>
                {submitError ? <p className="ob-chat-submit-error" role="alert">{submitError}</p> : null}
              </motion.div>
            ) : null}

            <div ref={bottomRef} />
          </div>
        </div>
      </div>
    </AppShell>
    </>
  )
}
