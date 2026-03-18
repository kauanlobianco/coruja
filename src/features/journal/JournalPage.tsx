import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import { Plus } from 'lucide-react'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatToday(value: Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(value)
}

export function JournalPage() {
  const { state, demoNow, saveJournalEntry, deleteJournalEntry } = useAppState()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [collapsedOffset, setCollapsedOffset] = useState(0)
  const [dragBounds, setDragBounds] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const y = useMotionValue(0)

  const entries = useMemo(
    () =>
      [...state.journalEntries].sort(
        (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
      ),
    [state.journalEntries],
  )

  useEffect(() => {
    function computeSheetMetrics() {
      const viewportHeight = window.innerHeight
      const sheetHeight = Math.min(viewportHeight * 0.9, 720)
      const collapsed = Math.max(sheetHeight - 120, 0)

      setCollapsedOffset(collapsed)
      setDragBounds(collapsed)
      y.set(isExpanded ? 0 : collapsed)
    }

    computeSheetMetrics()
    window.addEventListener('resize', computeSheetMetrics)

    return () => {
      window.removeEventListener('resize', computeSheetMetrics)
    }
  }, [isExpanded, y])

  function snapTo(expanded: boolean) {
    animate(y, expanded ? 0 : collapsedOffset, {
      type: 'spring',
      stiffness: 300,
      damping: 35,
    })
    setIsExpanded(expanded)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!content.trim()) {
      return
    }

    await saveJournalEntry({
      title: title.trim() || 'Nova entrada',
      content: content.trim(),
      type: 'freeform',
    })

    setTitle('')
    setContent('')
  }

  function handleNewEntryFocus() {
    textareaRef.current?.focus()
  }

  return (
    <AppShell title="" eyebrow="" hideTopbar>
      <section className="journal-screen">
        <div className="journal-static">
          <header className="journal-header">
            <div>
              <p className="journal-date">{formatToday(demoNow)}</p>
              <h1>Jornal</h1>
            </div>
            <button
              className="button button-orange shimmer journal-new-button"
              onClick={handleNewEntryFocus}
              type="button"
            >
              <Plus size={16} />
              <span>Nova entrada</span>
            </button>
          </header>

          <article className="info-card journal-composer-card">
            <span className="section-label">Nova entrada</span>
            <h2>Escreva para clarear o momento</h2>
            <form className="form-card journal-form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="journal-title">Titulo</label>
                <input
                  id="journal-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Resumo curto do momento"
                />
              </div>
              <div className="field">
                <label htmlFor="journal-content">Conteudo</label>
                <textarea
                  id="journal-content"
                  ref={textareaRef}
                  className="textarea"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Comece a escrever aqui..."
                />
              </div>
              <button className="button button-primary" type="submit">
                Salvar entrada
              </button>
            </form>
          </article>
        </div>

        <motion.div
          className="journal-sheet"
          style={{ y }}
          drag="y"
          dragConstraints={{ top: 0, bottom: dragBounds }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            if (info.velocity.y > 300 || info.offset.y > 150) {
              snapTo(false)
            } else {
              snapTo(true)
            }
          }}
        >
          <div className="journal-sheet-handle" />
          <div className="journal-sheet-head">
            <span>entradas</span>
            {!isExpanded ? (
              <button
                className="journal-sheet-trigger"
                onClick={() => snapTo(true)}
                type="button"
              >
                ver tudo ↑
              </button>
            ) : null}
          </div>
          <div className="journal-sheet-content">
            {entries.length === 0 ? (
              <article className="info-card empty-state journal-empty">
                <h2>Nenhuma entrada ainda</h2>
                <p>
                  Quando voce escrever aqui, o app passa a guardar reflexoes livres e
                  aprendizados do seu processo.
                </p>
              </article>
            ) : (
              <div className="journal-entry-list">
                {entries.map((entry) => (
                  <article key={entry.id} className="info-card journal-entry-card">
                    <span className="section-label">
                      {entry.type === 'relapse' ? 'Reflexao de recaida' : 'Entrada livre'}
                    </span>
                    <h2>{entry.title}</h2>
                    <p className="journal-entry-date">{formatDate(entry.createdAt)}</p>
                    <p>{entry.content}</p>
                    {entry.type !== 'relapse' ? (
                      <button
                        className="button button-danger"
                        onClick={() => void deleteJournalEntry(entry.id)}
                      >
                        Excluir
                      </button>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </AppShell>
  )
}
