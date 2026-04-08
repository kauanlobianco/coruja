import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from './AppProviders'
import { AppRoutes } from './routes'

function ViewportGuards() {
  useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    const previousViewport = viewportMeta?.getAttribute('content') ?? null
    const lockedViewport = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'

    viewportMeta?.setAttribute('content', lockedViewport)

    const preventGesture = (event: Event) => {
      event.preventDefault()
    }

    const preventPinchZoom = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    }

    const preventCtrlZoom = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault()
      }
    }

    document.addEventListener('gesturestart', preventGesture, { passive: false })
    document.addEventListener('gesturechange', preventGesture, { passive: false })
    document.addEventListener('gestureend', preventGesture, { passive: false })
    document.addEventListener('touchmove', preventPinchZoom, { passive: false })
    window.addEventListener('wheel', preventCtrlZoom, { passive: false })

    return () => {
      if (previousViewport) {
        viewportMeta?.setAttribute('content', previousViewport)
      }

      document.removeEventListener('gesturestart', preventGesture)
      document.removeEventListener('gesturechange', preventGesture)
      document.removeEventListener('gestureend', preventGesture)
      document.removeEventListener('touchmove', preventPinchZoom)
      window.removeEventListener('wheel', preventCtrlZoom)
    }
  }, [])

  return null
}

export function App() {
  return (
    <AppProviders>
      <ViewportGuards />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  )
}
