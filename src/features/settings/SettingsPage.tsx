import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { isNativePlatform, platform } from '../../core/platform/capacitor'

export function SettingsPage() {
  const { state, resetApp } = useAppState()

  return (
    <AppShell title="Ambiente e reset seguro" eyebrow="Settings">
      <section className="card-grid">
        <article className="info-card">
          <span className="section-label">Runtime</span>
          <h2>{isNativePlatform ? 'Capacitor' : 'Web'}</h2>
          <p>Plataforma atual: {platform}</p>
          <p>
            Aqui entram depois diagnóstico nativo, permissões, restore de compra
            e sync manual.
          </p>
        </article>

        <article className="info-card">
          <span className="section-label">Snapshot</span>
          <h2>{state.profile.name || 'Sem perfil'}</h2>
          <p>
            Gatilhos: {state.profile.triggers.length || 0} | Motivações:{' '}
            {state.profile.motivations.length || 0}
          </p>
          <p>Ultimo sync: {state.lastSyncAt ?? 'nenhum'}</p>
        </article>
      </section>

      <section className="info-card">
        <span className="section-label">Manutencao</span>
        <h2>Resetar a base</h2>
        <p>
          Durante o bootstrap isso ajuda a validar o fluxo limpo sem depender do
          legado.
        </p>
        <button className="button button-secondary" onClick={() => void resetApp()}>
          Limpar estado local
        </button>
      </section>
    </AppShell>
  )
}
