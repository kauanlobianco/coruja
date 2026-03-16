import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'

export function PaywallPage() {
  const { state, setProAccess } = useAppState()

  return (
    <AppShell title="Monetizacao desacoplada" eyebrow="Paywall">
      <section className="pricing-grid">
        <article className="info-card">
          <span className="section-label">Free</span>
          <h2>Base inicial</h2>
          <p>
            Onboarding, dashboard, check-in e sync local antes de ligar qualquer
            dependência de assinatura.
          </p>
        </article>

        <article className="info-card highlight-card">
          <span className="section-label">Pro</span>
          <h2>Assinatura pronta para RevenueCat</h2>
          <p>
            O paywall agora é uma feature isolada. Ele não controla mais toda a
            navegação do app.
          </p>
          <button
            className="button button-primary"
            onClick={() => void setProAccess(!state.hasProAccess)}
          >
            {state.hasProAccess ? 'Voltar para Free' : 'Simular Pro'}
          </button>
        </article>
      </section>
    </AppShell>
  )
}
