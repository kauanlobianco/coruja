import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CuradoriaCatalogItem } from '../../../data/curadoria'

interface CuradoriaCarouselProps {
  items: CuradoriaCatalogItem[]
  activeItemId: string | null
  completedArticleIds?: string[]
  onSelect: (id: string) => void
  onViewAll?: () => void
}

function getTipoLabel(tipo: CuradoriaCatalogItem['tipo']) {
  if (tipo === 'video') {
    return 'Video'
  }

  if (tipo === 'podcast') {
    return 'Podcast'
  }

  return 'Leitura'
}

function getDescricao(item: CuradoriaCatalogItem) {
  if (item.tipo === 'video') {
    return item.canal
  }

  if (item.tipo === 'podcast') {
    return item.programa
  }

  return item.fonte
}

function getMeta(item: CuradoriaCatalogItem) {
  return item.tipo === 'article' ? item.tempo : item.duracao
}

export function CuradoriaCarousel({
  items,
  activeItemId,
  completedArticleIds = [],
  onSelect,
  onViewAll,
}: CuradoriaCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(items.length > 1)

  const checkScrollability = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) {
      return
    }

    const { scrollLeft, scrollWidth, clientWidth } = container
    setCanScrollLeft(scrollLeft > 4)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4)
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) {
      return
    }

    checkScrollability()
    container.addEventListener('scroll', checkScrollability)
    window.addEventListener('resize', checkScrollability)

    return () => {
      container.removeEventListener('scroll', checkScrollability)
      window.removeEventListener('resize', checkScrollability)
    }
  }, [checkScrollability, items.length])

  function scroll(direction: 'left' | 'right') {
    const container = scrollContainerRef.current
    if (!container) {
      return
    }

    container.scrollBy({
      left: direction === 'left' ? -(container.clientWidth * 0.86) : container.clientWidth * 0.86,
      behavior: 'smooth',
    })
  }

  return (
    <section className="curadoria-section" aria-label="Curadoria">
      <div className="curadoria-section-head">
        <div className="curadoria-section-heading-row">
          {onViewAll ? (
            <button
              type="button"
              className="curadoria-section-link"
              onClick={onViewAll}
            >
              <h2>Videos & podcasts</h2>
              <ChevronRight size={16} strokeWidth={2.2} />
            </button>
          ) : (
            <h2>Videos & podcasts</h2>
          )}

          <div className="curadoria-section-actions">
            <div className="curadoria-carousel-nav" aria-hidden="true">
            <button
              type="button"
              className="curadoria-carousel-nav-button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Rolar curadoria para a esquerda"
            >
              <ChevronLeft size={18} strokeWidth={2.2} />
            </button>

            <button
              type="button"
              className="curadoria-carousel-nav-button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Rolar curadoria para a direita"
            >
              <ChevronRight size={18} strokeWidth={2.2} />
            </button>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollContainerRef} className="curadoria-carousel-track">
        {items.map((item) => {
          const isActive = item.id === activeItemId
          const isArticleRead = item.tipo === 'article' && completedArticleIds.includes(item.id)

          return (
            <button
              key={item.id}
              type="button"
              className={`curadoria-media-card${isActive ? ' is-active' : ''}`}
              onClick={() => onSelect(item.id)}
              aria-pressed={isActive}
              aria-label={`Selecionar ${getTipoLabel(item.tipo).toLowerCase()}: ${item.titulo}`}
            >
              <div className="curadoria-media-thumb">
                <img src={item.thumb} alt={item.titulo} />
                <div className="curadoria-media-thumb-meta">
                  <span className="curadoria-media-thumb-type">{getTipoLabel(item.tipo)}</span>
                  <span>{getMeta(item)}</span>
                </div>
              </div>

              <div className="curadoria-media-body">
                <div className="curadoria-media-copy">
                  <h3>{item.titulo}</h3>
                  <p>{getDescricao(item)}</p>
                </div>
                {isArticleRead ? <span className="curadoria-read-pill">Lido</span> : item.novo ? <span className="curadoria-new-pill">Novo</span> : null}
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
