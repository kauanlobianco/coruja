import type { PropsWithChildren, ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'

interface AppShellProps extends PropsWithChildren {
  title: string
  eyebrow: string
  actions?: ReactNode
}

export function AppShell({
  title,
  eyebrow,
  actions,
  children,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <div className="app-frame">
        <header className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>
              Base mobile-first em React + Capacitor, com um fluxo único,
              estado centralizado e pontos claros para features nativas.
            </p>
          </div>

          <div className="hero-actions">
            <Link className="button button-primary" to="/app">
              Visao do app
            </Link>
            <Link className="button button-secondary" to="/onboarding">
              Testar onboarding
            </Link>
          </div>
        </header>

        <nav className="top-nav" aria-label="Navegacao principal">
          <NavLink to="/app">App</NavLink>
          <NavLink to="/check-in">Check-in</NavLink>
          <NavLink to="/sos">SOS</NavLink>
          <NavLink to="/journal">Jornal</NavLink>
          <NavLink to="/relapse">Recaida</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
          <NavLink to="/blocker">Bloqueador</NavLink>
          <NavLink to="/pre-purchase">Pre-compra</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>

        {actions ? <div className="toolbar">{actions}</div> : null}

        <main className="content-grid">{children}</main>
      </div>
    </div>
  )
}
