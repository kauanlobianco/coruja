import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, SendHorizontal } from 'lucide-react'

const SYSTEM_PROMPT = `
Você é um terapeuta de plantão auxiliando um usuário que está tentando largar o vício em pornografia. Siga estas regras estritamente:

1. Seja humano e natural: Responda como se estivesse conversando em um aplicativo de mensagens (como WhatsApp). Use um tom acolhedor, calmo e direto.

2. Extrema Brevidade: Suas respostas devem ter no máximo 2 a 3 frases curtas. Evite escrever blocos longos de texto.

3. Sem Formatação Markdown: Nunca use asteriscos (*), sublinhados (_), hashtags (#) ou qualquer formatação de negrito/itálico. Use apenas texto limpo, vírgulas, pontos finais e quebras de linha normais.

4. Um passo de cada vez: Se for propor um exercício de respiração ou distração, não mande uma lista de opções. Faça uma pergunta simples por vez e espere o usuário responder. Exemplo: "Sinto muito que esteja passando por isso. Você consegue se levantar e ir até a janela agora?" ou "Quer tentar um exercício de respiração comigo de 1 minuto?". Espere a resposta dele para continuar.

5. Sem palestras: Nunca dê aulas teóricas longas sobre dopamina a menos que o usuário faça uma pergunta técnica e direta sobre o assunto, e mesmo assim, explique em no máximo duas frases limpas.

Responda sempre em português do Brasil.
`.trim()

interface Message {
  id: string
  role: 'user' | 'model'
  text: string
}

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
    throw new Error('VITE_GROQ_API_KEY não configurada no arquivo .env')
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((m) => ({
      role: m.role === 'model' ? 'assistant' : 'user',
      content: m.text,
    })),
    { role: 'user', content: userText },
  ]

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.85,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    const errorMessage = (errorBody as { error?: { message?: string } }).error?.message ?? `Erro ${response.status}`
    throw new Error(errorMessage)
  }

  const data = await response.json() as {
    choices: Array<{ message: { content: string } }>
  }
  return data.choices[0].message.content
}

interface AiMentorChatProps {
  onBack: () => void
}

const SUGGESTIONS = [
  'Tô sentindo vontade agora. Me ajuda.',
  'O que é o ciclo de recompensa da dopamina?',
  'Tive uma recaída. O que faço?',
]

export function AiMentorChat({ onBack }: AiMentorChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  async function handleSend(text?: string) {
    const finalText = (text ?? input).trim()
    if (!finalText || loading) return

    const userMessage: Message = { id: createId(), role: 'user', text: finalText }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setError(null)
    setLoading(true)

    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      const reply = await sendToGroq(messages, finalText)
      setMessages((prev) => [...prev, { id: createId(), role: 'model', text: reply }])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(`Não foi possível obter uma resposta: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const content = (
    <div className="ai-chat-overlay">
      {/* Topbar */}
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

      {/* Messages */}
      <div className="ai-chat-messages">
        <div className="ob-chat-stack">
          <AnimatePresence initial={false}>
            {messages.length === 0 && !loading && (
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
                <p className="ai-chat-empty-title">Olá! Sou seu mentor virtual.</p>
                <p className="ai-chat-empty-sub">
                  Estou aqui para te apoiar na sua jornada. Pode me perguntar qualquer coisa — sem julgamentos.
                </p>
                <div className="ai-chat-suggestions">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="ai-chat-suggestion-pill"
                      onClick={() => void handleSend(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} text={msg.text} />
          ))}

          {loading && <TypingBubble />}

          {error && (
            <motion.div
              className="ai-chat-error-msg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="ai-chat-input-bar">
        <textarea
          ref={textareaRef}
          className="ai-chat-input"
          placeholder="Escreva sua mensagem..."
          value={input}
          rows={1}
          disabled={loading}
          onChange={(e) => { setInput(e.target.value); autoResize() }}
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
