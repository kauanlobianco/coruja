import { useEffect, useRef } from 'react'
import { Clock3, X } from 'lucide-react'
import type { CuradoriaPlayableItem } from '../../../data/curadoria'

interface CuradoriaMediaModalProps {
  item: CuradoriaPlayableItem | null
  onClose: () => void
}

function getTipoLabel(tipo: CuradoriaPlayableItem['tipo']) {
  return tipo === 'video' ? 'Video' : 'Podcast'
}

function getDescricao(item: CuradoriaPlayableItem) {
  return item.tipo === 'video' ? item.canal : item.programa
}

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url)
    const videoId =
      parsedUrl.searchParams.get('v') ??
      (parsedUrl.hostname.includes('youtu.be') ? parsedUrl.pathname.replace('/', '') : null)

    if (!videoId) {
      return url
    }

    return `https://www.youtube.com/embed/${videoId}?autoplay=1`
  } catch {
    return url
  }
}

function getEmbedUrl(item: CuradoriaPlayableItem) {
  if (item.plataforma === 'youtube') {
    return getYouTubeEmbedUrl(item.url)
  }

  if (item.tipo !== 'video') {
    return item.url
  }

  return item.url.includes('?') ? `${item.url}&autoplay=1` : `${item.url}?autoplay=1`
}

export function CuradoriaMediaModal({
  item,
  onClose,
}: CuradoriaMediaModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!item) {
      return
    }

    const previousOverflow = document.body.style.overflow
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [item, onClose])

  useEffect(() => {
    if (!item || item.tipo !== 'video') {
      return
    }

    const modalElement = modalRef.current
    const canRequestFullscreen =
      modalElement &&
      'requestFullscreen' in modalElement &&
      typeof modalElement.requestFullscreen === 'function'

    const orientationApi = screen.orientation as ScreenOrientation & {
      unlock?: () => void
    }

    void (async () => {
      try {
        if (canRequestFullscreen && document.fullscreenElement !== modalElement) {
          await modalElement.requestFullscreen()
        }
      } catch {
        // Fullscreen is best-effort only.
      }

      try {
        await orientationApi.lock?.('landscape')
      } catch {
        // Orientation lock is not supported everywhere.
      }
    })()

    return () => {
      try {
        orientationApi.unlock?.()
      } catch {
        // Ignore unsupported unlock calls.
      }

      if (document.fullscreenElement === modalElement) {
        void document.exitFullscreen().catch(() => {
          // Ignore exit failures.
        })
      }
    }
  }, [item])

  if (!item) {
    return null
  }

  const tipoLabel = getTipoLabel(item.tipo)
  const isVideo = item.tipo === 'video'

  return (
    <div
      className="curadoria-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${tipoLabel}: ${item.titulo}`}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className={`curadoria-modal${
          item.tipo === 'podcast' ? ' curadoria-modal--podcast' : ''
        }${isVideo ? ' curadoria-modal--video' : ''}`}
        onClick={(event) => event.stopPropagation()}
      >
        {isVideo ? (
          <div className="curadoria-modal-video-topbar">
            <div className="curadoria-modal-video-meta">
              <span className={`curadoria-type-pill curadoria-type-pill--${item.tipo}`}>
                {tipoLabel}
              </span>
              <span className="curadoria-modal-duration">
                <Clock3 size={12} strokeWidth={2.2} />
                {item.duracao}
              </span>
            </div>

            <button
              type="button"
              className="curadoria-modal-close curadoria-modal-close--floating"
              onClick={onClose}
              aria-label="Fechar player"
            >
              <X size={18} strokeWidth={2.4} />
            </button>
          </div>
        ) : (
          <div className="curadoria-modal-header">
            <div className="curadoria-modal-copy">
              <div className="curadoria-modal-pills">
                <span className={`curadoria-type-pill curadoria-type-pill--${item.tipo}`}>
                  {tipoLabel}
                </span>
                <span className="curadoria-modal-duration">
                  <Clock3 size={12} strokeWidth={2.2} />
                  {item.duracao}
                </span>
              </div>

              <h3>{item.titulo}</h3>
              <p>{getDescricao(item)}</p>
            </div>

            <button
              type="button"
              className="curadoria-modal-close"
              onClick={onClose}
              aria-label="Fechar player"
            >
              <X size={18} strokeWidth={2.4} />
            </button>
          </div>
        )}

        <div
          className={`curadoria-modal-frame-shell${
            item.tipo === 'podcast'
              ? ' curadoria-modal-frame-shell--podcast'
              : isVideo
                ? ' curadoria-modal-frame-shell--immersive-video'
                : ' curadoria-modal-frame-shell--video'
          }`}
        >
          <iframe
            className={`curadoria-modal-frame${
              item.tipo === 'podcast' ? ' curadoria-modal-frame--podcast' : ''
            }`}
            src={getEmbedUrl(item)}
            title={item.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  )
}
