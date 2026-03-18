import { useState, type PropsWithChildren, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AlertTriangle, BarChart3, Home, Library, Settings } from 'lucide-react'
import { useAppState } from '../../app/state/use-app-state'
import { appRoutes, appShellNavItems } from '../../core/config/routes'
import { isNativePlatform } from '../../core/platform/capacitor'

interface AppShellProps extends PropsWithChildren {
  title: ReactNode
  eyebrow: string
  subtitle?: string
  actions?: ReactNode
  shellMode?: 'entry' | 'app' | 'system'
  hideTopbar?: boolean
  contentClassName?: string
}

const navIcons = {
  Home,
  Analytics: BarChart3,
  Panico: AlertTriangle,
  Biblioteca: Library,
  Settings,
} as const

const PREVIEW_MODE_STORAGE_KEY = 'coruja-shell-preview-mode'

export function AppShell({
  title,
  eyebrow,
  subtitle,
  actions,
  children,
  shellMode = 'app',
  hideTopbar = false,
  contentClassName,
}: AppShellProps) {
  const navigate = useNavigate()
  const { demoNow, demoOffsetDays, shiftDemoDays, resetDemoClock, logoutAccount } = useAppState()
  const [previewMode, setPreviewMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem(PREVIEW_MODE_STORAGE_KEY) === 'preview'
  })

  async function handleReturnToLanding() {
    await logoutAccount(null)
    navigate(appRoutes.prePurchase, { replace: true })
  }

  function togglePreviewMode() {
    setPreviewMode((current) => {
      const nextValue = !current
      window.localStorage.setItem(PREVIEW_MODE_STORAGE_KEY, nextValue ? 'preview' : 'dev')
      return nextValue
    })
  }

  return (
    <div className={`app-shell${previewMode ? ' app-shell-preview-enabled' : ''}`}>
      {shellMode === 'app' && !isNativePlatform ? (
        <aside className="demo-panel">
          <span className="section-label">Demo</span>
          <h2>Painel de teste</h2>
          <p>Modo atual: {previewMode ? 'preview com moldura' : 'desenvolvimento sem moldura'}</p>
          <p>
            Data simulada: {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(demoNow)}
          </p>
          <p>Deslocamento: {demoOffsetDays >= 0 ? `+${demoOffsetDays}` : demoOffsetDays} dia(s)</p>
          <div className="demo-actions">
            <button className="button button-secondary" onClick={togglePreviewMode}>
              {previewMode ? 'Usar modo dev' : 'Ver moldura'}
            </button>
            <button className="button button-secondary" onClick={() => void shiftDemoDays(-1)}>
              -1 dia
            </button>
            <button className="button button-secondary" onClick={() => void shiftDemoDays(1)}>
              +1 dia
            </button>
            <button className="button button-secondary" onClick={() => void shiftDemoDays(7)}>
              +7 dias
            </button>
            <button className="button button-secondary" onClick={() => void resetDemoClock()}>
              Hoje real
            </button>
            <button className="button button-primary" onClick={() => void handleReturnToLanding()}>
              Voltar ao pre-compra
            </button>
          </div>
        </aside>
      ) : null}

      <div className="phone-shell">
        <div className="phone-frame">
          {previewMode ? <div className="phone-notch" aria-hidden="true" /> : null}

          <div className="app-frame">
            <main className={`content-grid app-content${contentClassName ? ` ${contentClassName}` : ''}`}>
              {hideTopbar ? null : (
                <header className="app-topbar">
                  <div className="hero-copy">
                    {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
                    <h1>{title}</h1>
                    {subtitle ? <p className="app-topbar-subtitle">{subtitle}</p> : null}
                  </div>
                  {actions ? <div className="toolbar toolbar-mobile">{actions}</div> : null}
                </header>
              )}

              {children}
            </main>
            {shellMode === 'app' ? (
              <nav className="bottom-nav" aria-label="Navegacao principal">
                {appShellNavItems.map((item) => {
                  const Icon = navIcons[item.label]
                  const isSos = item.label === 'Panico'

                  return (
                    <NavLink key={item.to} to={item.to} className="nav-item">
                      {({ isActive }) => (
                        <div className={isSos ? 'nav-item-inner nav-item-sos' : 'nav-item-inner'}>
                          {isSos ? (
                            <div className="nav-sos-button">
                              <Icon size={24} strokeWidth={2.2} />
                            </div>
                          ) : (
                            <>
                              <Icon
                                size={22}
                                strokeWidth={2.2}
                                className={isActive ? 'nav-icon nav-icon-active' : 'nav-icon'}
                              />
                              <span className="nav-label">{item.label}</span>
                              {isActive ? <span className="nav-dot" aria-hidden="true" /> : null}
                            </>
                          )}
                          {isSos ? <span className="nav-label nav-label-sos">{item.label}</span> : null}
                        </div>
                      )}
                    </NavLink>
                  )
                })}
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
