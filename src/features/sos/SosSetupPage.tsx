import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronLeft, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../app/state/use-app-state'
import { appRoutes } from '../../core/config/routes'
import type { SosConfiguration } from '../../core/domain/models'
import {
  CONSEQUENCE_GROUPS,
  MENTAL_TRAPS,
  RESPONSE_SUGGESTIONS,
  type ResponseSuggestion,
} from './sos-setup.data'
import { finalizeResponseDraft } from './sos-setup.utils'
import { FocoBotAvatar } from '../library/components/AiMentorChat'

// ── Types ──────────────────────────────────────────────────────────────────

type ChatStep = 'traps' | 'consequences' | 'response' | 'review' | 'done'

interface ChatMessage {
  id: string
  role: 'app' | 'user'
  kind: 'text' | 'typing'
  text?: string
  chips?: string[]
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

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// ── Progress ───────────────────────────────────────────────────────────────

const PROGRESS_LABELS = ['Armadilhas', 'O custo', 'Respostas']

function ChatProgress({ step }: { step: ChatStep }) {
  const activeIndex = step === 'traps' ? 0 : step === 'consequences' ? 1 : 2
  return (
    <div className="ob-chat-progress" aria-label="Progresso">
      <div className="ob-chat-progress-track">
        {PROGRESS_LABELS.map((_, i) => (
          <div key={i} className={`ob-chat-progress-segment${i <= activeIndex ? ' is-active' : ''}`} />
        ))}
      </div>
      <div className="ob-chat-progress-labels">
        {PROGRESS_LABELS.map((label, i) => (
          <span key={label} className={i === activeIndex ? 'is-active' : ''}>{label}</span>
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
      <div className="ob-chat-avatar" aria-hidden="true"><FocoBotAvatar /></div>
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
      {role === 'app' ? <div className="ob-chat-avatar" aria-hidden="true"><FocoBotAvatar /></div> : null}
      <motion.div
        className={`ob-chat-bubble ob-chat-bubble--${role}`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24, mass: 0.8 }}
      >
        {chips && chips.length > 0 ? (
          <div className="ob-chat-bubble-chips">
            {chips.map((chip) => <span key={chip} className="ob-chat-bubble-chip">{chip}</span>)}
          </div>
        ) : null}
        {text ? <span>{text}</span> : null}
      </motion.div>
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
        <h3>Quais pensamentos costumam abrir a porta?</h3>
        <span className={`ob-chat-selected-count${selected.length >= 1 ? ' ob-chat-selected-count--met' : ''}`}>
          {selected.length} selecionadas
        </span>
      </div>

      <motion.div className="ob-chat-tags-selected" ref={stripRef} layout>
        <AnimatePresence initial={false}>
          {selected.length === 0 ? (
            <motion.span className="ob-chat-selected-placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Suas armadilhas aparecem aqui...
            </motion.span>
          ) : null}
          {selected.map((trap) => (
            <motion.div key={trap.id} className="ob-chat-tag ob-chat-tag--selected ob-chat-tag--cyan" layoutId={`sos-trap-${trap.id}`}>
              <motion.span layoutId={`sos-trap-label-${trap.id}`} className="ob-chat-tag-label">{trap.shortLabel}</motion.span>
              <button type="button" className="ob-chat-tag-remove" onClick={() => onToggle(trap)} aria-label={`Remover ${trap.shortLabel}`}>{'\u00D7'}</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.div className="ob-chat-tags-available" layout>
        {available.map((trap) => (
          <motion.button
            key={trap.id}
            type="button"
            className="ob-chat-tag ob-chat-tag--available"
            layoutId={`sos-trap-${trap.id}`}
            onClick={() => onToggle({ id: trap.id, text: trap.text, shortLabel: trap.shortLabel })}
          >
            <motion.span layoutId={`sos-trap-label-${trap.id}`} className="ob-chat-tag-label">{trap.shortLabel}</motion.span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  )
}

// ── Consequence selector — grouped ─────────────────────────────────────────

function ConsequenceSelector({ selected, onToggle }: {
  selected: string[]
  onToggle: (item: string) => void
}) {
  const stripRef = useRef<HTMLDivElement>(null)
  const selectedSet = new Set(selected)

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
        <h3>O que esse impulso te custa depois?</h3>
        <span className={`ob-chat-selected-count${selected.length >= 1 ? ' ob-chat-selected-count--met' : ''}`}>
          {selected.length} selecionadas
        </span>
      </div>

      <motion.div className="ob-chat-tags-selected ss-consequence-selected" ref={stripRef} layout>
        <AnimatePresence initial={false}>
          {selected.length === 0 ? (
            <motion.span className="ob-chat-selected-placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              As consequências que mais pesam aparecem aqui...
            </motion.span>
          ) : null}
          {selected.map((item) => (
            <motion.div key={item} className="ob-chat-tag ob-chat-tag--selected ss-consequence-tag-selected" layout>
              <span className="ob-chat-tag-label">{item}</span>
              <button
                type="button"
                className="ob-chat-tag-remove"
                onClick={() => onToggle(item)}
                aria-label={`Remover ${item}`}
              >
                {'\u00D7'}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="ss-consequence-groups">
        <div className="ss-consequence-group-items">
          {CONSEQUENCE_GROUPS.flatMap((group) => group.items)
            .filter((item) => !selectedSet.has(item))
            .map((item) => (
              <motion.button
                key={item}
                type="button"
                className="ob-chat-tag ob-chat-tag--available ss-consequence-tag"
                onClick={() => onToggle(item)}
                layout
              >
                <span className="ob-chat-tag-label">{item}</span>
              </motion.button>
            ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Response composer — tone labels + optional personalisation ─────────────


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
      className="ob-chat-selector ss-response-composer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
    >
      <div className="ob-chat-selector-head">
        <h3>Escreva o que vai te trazer de volta para o controle.</h3>
        <span className="ss-response-trap-count">{trapIndex + 1} de {trapTotal}</span>
      </div>

      <div className="ss-response-context">
        <span className="ss-response-context-label">Armadilha</span>
        <div className="ss-response-trap-quote">"{trap.text}"</div>
      </div>

      <div className="ss-response-footer">
        <div className="ss-response-footer-head">
          <span className="ss-response-edit-helper">Sugestões:</span>
        </div>

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
          <div className="ss-response-draft-state">
            <span className="ss-response-draft-note">Sugestão aplicada. Ajuste como quiser antes de salvar.</span>
          </div>
        ) : null}

        <textarea
          ref={inputRef}
          className="ss-response-textarea"
          placeholder="Escreva aqui a frase que vai te trazer de volta para o controle."
          value={draft}
          rows={4}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSubmit()
            }
          }}
        />

        <button
          type="button"
          className={`button ob-chat-send${draft.trim() ? ' ob-chat-send--active' : ' ob-chat-send--pending'}`}
          disabled={!draft.trim()}
          onClick={handleSubmit}
        >
          <span>Salvar e continuar</span>
          <ArrowRight size={16} strokeWidth={2.2} />
        </button>
      </div>
    </motion.div>
  )
}

// Shield review ──────────────────────────────────────────────────────────

function ShieldReview({ traps, responses, consequences, onConfirm, onEdit }: {
  traps: TrapSelection[]
  responses: TrapResponse[]
  consequences: string[]
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
          <h2 className="ss-review-title">Seu escudo está pronto</h2>
        </div>
        <p className="ss-review-subtitle">Revise antes de ativar.</p>
      </div>

      <div className="ss-review-body">
        <div className="ss-review-section">
          <span className="ss-review-section-label">Quando sua mente disser</span>
          <div className="ss-review-trap-chips">
            {traps.map((trap) => (
              <span key={trap.id} className="ss-review-trap-chip">{trap.text}</span>
            ))}
          </div>
        </div>

        <div className="ss-review-section">
          <span className="ss-review-section-label">Você vai lembrar</span>
          <div className="ss-review-responses">
            {responses.map((r) => (
              <div key={r.trapId} className="ss-review-response-item">
                <span className="ss-review-response-trap">{r.trapText}</span>
                <p className="ss-review-response-text">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {consequences.length > 0 && (
          <div className="ss-review-section">
            <span className="ss-review-section-label">O que está em jogo</span>
            <div className="ss-review-consequence-chips">
              {consequences.map((c) => (
                <span key={c} className="ss-review-consequence-chip">{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="ss-review-footer">
        <button type="button" className="button ss-review-confirm-btn" onClick={onConfirm}>
          Ativar meu SOS
          <ArrowRight size={16} strokeWidth={2.2} />
        </button>
      </div>
    </motion.div>
  )
}

// ── Done overlay ───────────────────────────────────────────────────────────

function DoneOverlay({ count, onDismiss }: { count: number; onDismiss: () => void }) {
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
          Defesa pronta.
        </motion.h1>

        <motion.span
          className="ss-done-chip"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.44 }}
        >
          {count} resposta{count !== 1 ? 's' : ''} ativas
        </motion.span>

        <motion.p
          className="ss-done-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.62 }}
        >
          Quando a fissura vier, você não vai depender do impulso. Já tem o que precisa.
        </motion.p>
      </div>
    </motion.div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export function SosSetupPage() {
  const navigate = useNavigate()
  const { saveSosConfiguration } = useAppState()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [step, setStep] = useState<ChatStep>('traps')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedTraps, setSelectedTraps] = useState<TrapSelection[]>([])
  const [selectedConsequences, setSelectedConsequences] = useState<string[]>([])
  const [trapResponses, setTrapResponses] = useState<TrapResponse[]>([])
  const [currentTrapIndex, setCurrentTrapIndex] = useState(0)
  const [showDone, setShowDone] = useState(false)

  const timersRef = useRef<number[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const latestAppMessageRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const queueBotMessage = useCallback((text: string, nextStep?: ChatStep, onDelivered?: () => void) => {
    const typingId = createId('typing')
    setIsTyping(true)
    setMessages((current) => [...current, { id: typingId, role: 'app', kind: 'typing' }])

    const timeoutId = window.setTimeout(() => {
      setMessages((current) =>
        current.map((message) =>
          message.id === typingId ? { id: createId('app'), role: 'app', kind: 'text', text } : message,
        ),
      )
      if (nextStep) setStep(nextStep)
      setIsTyping(false)
      onDelivered?.()
    }, 1100)

    timersRef.current.push(timeoutId)
  }, [])

  useEffect(() => {
    const introTimer = window.setTimeout(() => {
      queueBotMessage('Vamos identificar os pensamentos que costumam aparecer quando a vontade vem forte. Escolha as frases que mais combinam com o que passa na sua cabeça nesse momento.')
    }, 0)
    timersRef.current.push(introTimer)

    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t))
      timersRef.current = []
    }
  }, [queueBotMessage])

  useEffect(() => {
    if (isTyping) {
      return
    }

    if (step === 'response' && scrollRef.current && latestAppMessageRef.current) {
      window.requestAnimationFrame(() => {
        if (!scrollRef.current || !latestAppMessageRef.current) return
        const targetTop = Math.max(0, latestAppMessageRef.current.offsetTop - 12)
        scrollRef.current.scrollTo({ top: targetTop, behavior: 'auto' })
      })
      return
    }

    if (latestAppMessageRef.current) {
      latestAppMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, step, isTyping])

  function handleTrapsSubmit() {
    if (selectedTraps.length === 0) return
    setMessages((c) => [...c, {
      id: createId('user'), role: 'user', kind: 'text',
      chips: selectedTraps.map((t) => t.shortLabel),
    }])
    queueBotMessage(
      'Entendido. Agora: o que esse impulso te custa depois? Saber o preço real torna suas respostas muito mais poderosas.',
      'consequences',
    )
  }

  function handleConsequencesSubmit() {
    setMessages((c) => [...c, {
      id: createId('user'), role: 'user', kind: 'text',
      chips: selectedConsequences.length > 0 ? selectedConsequences : ['Prefiro não informar'],
    }])
    const trap = selectedTraps[0]
    queueBotMessage(
      `Agora escreva a frase que você quer ler quando pensar "${trap.text}". Pode ser curta, direta e do seu jeito.`,
      'response',
    )
  }

  function handleResponseSubmit(text: string) {
    const trap = selectedTraps[currentTrapIndex]
    const newResponse: TrapResponse = { trapId: trap.id, trapText: trap.text, text }
    const updatedResponses = [...trapResponses, newResponse]
    setTrapResponses(updatedResponses)

    const truncated = text.length > 90 ? `${text.slice(0, 90)}…` : text
    setMessages((c) => [...c, { id: createId('user'), role: 'user', kind: 'text', text: truncated }])

    const nextIndex = currentTrapIndex + 1

    if (nextIndex < selectedTraps.length) {
      setCurrentTrapIndex(nextIndex)
      const nextTrap = selectedTraps[nextIndex]
      queueBotMessage(`Boa. Agora faça o mesmo para "${nextTrap.text}".`)
    } else {
      queueBotMessage(
        'Perfeito. Seu escudo está completo. Veja como ficou antes de ativar.',
        undefined,
        () => {
          const t = window.setTimeout(() => setStep('review'), 400)
          timersRef.current.push(t)
        },
      )
    }
  }

  async function handleConfirmReview() {
    const config: SosConfiguration = {
      traps: trapResponses.map((r) => ({
        id: r.trapId,
        text: r.trapText,
        responseText: r.text,
      })),
      consequences: selectedConsequences,
      configuredAt: new Date().toISOString(),
    }
    await saveSosConfiguration(config)
    setShowDone(true)
  }

  function handleEditFromReview() {
    // Reset to beginning
    setMessages([])
    setSelectedTraps([])
    setSelectedConsequences([])
    setTrapResponses([])
    setCurrentTrapIndex(0)
    setStep('traps')
    queueBotMessage('Vamos identificar os pensamentos que costumam aparecer quando a vontade vem forte. Escolha as frases que mais combinam com o que passa na sua cabeça nesse momento.')
  }

  function handleBack() {
    if (step === 'consequences') {
      setMessages((p) => p.slice(0, -2))
      setStep('traps')
    } else if (step === 'response' && currentTrapIndex === 0) {
      setMessages((p) => p.slice(0, -2))
      setCurrentTrapIndex(0)
      setTrapResponses([])
      setStep('consequences')
    }
  }

  const canGoBack = !isTyping && (step === 'consequences' || (step === 'response' && currentTrapIndex === 0))
  const currentTrap = step === 'response' ? selectedTraps[currentTrapIndex] : null

  // When review is showing, render it full-screen instead of the chat
  if (step === 'review') {
    return (
      <>
        <AnimatePresence onExitComplete={() => navigate(appRoutes.sos, { replace: true })}>
          {showDone ? (
            <DoneOverlay
              key="done"
              count={trapResponses.length}
              onDismiss={() => setShowDone(false)}
            />
          ) : null}
        </AnimatePresence>
        <div className="ss-setup-screen ss-review-screen">
          <ShieldReview
            traps={selectedTraps}
            responses={trapResponses}
            consequences={selectedConsequences}
            onConfirm={handleConfirmReview}
            onEdit={handleEditFromReview}
          />
        </div>
      </>
    )
  }

  return (
    <>
      <AnimatePresence onExitComplete={() => navigate(appRoutes.sos, { replace: true })}>
        {showDone ? (
          <DoneOverlay
            key="done"
            count={trapResponses.length}
            onDismiss={() => setShowDone(false)}
          />
        ) : null}
      </AnimatePresence>

      <div className="ob-chat-screen ss-setup-screen">
        <div className="ob-chat-header">
          <div className="ob-chat-header-row">
            {canGoBack ? (
              <button type="button" className="ob-chat-back" onClick={handleBack}>
                <ArrowLeft size={14} strokeWidth={2.2} />
                Voltar
              </button>
            ) : null}
          </div>
          <h1 className="ob-chat-title">Monte seu escudo.</h1>
          <p className="ob-chat-subtitle">Prepare suas respostas antes da crise chegar.</p>
          <ChatProgress step={step} />
        </div>

        <div className="ob-chat-scroll" ref={scrollRef}>
          <div className="ob-chat-stack">
            {messages.map((msg, index) => {
              const lastAppTextIndex = [...messages].reverse().findIndex(
                (message) => message.role === 'app' && message.kind === 'text',
              )
              const latestAppTextIndex =
                lastAppTextIndex === -1 ? -1 : messages.length - 1 - lastAppTextIndex

              const content =
                msg.kind === 'typing'
                  ? <TypewriterBubble key={msg.id} />
                  : <TextBubble key={msg.id} role={msg.role} text={msg.text} chips={msg.chips} />

              if (index === latestAppTextIndex && msg.role === 'app' && msg.kind === 'text') {
                return (
                  <div key={`${msg.id}-anchor`} ref={latestAppMessageRef}>
                    {content}
                  </div>
                )
              }

              return content
            })}

            {!isTyping && step === 'traps' ? (
              <motion.div className="ob-chat-composer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
                <TrapSelector
                  selected={selectedTraps}
                  onToggle={(trap) =>
                    setSelectedTraps((c) =>
                      c.some((t) => t.id === trap.id) ? c.filter((t) => t.id !== trap.id) : [...c, trap],
                    )
                  }
                />
                <button
                  type="button"
                  className={`button ob-chat-send${selectedTraps.length >= 1 ? ' ob-chat-send--active' : ' ob-chat-send--pending'}`}
                  disabled={selectedTraps.length === 0}
                  onClick={handleTrapsSubmit}
                >
                  {selectedTraps.length >= 1
                    ? <><span>Continuar</span><ArrowRight size={16} strokeWidth={2.2} /></>
                    : 'Selecione ao menos uma'}
                </button>
              </motion.div>
            ) : null}

            {!isTyping && step === 'consequences' ? (
              <motion.div className="ob-chat-composer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
                <ConsequenceSelector
                  selected={selectedConsequences}
                  onToggle={(item) =>
                    setSelectedConsequences((c) =>
                      c.includes(item) ? c.filter((x) => x !== item) : [...c, item],
                    )
                  }
                />
                <button
                  type="button"
                  className="button ob-chat-send ob-chat-send--active"
                  onClick={handleConsequencesSubmit}
                >
                  {selectedConsequences.length === 0
                    ? <><span>Pular esta etapa</span><ArrowRight size={16} strokeWidth={2.2} /></>
                    : <><span>Continuar</span><ArrowRight size={16} strokeWidth={2.2} /></>}
                </button>
              </motion.div>
            ) : null}

            {!isTyping && step === 'response' && currentTrap ? (
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
    </>
  )
}
