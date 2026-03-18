import { useMemo, useState } from 'react'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function JournalPage() {
  const { state, saveJournalEntry, deleteJournalEntry } = useAppState()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const entries = useMemo(
    () =>
      [...state.journalEntries].sort(
        (left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt),
      ),
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

  const relapseEntries = entries.filter((entry) => entry.type === 'relapse').length

  return (
    <AppShell title="Jornal" eyebrow="Reflexao e clareza">
      <section className="panel-stack">
        <article className="info-card highlight-card">
          <span className="section-label">Nova entrada</span>
          <h2>Escreva para clarear o momento</h2>
          <p>
            No app antigo, o journal ajudava a dar contexto para o dia e tambem
            guardava reflexoes de recaida. Aqui ele continua com esse papel.
          </p>
          <form className="form-card" onSubmit={handleSubmit}>
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
                placeholder="Comece a escrever aqui..."
              />
            </div>
            <button className="button button-primary" type="submit">
              Salvar entrada
            </button>
          </form>
        </article>

        <article className="info-card">
          <span className="section-label">Panorama</span>
          <h2>O que ja foi registrado</h2>
          <dl className="home-stats-grid">
            <div>
              <dt>Total de entradas</dt>
              <dd>{entries.length}</dd>
            </div>
            <div>
              <dt>Entradas livres</dt>
              <dd>{entries.length - relapseEntries}</dd>
            </div>
            <div>
              <dt>Reflexoes de recaida</dt>
              <dd>{relapseEntries}</dd>
            </div>
            <div>
              <dt>Ultima atividade</dt>
              <dd>{entries[0] ? formatDate(entries[0].createdAt) : 'Nenhuma'}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="panel-stack">
        <div className="section-header">
          <div>
            <span className="section-label">Historico</span>
            <h2>Entradas salvas</h2>
          </div>
        </div>

        <div className="card-grid">
          {entries.length === 0 ? (
            <article className="info-card empty-state">
              <h2>Nenhuma entrada ainda</h2>
              <p>
                Quando voce escrever aqui, o app passa a guardar reflexoes livres
                e tambem aprendizados vindos da recaida.
              </p>
            </article>
          ) : (
            entries.map((entry) => (
              <article key={entry.id} className="info-card">
                <span className="section-label">
                  {entry.type === 'relapse' ? 'Reflexao de recaida' : 'Entrada livre'}
                </span>
                <h2>{entry.title}</h2>
                <p>{formatDate(entry.createdAt)}</p>
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
            ))
          )}
        </div>
      </section>
    </AppShell>
  )
}
