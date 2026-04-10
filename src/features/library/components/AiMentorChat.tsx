import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, SendHorizontal } from 'lucide-react'

const SYSTEM_PROMPT = `
Voce e um terapeuta de plantao auxiliando um usuario que esta tentando largar o vicio em pornografia. Siga estas regras estritamente:

1. Seja humano e natural: Responda como se estivesse conversando em um aplicativo de mensagens. Use um tom acolhedor, calmo e direto.

2. Extrema brevidade: Suas respostas devem ter no maximo 2 a 3 frases curtas. Evite blocos longos.

3. Sem markdown: Nunca use asteriscos, hashtags ou qualquer formatacao de negrito/italico. Use apenas texto limpo.

4. Um passo de cada vez: Se for propor respiracao ou distracao, nao mande uma lista. Faca uma pergunta simples por vez e espere o usuario responder.

5. Sem palestras: Nunca de aulas teoricas longas sobre dopamina, a menos que o usuario faca uma pergunta tecnica direta, e mesmo assim explique em no maximo duas frases.

Responda sempre em portugues do Brasil.
`.trim()

interface Message {
  id: string
  role: 'user' | 'model'
  text: string
}

interface SosMentorContext {
  selectedTrapText?: string
  responseText?: string
  motivation?: string
}

interface AiMentorChatProps {
  onBack: () => void
  entryMode?: 'default' | 'sos'
  sosContext?: SosMentorContext
  initialSuggestions?: string[]
}

const DEFAULT_SUGGESTIONS = [
  'To sentindo vontade agora. Me ajuda.',
  'O que e o ciclo de recompensa da dopamina?',
  'Tive uma recaida. O que faco?',
]

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function FocoBotAvatar() {
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

function TypingBubble() {
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
            transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: 0.16 }}
          />
          <motion.span
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut', delay: 0.32 }}
          />
        </span>
      </motion.div>
    </motion.div>
  )
}

function MessageBubble({ role, text }: { role: 'user' | 'model'; text: string }) {
  return (
    <motion.div
      className={`ob-chat-row ob-chat-row--${role === 'model' ? 'app' : 'user'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {role === 'model' ? (
        <div className="ob-chat-avatar" aria-hidden="true">
          <FocoBotAvatar />
        </div>
      ) : null}
      <motion.div
        className={`ob-chat-bubble ob-chat-bubble--${role === 'model' ? 'app' : 'user'}`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24, mass: 0.8 }}
      >
        {text}
      </motion.div>
    </motion.div>
  )
}

async function sendToGroq(history: Message[], userText: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string

  if (!apiKey) {
    throw new Error('VITE_GROQ_API_KEY nao configurada no arquivo .env')
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((message) => ({
      role: message.role === 'model' ? 'assistant' : 'user',
      content: message.text,
    })),
    { role: 'user', content: userText },
  ]

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.85,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const errorMessage =
      (errorBody as { error?: { message?: string } }).error?.message ?? `Erro ${response.status}`
    throw new Error(errorMessage)
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>
  }

  return data.choices[0].message.content
}

export function AiMentorChat({
  onBack,
  entryMode = 'default',
  sosContext,
  initialSuggestions,
}: AiMentorChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  function autoResize() {
    const element = textareaRef.current
    if (!element) return
    element.style.height = 'auto'
    element.style.height = `${Math.min(element.scrollHeight, 120)}px`
  }

  async function handleSend(text?: string) {
    const finalText = (text ?? input).trim()
    if (!finalText || loading) return

    const userMessage: Message = { id: createId(), role: 'user', text: finalText }
    setMessages((current) => [...current, userMessage])
    setInput('')
    setError(null)
    setLoading(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const reply = await sendToGroq(messages, finalText)
      setMessages((current) => [...current, { id: createId(), role: 'model', text: reply }])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(`Nao foi possivel obter uma resposta: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSend()
    }
  }

  const isSosMode = entryMode === 'sos'
  const heroTitle = isSosMode ? 'Eu ja estou com voce aqui.' : 'Ola! Sou seu mentor virtual.'
  const heroSubtitle = isSosMode
    ? 'Me responde em uma frase curta. Eu vou te puxar passo a passo neste pico.'
    : 'Estou aqui para te apoiar na sua jornada. Pode me perguntar qualquer coisa - sem julgamentos.'
  const suggestions =
    initialSuggestions && initialSuggestions.length > 0 ? initialSuggestions : DEFAULT_SUGGESTIONS
  const sosContextLine = isSosMode
    ? sosContext?.selectedTrapText
      ? `Armadilha mais forte agora: "${sosContext.selectedTrapText}".`
      : sosContext?.motivation
        ? `Lembrete do seu porque: ${sosContext.motivation}`
        : null
    : null
  const sosResponseLine = isSosMode && sosContext?.responseText
    ? `Sua resposta escrita antes da crise: "${sosContext.responseText}".`
    : null

  const content = (
    <div className="ai-chat-overlay">
      <div className="ai-chat-topbar">
        <button type="button" className="ob-chat-back" onClick={onBack} aria-label="Voltar">
          <ArrowLeft size={14} strokeWidth={2.2} />
          Voltar
        </button>
        <div className="ai-chat-topbar-center">
          <div className="ob-chat-avatar ai-chat-topbar-avatar" aria-hidden="true">
            <FocoBotAvatar />
          </div>
          <div className="ai-chat-topbar-info">
            <span className="ai-chat-name">Mentor IA</span>
            <span className="ai-chat-status">Online</span>
          </div>
        </div>
      </div>

      <div className="ai-chat-messages">
        <div className="ob-chat-stack">
          <AnimatePresence initial={false}>
            {messages.length === 0 && !loading ? (
              <motion.div
                className="ai-chat-empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div className="ob-chat-avatar ai-chat-empty-avatar" aria-hidden="true">
                  <FocoBotAvatar />
                </div>
                <p className="ai-chat-empty-title">{heroTitle}</p>
                <p className="ai-chat-empty-sub">{heroSubtitle}</p>
                {sosContextLine ? <p className="ai-chat-empty-context">{sosContextLine}</p> : null}
                {sosResponseLine ? <p className="ai-chat-empty-context">{sosResponseLine}</p> : null}
                <div className="ai-chat-suggestions">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="ai-chat-suggestion-pill"
                      onClick={() => void handleSend(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {messages.map((message) => (
            <MessageBubble key={message.id} role={message.role} text={message.text} />
          ))}

          {loading ? <TypingBubble /> : null}

          {error ? (
            <motion.div
              className="ai-chat-error-msg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          ) : null}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="ai-chat-input-bar">
        <textarea
          ref={textareaRef}
          className="ai-chat-input"
          placeholder="Escreva sua mensagem..."
          value={input}
          rows={1}
          disabled={loading}
          onChange={(event) => {
            setInput(event.target.value)
            autoResize()
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="ai-chat-send"
          onClick={() => void handleSend()}
          disabled={!input.trim() || loading}
          aria-label="Enviar"
        >
          <SendHorizontal size={18} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
