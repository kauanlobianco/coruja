import type { PropsWithChildren, ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppState } from '../../app/state/use-app-state'
import { appRoutes, appShellNavItems } from '../../core/config/routes'

interface AppShellProps extends PropsWithChildren {
  title: string
  eyebrow: string
  actions?: ReactNode
  overlay?: ReactNode
  shellMode?: 'entry' | 'app' | 'system'
}

export function AppShell({
  title,
  eyebrow,
  actions,
  overlay,
  children,
  shellMode = 'app',
}: AppShellProps) {
  const navigate = useNavigate()
  const { demoNow, demoOffsetDays, shiftDemoDays, resetDemoClock, logoutAccount } = useAppState()

  async function handleReturnToLanding() {
    await logoutAccount(null)
    navigate(appRoutes.prePurchase, { replace: true })
  }

  return (
    <div className="app-shell">
      {shellMode === 'app' ? (
        <aside className="demo-panel">
          <span className="section-label">Demo</span>
          <h2>Painel de teste</h2>
          <p>
            Data simulada: {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(demoNow)}
          </p>
          <p>Deslocamento: {demoOffsetDays >= 0 ? `+${demoOffsetDays}` : demoOffsetDays} dia(s)</p>
          <div className="demo-actions">
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
          <div className="phone-notch" aria-hidden="true" />

          <div className="app-frame">
            <main className="content-grid app-content">
              <header className="app-topbar">
                <div className="hero-copy">
                  <span className="eyebrow">{eyebrow}</span>
                  <h1>{title}</h1>
                </div>
                {actions ? <div className="toolbar toolbar-mobile">{actions}</div> : null}
              </header>

              {children}
            </main>
            {overlay}

            {shellMode === 'app' ? (
              <nav className="bottom-nav" aria-label="Navegacao principal">
                {appShellNavItems.map((item) => (
                  <NavLink key={item.to} to={item.to} className="nav-item">
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
