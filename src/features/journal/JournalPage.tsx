import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Plus, Search, Trash2, X } from 'lucide-react'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'

function formatCardDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(new Date(value))
    .toUpperCase()
    .replace(/\./g, '')
}

export function JournalPage() {
  const { state, saveJournalEntry, deleteJournalEntry } = useAppState()
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showComposer, setShowComposer] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const entries = useMemo(
    () =>
      [...state.journalEntries].sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
      ),
    [state.journalEntries],
  )

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return entries
    const q = search.toLowerCase()
    return entries.filter(
      (e) => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q),
    )
  }, [entries, search])

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!content.trim()) return
    await saveJournalEntry({
      title: title.trim() || 'Nova entrada',
      content: content.trim(),
      type: 'freeform',
    })
    setTitle('')
    setContent('')
    setShowComposer(false)
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <AppShell title="Jornal">

      {/* Busca */}
      <div className="journal-search-wrap">
        <Search size={15} className="journal-search-icon" />
        <input
          className="journal-search-input"
          placeholder="Buscar reflexões..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Heading */}
      <div className="journal-heading">
        <h1 className="journal-heading-title">Seu Diário</h1>
        <p className="journal-heading-sub">Registre os pensamentos da sua jornada.</p>
      </div>

      {/* Cards ou estado vazio */}
      {filteredEntries.length === 0 ? (
        <div className="journal-empty-new">
          <BookOpen size={44} strokeWidth={1.2} className="journal-empty-icon" />
          <p className="journal-empty-title">
            {search ? 'Nenhuma entrada encontrada' : 'Nenhum registro ainda'}
          </p>
          <p className="journal-empty-sub">
            {search
              ? 'Tente buscar por outra palavra.'
              : 'Toque em + para começar sua jornada.'}
          </p>
        </div>
      ) : (
        <div className="journal-cards">
          {filteredEntries.map((entry) => (
            <article key={entry.id} className={`journal-card journal-card--${entry.type}`}>
              <div className="journal-card-top">
                <span className="journal-card-date">{formatCardDate(entry.createdAt)}</span>
                <span className={`journal-card-badge journal-card-badge--${entry.type}`}>
                  {entry.type === 'relapse' ? 'RECAÍDA' : 'REFLEXÃO'}
                </span>
              </div>
              <h2 className="journal-card-title">{entry.title}</h2>
              <p
                className={`journal-card-preview${expandedId === entry.id ? ' journal-card-preview--open' : ''}`}
              >
                {entry.content}
              </p>
              <div className="journal-card-footer">
                <div className={`journal-card-line journal-card-line--${entry.type}`} />
                <div className="journal-card-actions">
                  <button
                    type="button"
                    className="journal-card-readmore"
                    onClick={() => toggleExpand(entry.id)}
                  >
                    {expandedId === entry.id ? 'Fechar' : 'Ler mais'}
                  </button>
                  {entry.type !== 'relapse' && (
                    <button
                      type="button"
                      className="journal-card-delete"
                      onClick={() => void deleteJournalEntry(entry.id)}
                      aria-label="Excluir entrada"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        type="button"
        className="journal-fab"
        onClick={() => setShowComposer(true)}
        aria-label="Nova entrada"
      >
        <Plus size={24} strokeWidth={2.2} />
      </button>

      {/* Composer bottom sheet */}
      <AnimatePresence>
        {showComposer && (
          <>
            <motion.div
              className="journal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowComposer(false)}
            />
            <motion.div
              className="journal-composer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            >
              <div className="journal-composer-handle" />
              <div className="journal-composer-head">
                <span className="journal-composer-title">Nova entrada</span>
                <button
                  type="button"
                  className="journal-composer-close"
                  onClick={() => setShowComposer(false)}
                  aria-label="Fechar"
                >
                  <X size={18} />
                </button>
              </div>
              <form className="journal-composer-form" onSubmit={(e) => void handleSubmit(e)}>
                <input
                  className="journal-composer-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título (opcional)"
                />
                <textarea
                  className="journal-composer-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escreva sua reflexão..."
                  rows={6}
                />
                <button
                  type="submit"
                  className="button button-primary journal-composer-submit"
                  disabled={!content.trim()}
                >
                  Salvar
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AppShell>
  )
}
