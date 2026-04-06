import { useMemo, useState } from 'react'
import { ChevronLeft, Clock3, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { appRoutes } from '../../core/config/routes'
import {
  curadoriaCatalogo,
  type CuradoriaPlayableItem,
} from '../../data/curadoria'
import { CuradoriaMediaModal } from './components/CuradoriaMediaModal'

type MediaFilter = 'all' | 'video' | 'podcast'

function getSecondaryLabel(item: CuradoriaPlayableItem) {
  return item.tipo === 'video' ? item.canal : item.programa
}

export function LibraryMediaPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<MediaFilter>('all')
  const [activeItem, setActiveItem] = useState<CuradoriaPlayableItem | null>(null)

  const mediaItems = useMemo(
    () => curadoriaCatalogo.filter((item): item is CuradoriaPlayableItem => item.tipo !== 'article'),
    [],
  )

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return mediaItems.filter((item) => {
      const matchesFilter = filter === 'all' || item.tipo === filter
      if (!matchesFilter) {
        return false
      }

      if (!normalizedQuery) {
        return true
      }

      const searchableText = [
        item.titulo,
        item.descricao,
        item.subtitulo,
        item.tipo === 'video' ? item.canal : item.programa,
      ]
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedQuery)
    })
  }, [filter, mediaItems, query])

  return (
    <>
      <AppShell
        title="Videos & podcasts"
        shellMode="system"
        contentClassName="app-content-library"
        leading={
          <button className="app-back-button" type="button" onClick={() => navigate(appRoutes.library)}>
            <ChevronLeft size={18} strokeWidth={2.2} />
          </button>
        }
      >
        <section className="library-media-page">
          <div className="library-media-search">
            <Search size={16} strokeWidth={2.1} className="library-media-search-icon" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar videos e podcasts"
              className="library-media-search-input"
            />
          </div>

          <div className="library-media-filters" role="tablist" aria-label="Filtrar conteudos">
            {[
              { id: 'all', label: 'Tudo' },
              { id: 'video', label: 'Videos' },
              { id: 'podcast', label: 'Podcasts' },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                className={`library-media-filter${filter === option.id ? ' is-active' : ''}`}
                onClick={() => setFilter(option.id as MediaFilter)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="library-media-results-head">
            <h2>Todos os conteudos</h2>
            <span>{filteredItems.length} itens</span>
          </div>

          <div className="library-media-grid">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="library-media-grid-card"
                onClick={() => setActiveItem(item)}
              >
                <div className="library-media-grid-thumb">
                  <img src={item.thumb} alt={item.titulo} />
                  <div className="library-media-grid-meta">
                    <span>{item.tipo === 'video' ? 'Video' : 'Podcast'}</span>
                    <span>
                      <Clock3 size={11} strokeWidth={2.2} />
                      {item.duracao}
                    </span>
                  </div>
                </div>

                <div className="library-media-grid-copy">
                  <h3>{item.titulo}</h3>
                  <p>{getSecondaryLabel(item)}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </AppShell>

      <CuradoriaMediaModal item={activeItem} onClose={() => setActiveItem(null)} />
    </>
  )
}
