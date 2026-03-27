import { isNativePlatform, platform } from '../../core/platform/capacitor'

export function IntroPage() {
  if (!isNativePlatform) {
    return null
  }

  return (
    <div className="intro-screen">
      <div className="intro-card">
        <span className="eyebrow">Coruja bootstrap</span>
        <h1>Carregando a base nova</h1>
        <p>
          Preparando shell nativo, hidratação do estado único e roteamento do
          fluxo inicial.
        </p>
        <div className="intro-meta">
          <span>{isNativePlatform ? 'Capacitor native' : 'Web preview'}</span>
          <span>{platform}</span>
        </div>
      </div>
    </div>
  )
}
