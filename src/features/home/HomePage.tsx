import { useNavigate } from 'react-router-dom'
import { productModules } from '../../core/config/modules'
import { useAppState } from '../../app/state/use-app-state'
import { ModuleCard } from '../../shared/components/ModuleCard'
import { AppShell } from '../../shared/layout/AppShell'

export function HomePage() {
  const navigate = useNavigate()
  const { state, setBlockerEnabled, markSyncNow } = useAppState()

  return (
    <AppShell
      title="Arquitetura pronta para Android e iOS"
      eyebrow="Nova base"
      actions={
        <>
          <button
            className="button button-secondary"
            onClick={() => void setBlockerEnabled(!state.blockerEnabled)}
          >
            Bloqueador: {state.blockerEnabled ? 'ligado' : 'desligado'}
          </button>
          <button
            className="button button-primary"
            onClick={() => void markSyncNow()}
          >
            Marcar sync
          </button>
        </>
      }
    >
      <section className="info-card highlight-card">
        <span className="section-label">Estado central</span>
        <h2>{state.profile.name || 'Usuario ainda nao configurado'}</h2>
        <p>
          Um único snapshot persistido concentra onboarding, monetização,
          bloqueador e sincronização. Isso substitui a mistura anterior entre
          HTML solto, `localStorage`, `Preferences` e bridges.
        </p>
        <dl className="stats-grid">
          <div>
            <dt>Objetivo</dt>
            <dd>{state.profile.goalDays} dias</dd>
          </div>
          <div>
            <dt>Assinatura</dt>
            <dd>{state.hasProAccess ? 'Pro' : 'Free'}</dd>
          </div>
          <div>
            <dt>Ultimo sync</dt>
            <dd>{state.lastSyncAt ? 'Registrado' : 'Pendente'}</dd>
          </div>
        </dl>
      </section>

      <section className="panel-stack">
        <div className="section-header">
          <div>
            <span className="section-label">Roadmap inicial</span>
            <h2>O que ficou do legado</h2>
          </div>
          <button
            className="text-link"
            onClick={() => navigate('/pre-purchase')}
          >
            Revisar funil pré-compra
          </button>
        </div>

        <div className="card-grid">
          {productModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>
    </AppShell>
  )
}
