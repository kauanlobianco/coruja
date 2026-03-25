import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'

export function AccountRequiredPage() {
  const navigate = useNavigate()

  return (
    <AppShell
      title="Crie sua conta"
      eyebrow="Quase lá"
      shellMode="entry"
    >
      <section className="info-card highlight-card">
        <span className="section-label">Próximo passo</span>
        <h2>Crie sua conta para começar</h2>
        <p>
          Sua conta protege seu progresso e garante acesso ao app em qualquer
          dispositivo. Leva menos de um minuto.
        </p>
        <div className="hero-actions">
          <button
            className="button button-orange shimmer"
            onClick={() => navigate('/account/auth?mode=signup&signupOnly=1')}
          >
            Criar conta e continuar
          </button>
        </div>
      </section>
    </AppShell>
  )
}
