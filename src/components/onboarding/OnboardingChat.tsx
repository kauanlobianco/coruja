import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  Brain,
  ChevronLeft,
  Compass,
  HeartHandshake,
  MoonStar,
  Plus,
  SendHorizontal,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { getPrePurchaseAge, getPrePurchaseName } from '../../features/pre-purchase/storage'
import {
  CONSEQUENCE_GROUPS,
  MENTAL_TRAPS,
  MOTIVATION_OPTIONS,
  RESPONSE_SUGGESTIONS,
  TRIGGER_GROUPS,
  type ResponseSuggestion,
} from '../../features/sos/sos-setup.data'
import { finalizeResponseDraft } from '../../features/sos/sos-setup.utils'
import type { SosConfiguration } from '../../core/domain/models'
import { FocoBotAvatar } from '../../features/library/components/AiMentorChat'

// ── Types ──────────────────────────────────────────────────────────────────

type IconKey = 'brain' | 'target' | 'heart' | 'moon' | 'sparkles' | 'shield' | 'compass'

type UnifiedStep =
  | 'motivations'
  | 'triggers'
  | 'goal'
  | 'traps'
  | 'response'
  | 'review'
  | 'done'

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

interface TrapSelection {
  id: string
  text: string
  shortLabel: string
}

interface TrapResponse {
  trapId: string
  trapText: string
  text: string
}

interface ChatMessage {
  id: string
  role: 'app' | 'user'
  kind: 'text' | 'typing'
  text?: string
  chips?: string[]
}

// ── Static data ────────────────────────────────────────────────────────────

const iconMap: Record<IconKey, LucideIcon> = {
  brain: Brain,
  target: Target,
  heart: HeartHandshake,
  moon: MoonStar,
  sparkles: Sparkles,
  shield: Shield,
  compass: Compass,
}

const motivationOptions: TagOption[] = MOTIVATION_OPTIONS.map((opt) => ({
  id: opt.id,
  label: opt.label,
  icon: (opt.icon as IconKey) in iconMap ? (opt.icon as IconKey) : 'sparkles',
}))

const goalOptions: GoalOption[] = [
  { id: '5', days: 5, title: 'Ganhar tração', desc: 'Sair do automático com firmeza' },
  { id: '10', days: 10, title: 'Criar consistência', desc: 'Firmar distância e ritmo' },
  { id: '15', days: 15, title: 'Recomeço firme', desc: 'Virar a chave com mais estrutura' },
  { id: '30', days: 30, title: 'Marco maior', desc: 'Um compromisso mais longo' },
]

// ── Progress ───────────────────────────────────────────────────────────────

const PROGRESS_LABELS = ['Motivos', 'Gatilhos', 'Meta', 'Escudo', 'Revisão']

const STEP_INDEX: Record<UnifiedStep, number> = {
  motivations: 0,
  triggers: 1,
  goal: 2,
  traps: 3,
  response: 3,
  review: 4,
  done: 4,
}

// Compact header content for steps 2+
const STEP_COMPACT: Partial<Record<UnifiedStep, { title: string; sub: string }>> = {
  triggers: { title: 'Gatilhos', sub: 'Quando você costuma sentir o impulso?' },
  goal: { title: 'Meta', sub: 'Qual é o ritmo certo pra você?' },
  traps: { title: 'Seu escudo', sub: 'O que seu cérebro usa contra você?' },
  response: { title: 'Seu escudo', sub: 'Escreva a sua resposta.' },
}

function ChatProgress({ step }: { step: UnifiedStep }) {
  const activeIndex = STEP_INDEX[step]
  const cols = `repeat(${PROGRESS_LABELS.length}, minmax(0, 1fr))`

  return (
    <div className="ob-chat-progress" aria-label="Progresso do onboarding">
      <div className="ob-chat-progress-track" style={{ gridTemplateColumns: cols }}>
        {PROGRESS_LABELS.map((_, i) => (
          <div
            key={i}
            className={`ob-chat-progress-segment${i <= activeIndex ? ' is-active' : ''}`}
          />
        ))}
      </div>
      <div className="ob-chat-progress-labels" style={{ gridTemplateColumns: cols }}>
        {PROGRESS_LABELS.map((label, i) => (
          <span key={label} className={i === activeIndex ? 'is-active' : ''}>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Chat bubbles ───────────────────────────────────────────────────────────

function TypewriterBubble() {
  return (
    <motion.div
      className="ob-chat-row ob-chat-row--app"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
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
          {[0, 0.16, 0.32].map((delay, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay }}
            />
          ))}
        </span>
      </motion.div>
    </motion.div>
  )
}

function TextBubble({ role, text, chips }: { role: 'app' | 'user'; text?: string; chips?: string[] }) {
  return (
    <motion.div
      className={`ob-chat-row ob-chat-row--${role}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
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
              <span key={chip} className="ob-chat-bubble-chip">{chip}</span>
            ))}
          </div>
        ) : null}
        {text ? <span>{text}</span> : null}
      </motion.div>
    </motion.div>
  )
}

// ── Tags selector (motivations) ────────────────────────────────────────────

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function TagsSelector({
  title,
  tags,
  selectedTags,
  minimumRequired,
  inputValue,
  onInputChange,
  onAddCustom,
  onToggle,
}: {
  title: string
  tags: TagOption[]
  selectedTags: TagOption[]
  minimumRequired: number
  inputValue: string
  onInputChange: (value: string) => void
  onAddCustom: () => void
  onToggle: (tag: TagOption) => void
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
      <div className="ob-chat-selector-head">
        <h3>{title} — mín. {minimumRequired}</h3>
        <span className={`ob-chat-selected-count${selectedTags.length >= minimumRequired ? ' ob-chat-selected-count--met' : ''}`}>
          {selectedTags.length} selecionadas
        </span>
      </div>

      <div className="ob-chat-tags-selected" ref={selectedContainerRef}>
        {selectedTags.length === 0 ? (
          <span className="ob-chat-selected-placeholder">
            O que importa pra você aparece aqui...
          </span>
        ) : null}
        <AnimatePresence initial={false}>
          {selectedTags.map((tag) => {
            return (
              <motion.div
                key={tag.id}
                className="ob-chat-tag ob-chat-tag--selected ob-chat-tag--cyan"
                initial={{ opacity: 0, scale: 0.82 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.82 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
              >
                <span className="ob-chat-tag-label">{tag.label}</span>
                <button type="button" className="ob-chat-tag-remove" onClick={() => onToggle(tag)} aria-label={`Remover ${tag.label}`}>
                  {'\u00D7'}
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="ob-chat-tags-available">
        {isInputExpanded ? (
          <div className="ob-chat-inline-input-shell">
            <input
              ref={inputRef}
              className="ob-chat-inline-input"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); onAddCustom(); setIsInputExpanded(false) }
                if (e.key === 'Escape') setIsInputExpanded(false)
              }}
              onBlur={() => { if (!inputValue.trim()) setIsInputExpanded(false) }}
              placeholder="Adicionar outro..."
            />
            <button
              type="button"
              className="ob-chat-inline-send"
              aria-label="Confirmar"
              onMouseDown={(e) => e.preventDefault()}
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
        )}
        {availableTags.map((tag) => {
          return (
            <button
              key={tag.id}
              type="button"
              className="ob-chat-tag ob-chat-tag--available"
              onClick={() => onToggle(tag)}
            >
              <span className="ob-chat-tag-label">{tag.label}</span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

// ── Trigger selector (grouped, no icons) ──────────────────────────────────

function TriggerSelector({ selected, onToggle }: {
  selected: string[]
  onToggle: (item: string) => void
}) {
  const stripRef = useRef<HTMLDivElement>(null)
  const selectedSet = new Set(selected)
  const allItems = TRIGGER_GROUPS.flatMap((g) => g.items)
  const MIN_TRIGGERS = 4

  useEffect(() => {
    if (!stripRef.current) return
    stripRef.current.scrollTo({ left: stripRef.current.scrollWidth, behavior: 'smooth' })
  }, [selected])

  return (
    <motion.div
      className="ob-chat-selector ss-consequence-selector"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="ob-chat-selector-head">
        <h3>Seus gatilhos — mín. {MIN_TRIGGERS}</h3>
        <span className={`ob-chat-selected-count${selected.length >= MIN_TRIGGERS ? ' ob-chat-selected-count--met' : ''}`}>
          {selected.length} selecionados
        </span>
      </div>

      <div className="ob-chat-tags-selected ss-consequence-selected" ref={stripRef}>
        {selected.length === 0 ? (
          <span className="ob-chat-selected-placeholder">
            Suas situações aparecem aqui...
          </span>
        ) : null}
        <AnimatePresence initial={false}>
          {selected.map((item) => (
            <motion.div
              key={item}
              className="ob-chat-tag ob-chat-tag--selected ss-consequence-tag-selected"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.82 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              <span className="ob-chat-tag-label">{item}</span>
              <button type="button" className="ob-chat-tag-remove" onClick={() => onToggle(item)} aria-label={`Remover ${item}`}>
                {'\u00D7'}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="ss-consequence-groups">
        <div className="ss-consequence-group-items">
          {allItems
            .filter((item) => !selectedSet.has(item))
            .map((item) => (
              <button
                key={item}
                type="button"
                className="ob-chat-tag ob-chat-tag--available ss-consequence-tag"
                onClick={() => onToggle(item)}
              >
                <span className="ob-chat-tag-label">{item}</span>
              </button>
            ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Goal selector ──────────────────────────────────────────────────────────

function GoalSelector({ selectedGoalId, onSelect }: {
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
        {goalOptions.map((goal) => (
          <motion.button
            key={goal.id}
            type="button"
            className={`ob-chat-goal-card${selectedGoalId === goal.id ? ' ob-chat-goal-card--selected' : ''}`}
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
        ))}
      </div>
    </motion.div>
  )
}

// ── Trap selector ──────────────────────────────────────────────────────────

function TrapSelector({ selected, onToggle }: {
  selected: TrapSelection[]
  onToggle: (trap: TrapSelection) => void
}) {
  const stripRef = useRef<HTMLDivElement>(null)
  const selectedIds = new Set(selected.map((t) => t.id))
  const available = MENTAL_TRAPS.filter((t) => !selectedIds.has(t.id))
  const MIN_TRAPS = 2

  useEffect(() => {
    if (!stripRef.current) return
    stripRef.current.scrollTo({ left: stripRef.current.scrollWidth, behavior: 'smooth' })
  }, [selected])

  return (
    <motion.div
      className="ob-chat-selector"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      <div className="ob-chat-selector-head">
        <h3>Armadilhas — mín. {MIN_TRAPS}</h3>
        <span className={`ob-chat-selected-count${selected.length >= MIN_TRAPS ? ' ob-chat-selected-count--met' : ''}`}>
          {selected.length} selecionadas
        </span>
      </div>

      <div className="ob-chat-tags-selected" ref={stripRef}>
        {selected.length === 0 ? (
          <span className="ob-chat-selected-placeholder">
            Suas armadilhas aparecem aqui...
          </span>
        ) : null}
        <AnimatePresence initial={false}>
          {selected.map((trap) => (
            <motion.div
              key={trap.id}
              className="ob-chat-tag ob-chat-tag--selected ob-chat-tag--cyan"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.82 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              <span className="ob-chat-tag-label">{trap.shortLabel}</span>
              <button type="button" className="ob-chat-tag-remove" onClick={() => onToggle(trap)} aria-label={`Remover ${trap.shortLabel}`}>
                {'\u00D7'}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="ob-chat-tags-available">
        {available.map((trap) => (
          <button
            key={trap.id}
            type="button"
            className="ob-chat-tag ob-chat-tag--available"
            onClick={() => onToggle({ id: trap.id, text: trap.text, shortLabel: trap.shortLabel })}
          >
            <span className="ob-chat-tag-label">{trap.shortLabel}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ── Response composer ──────────────────────────────────────────────────────

function ResponseComposer({ trap, trapIndex, trapTotal, onSubmit }: {
  trap: TrapSelection
  trapIndex: number
  trapTotal: number
  onSubmit: (text: string) => void
}) {
  const suggestions = RESPONSE_SUGGESTIONS[trap.id] ?? []
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [draft, setDraft] = useState('')
  const [pickedSuggestion, setPickedSuggestion] = useState<ResponseSuggestion | null>(null)

  function handlePickSuggestion(suggestion: ResponseSuggestion) {
    setPickedSuggestion(suggestion)
    setDraft(suggestion.draftText)
    window.requestAnimationFrame(() => {
      if (!inputRef.current) return
      inputRef.current.focus()
      const end = suggestion.draftText.length
      inputRef.current.setSelectionRange(end, end)
    })
  }

  function handleSubmit() {
    const finalText = finalizeResponseDraft(draft)
    if (!finalText) return
    onSubmit(finalText)
  }

  return (
    <motion.div
      className="ob-chat-selector ob-chat-response-composer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      <div className="ob-chat-selector-head">
        <h3>O que você se diz quando isso aparece?</h3>
        <span className="ss-response-trap-count">{trapIndex + 1} de {trapTotal}</span>
      </div>

      <div className="ss-response-context">
        <span className="ss-response-context-label">Armadilha</span>
        <div className="ss-response-trap-quote">"{trap.text}"</div>
      </div>

      <div className="ob-chat-response-body">
        <span className="ss-response-edit-helper">Sugestões:</span>

        <div className="ss-response-suggestions" aria-label="Sugestões de resposta">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.shortText}
              type="button"
              className={`ss-response-suggestion${pickedSuggestion?.shortText === suggestion.shortText ? ' is-selected' : ''}`}
              onClick={() => handlePickSuggestion(suggestion)}
            >
              <span className="ss-response-suggestion-text">{suggestion.shortText}</span>
            </button>
          ))}
        </div>

        {pickedSuggestion ? (
          <span className="ss-response-draft-note">Sugestão aplicada. Ajuste como quiser.</span>
        ) : null}

        <textarea
          ref={inputRef}
          className="ss-response-textarea"
          placeholder="Escreva sua resposta para esse momento."
          value={draft}
          rows={3}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
          }}
        />

        <button
          type="button"
          className={`button ob-chat-send${draft.trim() ? ' ob-chat-send--active' : ' ob-chat-send--pending'}`}
          disabled={!draft.trim()}
          onClick={handleSubmit}
        >
          <span>Salvar e continuar</span>
          <SendHorizontal size={14} strokeWidth={2} />
        </button>
      </div>
    </motion.div>
  )
}

// ── Unified shield review ──────────────────────────────────────────────────

function UnifiedShieldReview({
  motivations,
  triggers,
  goal,
  traps,
  responses,
  isSubmitting,
  onConfirm,
  onEdit,
}: {
  motivations: TagOption[]
  triggers: string[]
  goal: GoalOption
  traps: TrapSelection[]
  responses: TrapResponse[]
  isSubmitting: boolean
  onConfirm: () => void
  onEdit: () => void
}) {
  return (
    <motion.div
      className="ss-review"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="ss-review-header">
        <button type="button" className="ss-review-back" onClick={onEdit} aria-label="Editar">
          <ChevronLeft size={18} strokeWidth={2.2} />
          Editar
        </button>
        <div className="ss-review-title-wrap">
          <ShieldCheck size={22} className="ss-review-icon" />
          <h2 className="ss-review-title">Seu plano está pronto</h2>
        </div>
        <p className="ss-review-subtitle">Revise antes de ativar.</p>
      </div>

      <div className="ss-review-body">
        <div className="ss-review-section">
          <span className="ss-review-section-label">Por que você está aqui</span>
          <div className="ss-review-trap-chips">
            {motivations.slice(0, 3).map((m) => (
              <span key={m.id} className="ss-review-trap-chip">{m.label}</span>
            ))}
          </div>
        </div>

        <div className="ss-review-section">
          <span className="ss-review-section-label">Quando você fica em risco</span>
          <div className="ss-review-trap-chips">
            {triggers.slice(0, 4).map((t) => (
              <span key={t} className="ss-review-trap-chip">{t}</span>
            ))}
          </div>
        </div>

        <div className="ss-review-section">
          <span className="ss-review-section-label">Seu compromisso</span>
          <div className="ss-review-trap-chips">
            <span className="ss-review-trap-chip">{goal.days} dias — {goal.title}</span>
          </div>
        </div>

        {responses.length > 0 && (
          <div className="ss-review-section">
            <span className="ss-review-section-label">Armadilhas e respostas</span>
            <div className="ss-review-responses">
              {responses.map((r) => (
                <div key={r.trapId} className="ss-review-response-item">
                  <span className="ss-review-response-trap">{r.trapText}</span>
                  <p className="ss-review-response-text">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <div className="ss-review-footer">
        <button
          type="button"
          className="button ss-review-confirm-btn"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : (
            <>Ativar meu escudo <SendHorizontal size={14} strokeWidth={2} /></>
          )}
        </button>
      </div>
    </motion.div>
  )
}

// ── Done overlay ───────────────────────────────────────────────────────────

function DoneOverlay({ goalDays, onDismiss }: { goalDays: number; onDismiss: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDismiss, 3000)
    return () => window.clearTimeout(t)
  }, [onDismiss])

  return (
    <motion.div
      className="ss-done-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="ss-done-content">
        <motion.div
          className="ss-done-orb"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.1 }}
        >
          <ShieldCheck size={40} strokeWidth={1.6} />
        </motion.div>

        <motion.h1
          className="ss-done-title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: 'easeOut', delay: 0.28 }}
        >
          Escudo ativado.
        </motion.h1>

        <motion.span
          className="ss-done-chip"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.44 }}
        >
          {goalDays} dias pela frente
        </motion.span>

        <motion.p
          className="ss-done-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.62 }}
        >
          Você saiu daqui preparado. Agora é um dia de cada vez.
        </motion.p>
      </div>
    </motion.div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function OnboardingChat() {
  const navigate = useNavigate()
  const { state, completeOnboarding, saveSosConfiguration } = useAppState()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [step, setStep] = useState<UnifiedStep>('motivations')
  const [isTyping, setIsTyping] = useState(false)

  // Motivations state
  const [selectedMotivations, setSelectedMotivations] = useState<TagOption[]>(
    (state.profile.motivations ?? []).map((label) => {
      const existing = motivationOptions.find((o) => o.label === label)
      return existing ?? { id: `custom-${slugify(label)}`, label, icon: 'sparkles' as IconKey, custom: true }
    }),
  )
  const [motivationInput, setMotivationInput] = useState('')

  // Triggers state
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(state.profile.triggers ?? [])

  // Goal state
  const [selectedGoal, setSelectedGoal] = useState<GoalOption | null>(
    goalOptions.find((g) => g.days === state.profile.goalDays) ?? null,
  )

  // Traps state
  const [selectedTraps, setSelectedTraps] = useState<TrapSelection[]>([])

  // Responses state
  const [trapResponses, setTrapResponses] = useState<TrapResponse[]>([])
  const [currentTrapIndex, setCurrentTrapIndex] = useState(0)

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDone, setShowDone] = useState(false)
  // Prevents the current selector from re-appearing between two chained bot messages
  const [transitioning, setTransitioning] = useState(false)

  const timersRef = useRef<number[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const latestAppMsgRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const name = (state.profile.name || getPrePurchaseName() || 'você').trim()

  const canSendMotivations = selectedMotivations.length >= 4
  const canSendTriggers = selectedTriggers.length >= 4
  const canSendTraps = selectedTraps.length >= 2

  const queueBotMessage = useCallback((text: string, nextStep?: UnifiedStep, onDelivered?: () => void) => {
    const typingId = createId('typing')
    setIsTyping(true)
    setMessages((c) => [...c, { id: typingId, role: 'app', kind: 'typing' }])

    const timer = window.setTimeout(() => {
      setMessages((c) =>
        c.map((msg) =>
          msg.id === typingId ? { id: createId('app'), role: 'app', kind: 'text', text } : msg,
        ),
      )
      if (nextStep) {
        setStep(nextStep)
        setTransitioning(false)
      }
      setIsTyping(false)
      onDelivered?.()
    }, 1100)

    timersRef.current.push(timer)
  }, [])

  useEffect(() => {
    setMessages([])
    queueBotMessage(
      `Oi, ${name}. Vamos montar o seu plano agora. Me conta: o que você quer proteger com essa mudança?`,
    )
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t))
      timersRef.current = []
      setMessages((prev) => prev.filter((m) => m.kind !== 'typing'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reset the transitioning lock whenever the step or the active trap index changes.
  // This covers: step changes triggered via setStep() in onDelivered callbacks,
  // and the intermediate-trap case where step stays 'response' but currentTrapIndex advances.
  useEffect(() => {
    setTransitioning(false)
  }, [step, currentTrapIndex])

  useEffect(() => {
    if (isTyping) return

    if (step === 'response' && scrollRef.current && latestAppMsgRef.current) {
      window.requestAnimationFrame(() => {
        if (!scrollRef.current || !latestAppMsgRef.current) return
        const targetTop = Math.max(0, latestAppMsgRef.current.offsetTop - 12)
        scrollRef.current.scrollTo({ top: targetTop, behavior: 'auto' })
      })
      return
    }

    if (latestAppMsgRef.current) {
      latestAppMsgRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, step, isTyping])

  function addCustomMotivation() {
    const trimmed = motivationInput.trim()
    if (!trimmed) return
    const id = `custom-${slugify(trimmed)}`
    setSelectedMotivations((c) => {
      if (c.some((item) => item.id === id || item.label.toLowerCase() === trimmed.toLowerCase())) return c
      return [...c, { id, label: trimmed, icon: 'sparkles' as IconKey, custom: true }]
    })
    setMotivationInput('')
  }

  function toggleMotivation(tag: TagOption) {
    setSelectedMotivations((c) =>
      c.some((item) => item.id === tag.id) ? c.filter((item) => item.id !== tag.id) : [...c, tag],
    )
  }

  function toggleTrigger(item: string) {
    setSelectedTriggers((c) => c.includes(item) ? c.filter((x) => x !== item) : [...c, item])
  }

  function toggleTrap(trap: TrapSelection) {
    setSelectedTraps((c) =>
      c.some((t) => t.id === trap.id) ? c.filter((t) => t.id !== trap.id) : [...c, trap],
    )
  }


  function handleBack() {
    if (step === 'triggers') {
      setMessages((p) => p.slice(0, -2))
      setStep('motivations')
    } else if (step === 'goal') {
      setMessages((p) => p.slice(0, -2))
      setStep('triggers')
    } else if (step === 'traps') {
      setMessages((p) => p.slice(0, -2))
      setStep('goal')
    } else if (step === 'response' && currentTrapIndex === 0) {
      setMessages((p) => p.slice(0, -2))
      setTrapResponses([])
      setCurrentTrapIndex(0)
      setStep('traps')
    }
  }

  function handleMotivationsSubmit() {
    if (!canSendMotivations) return
    setTransitioning(true)
    setMessages((c) => [...c, { id: createId('user'), role: 'user', kind: 'text', chips: selectedMotivations.map((m) => m.label) }])
    queueBotMessage('Isso vai te ancorar depois.', undefined, () => {
      const t = window.setTimeout(() => {
        queueBotMessage('Me conta quando você fica mais exposto. Em quais situações ou estados o impulso costuma aparecer?', 'triggers')
      }, 400)
      timersRef.current.push(t)
    })
  }

  function handleTriggersSubmit() {
    if (!canSendTriggers) return
    setTransitioning(true)
    setMessages((c) => [...c, { id: createId('user'), role: 'user', kind: 'text', chips: selectedTriggers }])
    queueBotMessage('Anotado. Saber quando você está vulnerável já é metade da proteção.', undefined, () => {
      const t = window.setTimeout(() => {
        queueBotMessage('Agora escolha o seu ponto de partida. Quanto tempo você quer ir sem ceder?', 'goal')
      }, 400)
      timersRef.current.push(t)
    })
  }

  function handleGoalSubmit() {
    if (!selectedGoal) return
    setTransitioning(true)
    setMessages((c) => [...c, { id: createId('user'), role: 'user', kind: 'text', chips: [`${selectedGoal.days} dias`, selectedGoal.title] }])
    queueBotMessage(`${selectedGoal.days} dias. Meta registrada.`, undefined, () => {
      const t = window.setTimeout(() => {
        queueBotMessage('O cérebro tem jeito próprio de te convencer a ceder. Essas são as falas mais comuns. Quais você já usou com você mesmo?', 'traps')
      }, 400)
      timersRef.current.push(t)
    })
  }

  function handleTrapsSubmit() {
    if (!canSendTraps) return
    setTransitioning(true)
    const firstTrap = selectedTraps[0]
    setMessages((c) => [...c, { id: createId('user'), role: 'user', kind: 'text', chips: selectedTraps.map((t) => t.shortLabel) }])
    queueBotMessage('Reconhecer a armadilha já tira parte da força dela.', undefined, () => {
      const t = window.setTimeout(() => {
        queueBotMessage(`Agora você vai escrever a sua resposta para cada uma. A frase que te traz de volta no momento de crise. Começando com "${firstTrap.text}".`, 'response')
      }, 400)
      timersRef.current.push(t)
    })
  }

  function handleResponseSubmit(text: string) {
    setTransitioning(true)
    const trap = selectedTraps[currentTrapIndex]
    const newResponse: TrapResponse = { trapId: trap.id, trapText: trap.text, text }
    const updated = [...trapResponses, newResponse]
    setTrapResponses(updated)

    const truncated = text.length > 90 ? `${text.slice(0, 90)}…` : text
    setMessages((c) => [...c, { id: createId('user'), role: 'user', kind: 'text', text: truncated }])

    const nextIndex = currentTrapIndex + 1
    if (nextIndex < selectedTraps.length) {
      setCurrentTrapIndex(nextIndex)
      const nextTrap = selectedTraps[nextIndex]
      queueBotMessage(`Salvo. Agora escreva para "${nextTrap.text}".`)
    } else {
      queueBotMessage(
        'Plano completo. Revise antes de ativar.',
        undefined,
        () => {
          const t = window.setTimeout(() => setStep('review'), 400)
          timersRef.current.push(t)
        },
      )
    }
  }

  async function handleConfirmReview() {
    setIsSubmitting(true)
    const prePurchaseAge = getPrePurchaseAge()
    const resolvedAge = state.profile.age ?? (prePurchaseAge.trim() ? Number(prePurchaseAge) : null)

    try {
      await completeOnboarding({
        name: name || 'Usuário',
        age: resolvedAge,
        goalDays: selectedGoal!.days,
        motivations: selectedMotivations.map((m) => m.label),
        triggers: selectedTriggers,
      })

      const config: SosConfiguration = {
        traps: trapResponses.map((r) => ({ id: r.trapId, text: r.trapText, responseText: r.text })),
        consequences: [],
        configuredAt: new Date().toISOString(),
      }
      await saveSosConfiguration(config)

      setShowDone(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEditFromReview() {
    setMessages([])
    setSelectedTraps([])
    setTrapResponses([])
    setCurrentTrapIndex(0)
    setStep('traps')
    queueBotMessage('O cérebro tem jeito próprio de te convencer a ceder. Essas são as falas mais comuns. Quais você já usou com você mesmo?', 'traps')
  }

  const canGoBack = !isTyping && !transitioning && (
    step === 'triggers' ||
    step === 'goal' ||
    step === 'traps' ||
    (step === 'response' && currentTrapIndex === 0)
  )

  const currentTrap = step === 'response' ? selectedTraps[currentTrapIndex] : null

  // Review screen — full-screen, no chat
  if (step === 'review') {
    return (
      <>
        <AnimatePresence onExitComplete={() => navigate('/app', { replace: true })}>
          {showDone ? (
            <DoneOverlay
              key="done"
              goalDays={selectedGoal?.days ?? 7}
              onDismiss={() => setShowDone(false)}
            />
          ) : null}
        </AnimatePresence>
        <div className="ss-setup-screen ss-review-screen">
          <UnifiedShieldReview
            motivations={selectedMotivations}
            triggers={selectedTriggers}
            goal={selectedGoal!}
            traps={selectedTraps}
            responses={trapResponses}
            isSubmitting={isSubmitting}
            onConfirm={() => void handleConfirmReview()}
            onEdit={handleEditFromReview}
          />
        </div>
      </>
    )
  }

  return (
    <>
      <AnimatePresence onExitComplete={() => navigate('/app', { replace: true })}>
        {showDone ? (
          <DoneOverlay
            key="done"
            goalDays={selectedGoal?.days ?? 7}
            onDismiss={() => setShowDone(false)}
          />
        ) : null}
      </AnimatePresence>

      <AppShell title="" eyebrow="" shellMode="entry" hideTopbar contentClassName="app-content-onboarding">
        <div className="ob-chat-screen ss-setup-screen">
          <div className={`ob-chat-header${step !== 'motivations' ? ' ob-chat-header--compact' : ''}`}>
            {step === 'motivations' ? (
              <>
                <h1 className="ob-chat-title">Vamos montar seu plano.</h1>
                <p className="ob-chat-subtitle">Em poucos passos, você sai daqui protegido.</p>
              </>
            ) : (
              <div className="ob-chat-header-title-row">
                {canGoBack ? (
                  <button type="button" className="ob-chat-back" onClick={handleBack} aria-label="Voltar">
                    <ArrowLeft size={14} strokeWidth={2.5} />
                  </button>
                ) : <span className="ob-chat-back-placeholder" />}
                <div className="ob-chat-header-text">
                  <h1 className="ob-chat-title ob-chat-title--compact">
                    {STEP_COMPACT[step]?.title ?? ''}
                  </h1>
                  <p className="ob-chat-subtitle">{STEP_COMPACT[step]?.sub ?? ''}</p>
                </div>
              </div>
            )}
            <ChatProgress step={step} />
          </div>

          <div className="ob-chat-scroll" ref={scrollRef}>
            <div className="ob-chat-stack">
              {messages.map((msg, index) => {
                const lastAppTextIndex = messages.reduce(
                  (found, m, i) => (m.role === 'app' && m.kind === 'text' ? i : found),
                  -1,
                )
                const isLatestApp = index === lastAppTextIndex

                return (
                  <div key={msg.id} ref={isLatestApp ? latestAppMsgRef : undefined}>
                    {msg.kind === 'typing'
                      ? <TypewriterBubble />
                      : <TextBubble role={msg.role} text={msg.text} chips={msg.chips} />}
                  </div>
                )
              })}

              {/* Motivations step */}
              {!isTyping && !transitioning && step === 'motivations' ? (
                <motion.div className="ob-chat-composer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
                  <TagsSelector
                    title="Seus motivos"
                    tags={motivationOptions}
                    selectedTags={selectedMotivations}
                    minimumRequired={4}
                    inputValue={motivationInput}
                    onInputChange={setMotivationInput}
                    onAddCustom={addCustomMotivation}
                    onToggle={toggleMotivation}
                  />
                  <button
                    type="button"
                    className={`button ob-chat-send${canSendMotivations ? ' ob-chat-send--active' : ' ob-chat-send--pending'}`}
                    disabled={!canSendMotivations}
                    onClick={handleMotivationsSubmit}
                  >
                    {canSendMotivations
                      ? <><span>Continuar</span><SendHorizontal size={14} strokeWidth={2} /></>
                      : `Selecione mais ${Math.max(0, 4 - selectedMotivations.length)}`}
                  </button>
                </motion.div>
              ) : null}

              {/* Triggers step */}
              {!isTyping && !transitioning && step === 'triggers' ? (
                <motion.div className="ob-chat-composer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
                  <TriggerSelector selected={selectedTriggers} onToggle={toggleTrigger} />
                  <button
                    type="button"
                    className={`button ob-chat-send${canSendTriggers ? ' ob-chat-send--active' : ' ob-chat-send--pending'}`}
                    disabled={!canSendTriggers}
                    onClick={handleTriggersSubmit}
                  >
                    {canSendTriggers
                      ? <><span>Continuar</span><SendHorizontal size={14} strokeWidth={2} /></>
                      : `Selecione mais ${Math.max(0, 4 - selectedTriggers.length)}`}
                  </button>
                </motion.div>
              ) : null}

              {/* Goal step */}
              {!isTyping && !transitioning && step === 'goal' ? (
                <motion.div className="ob-chat-composer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
                  <GoalSelector selectedGoalId={selectedGoal?.id ?? null} onSelect={setSelectedGoal} />
                  <button
                    type="button"
                    className={`button ob-chat-send${selectedGoal ? ' ob-chat-send--active' : ' ob-chat-send--pending'}`}
                    disabled={!selectedGoal}
                    onClick={handleGoalSubmit}
                  >
                    {selectedGoal
                      ? <><span>Confirmar meta</span><SendHorizontal size={14} strokeWidth={2} /></>
                      : 'Escolha uma meta'}
                  </button>
                </motion.div>
              ) : null}

              {/* Traps step */}
              {!isTyping && !transitioning && step === 'traps' ? (
                <motion.div className="ob-chat-composer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
                  <TrapSelector selected={selectedTraps} onToggle={toggleTrap} />
                  <button
                    type="button"
                    className={`button ob-chat-send${canSendTraps ? ' ob-chat-send--active' : ' ob-chat-send--pending'}`}
                    disabled={!canSendTraps}
                    onClick={handleTrapsSubmit}
                  >
                    {canSendTraps
                      ? <><span>Continuar</span><SendHorizontal size={14} strokeWidth={2} /></>
                      : `Selecione mais ${Math.max(0, 2 - selectedTraps.length)}`}
                  </button>
                </motion.div>
              ) : null}

              {/* Response composer */}
              {!isTyping && !transitioning && step === 'response' && currentTrap ? (
                <ResponseComposer
                  key={currentTrap.id}
                  trap={currentTrap}
                  trapIndex={currentTrapIndex}
                  trapTotal={selectedTraps.length}
                  onSubmit={handleResponseSubmit}
                />
              ) : null}

              <div ref={bottomRef} />
            </div>
          </div>
        </div>
      </AppShell>
    </>
  )
}
