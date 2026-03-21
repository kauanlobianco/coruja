import { useState, type PropsWithChildren, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { AlertTriangle, BarChart3, Home, Library, Settings } from 'lucide-react'
import { appShellNavItems } from '../../core/config/routes'

interface AppShellProps extends PropsWithChildren {
  title: ReactNode
  eyebrow?: string
  subtitle?: string
  actions?: ReactNode
  shellMode?: 'entry' | 'app' | 'system'
  hideTopbar?: boolean
  contentClassName?: string
}

const navIcons = {
  Home,
  Analises: BarChart3,
  Sos: AlertTriangle,
  Biblioteca: Library,
  Ajustes: Settings,
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
  const [previewMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return window.localStorage.getItem(PREVIEW_MODE_STORAGE_KEY) === 'preview'
  })

  return (
    <div className={`app-shell${previewMode ? ' app-shell-preview-enabled' : ''}`}>
      <div className="phone-shell">
        <div className="phone-frame">
          {previewMode ? <div className="phone-notch" aria-hidden="true" /> : null}

          <div className="app-frame">
            <div className="app-container">
              <main
                className={`content-grid app-content conteudo-scroll${
                  contentClassName ? ` ${contentClassName}` : ''
                }`}
              >
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
                    const isSos = item.label === 'Sos'

                    return (
                      <NavLink key={item.to} to={item.to} className="nav-item">
                        {({ isActive }) => (
                          <div className={isSos ? 'nav-item-inner nav-item-sos' : 'nav-item-inner'}>
                            {isSos ? (
                              <div className="nav-sos-button">
                                <Icon size={22} strokeWidth={2.2} />
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
                            {isSos ? (
                              <span className="nav-label nav-label-sos">{item.label}</span>
                            ) : null}
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
    </div>
  )
}
