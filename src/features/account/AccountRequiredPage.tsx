import { useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { hasSupabaseEnv } from '../../core/remote/supabase'

export function AccountRequiredPage() {
  const navigate = useNavigate()

  return (
    <AppShell
      title="Conta obrigatoria antes do onboarding"
      eyebrow="Conta e backup"
      shellMode="entry"
    >
      <section className="info-card highlight-card">
        <span className="section-label">Nova regra do produto</span>
        <h2>Seu cadastro vem antes do app principal</h2>
        <p>
          Depois da compra, o proximo passo e criar a conta que vai receber esse
          progresso e esse acesso. O onboarding so continua depois disso.
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

      <section className="info-card">
        <span className="section-label">Status tecnico</span>
        <h2>{hasSupabaseEnv() ? 'Supabase configurado' : 'Supabase ainda nao configurado'}</h2>
        <p>
          Sem as variaveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`, o
          fluxo autentica visualmente mas nao consegue sincronizar de verdade.
        </p>
      </section>
    </AppShell>
  )
}
