import { useMemo, useState } from 'react'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'

export function JournalPage() {
  const { state, saveJournalEntry, deleteJournalEntry } = useAppState()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const entries = useMemo(
    () => [...state.journalEntries].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt)),
    [state.journalEntries],
  )

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

  return (
    <AppShell title="Jornal" eyebrow="Reflexao">
      <form className="form-card" onSubmit={handleSubmit}>
        <span className="section-label">Nova entrada</span>
        <h2>Registrar o dia</h2>
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
            className="textarea"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="O que você quer registrar?"
          />
        </div>
        <button className="button button-primary" type="submit">
          Salvar entrada
        </button>
      </form>

      <section className="panel-stack">
        <div className="section-header">
          <div>
            <span className="section-label">Historico</span>
            <h2>Entradas salvas</h2>
          </div>
        </div>

        <div className="card-grid">
          {entries.length === 0 ? (
            <article className="info-card">
              <h2>Nenhuma entrada ainda</h2>
              <p>As reflexoes livres e as entradas de recaida vao aparecer aqui.</p>
            </article>
          ) : (
            entries.map((entry) => (
              <article key={entry.id} className="info-card">
                <span className="section-label">{entry.type === 'relapse' ? 'Recaida' : 'Livre'}</span>
                <h2>{entry.title}</h2>
                <p>{new Date(entry.createdAt).toLocaleString('pt-BR')}</p>
                <p>{entry.content}</p>
                {entry.type !== 'relapse' ? (
                  <button
                    className="button button-secondary"
                    onClick={() => void deleteJournalEntry(entry.id)}
                  >
                    Excluir
                  </button>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>
    </AppShell>
  )
}
