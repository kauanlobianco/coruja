import { useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'

export function BlockedPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { state, registerBlockedAttempt } = useAppState()

  const blockedSite = useMemo(
    () => params.get('site') ?? params.get('url') ?? 'site bloqueado',
    [params],
  )

  useEffect(() => {
    void registerBlockedAttempt(blockedSite)
  }, [blockedSite, registerBlockedAttempt])

  return (
    <AppShell title="Acesso bloqueado" eyebrow="Protecao ativa" shellMode="system">
      <section className="info-card highlight-card">
        <span className="section-label">Bloqueador Android</span>
        <h2>{blockedSite}</h2>
        <p>
          Esse dominio entrou na lista protegida do app e foi interrompido antes de abrir.
        </p>
        <p>
          Streak atual: {state.streak.current} dias | Motivos salvos:{' '}
          {state.profile.motivations.length}
        </p>
        <div className="hero-actions">
          <button className="button button-primary" onClick={() => navigate('/sos')}>
            Abrir SOS
          </button>
          <button className="button button-secondary" onClick={() => navigate('/app')}>
            Voltar ao app
          </button>
          <button className="button button-secondary" onClick={() => navigate('/blocker')}>
            Revisar bloqueador
          </button>
        </div>
      </section>

      {state.profile.motivations.length > 0 ? (
        <section className="info-card">
          <span className="section-label">Seus motivos</span>
          <h2>Lembretes do seu onboarding</h2>
          <div className="timeline-list">
            {state.profile.motivations.slice(0, 5).map((motivation) => (
              <div key={motivation} className="timeline-item">
                <strong>{motivation}</strong>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </AppShell>
  )
}
