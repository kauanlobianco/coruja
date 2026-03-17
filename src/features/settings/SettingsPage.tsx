import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { isNativePlatform, platform } from '../../core/platform/capacitor'

const premiumBenefits = [
  'Check-in diario com historico',
  'Journal e reflexao de recaida',
  'Analytics de evolucao',
  'SOS/Panico com suporte rapido',
  'Bloqueador Android',
  'Backup e restauracao na nuvem',
]

function formatDateTime(value: string | null) {
  if (!value) {
    return 'Ainda nao aconteceu'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(parsed)
}

function formatMonthYear(value: string | null) {
  if (!value) {
    return 'Ainda nao registrado'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(parsed)
}

function getBackupStatusLabel(status: 'idle' | 'uploading' | 'restoring' | 'conflict' | 'error') {
  switch (status) {
    case 'uploading':
      return 'Sincronizando agora'
    case 'restoring':
      return 'Restaurando backup'
    case 'conflict':
      return 'Sessao encerrada por outro dispositivo'
    case 'error':
      return 'Precisa de atencao'
    default:
      return 'Tudo em ordem'
  }
}

export function SettingsPage() {
  const navigate = useNavigate()
  const { state, markSyncNow, logoutAccount } = useAppState()

  const account = state.account
  const backupStatusLabel = getBackupStatusLabel(state.backup.status)
  const joinedLabel = formatMonthYear(state.profile.joinedAt)
  const planName = state.hasProAccess ? 'Plano Premium' : 'Sem assinatura ativa'
  const blockerDomainsCount = state.blocker.blockedDomains.length
  const hasAccount = Boolean(account)
  const hasRemoteBackup = state.backup.hasRemoteBackup

  async function handleLogout() {
    const confirmed = window.confirm(
      'Ao sair, este aparelho vai limpar o cache local e voltar para a landing. Seus dados em nuvem permanecem na conta. Deseja continuar?',
    )

    if (!confirmed) {
      return
    }

    await logoutAccount(null)
    navigate('/pre-purchase', { replace: true })
  }

  return (
    <AppShell title="Settings" eyebrow="Conta e produto">
      <section className="panel-stack">
        <article className="info-card highlight-card">
          <span className="section-label">Profile</span>
          <h2>Seu perfil dentro do app</h2>
          <p>
            Esta area concentra as informacoes que o usuario enxerga como identidade de conta,
            nao como diagnostico tecnico.
          </p>
          <dl className="home-stats-grid">
            <div>
              <dt>Nome</dt>
              <dd>{state.profile.name || 'Usuario'}</dd>
            </div>
            <div>
              <dt>Idade</dt>
              <dd>{state.profile.age ?? 'Nao informada'}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{account?.email ?? 'Conta ainda nao conectada'}</dd>
            </div>
            <div>
              <dt>Entrou em</dt>
              <dd>{joinedLabel}</dd>
            </div>
          </dl>
          {!hasAccount ? (
            <p className="warning-banner">
              Esta sessao ainda esta sem conta vinculada. O app continua local, mas sem restauracao
              em outro dispositivo.
            </p>
          ) : null}
        </article>

        <article className="info-card">
          <span className="section-label">Manage subscription</span>
          <h2>{planName}</h2>
          <p>
            Aqui o usuario entende rapidamente qual plano esta ativo e o que ele libera no
            produto.
          </p>
          {!state.hasProAccess ? (
            <p className="warning-banner">
              Nenhuma assinatura ativa foi marcada nesta sessao. Os beneficios abaixo mostram o
              pacote previsto do produto.
            </p>
          ) : null}
          <div className="timeline-list">
            {premiumBenefits.map((benefit) => (
              <div key={benefit} className="timeline-item">
                <strong>{benefit}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="info-card">
          <span className="section-label">Backup e sync</span>
          <h2>Seus dados protegidos na nuvem</h2>
          <dl className="home-stats-grid">
            <div>
              <dt>Status do backup</dt>
              <dd>{backupStatusLabel}</dd>
            </div>
            <div>
              <dt>Ultimo sync</dt>
              <dd>{formatDateTime(account?.lastBackupAt ?? null)}</dd>
            </div>
            <div>
              <dt>Ultimo restore</dt>
              <dd>{formatDateTime(account?.lastRestoreAt ?? null)}</dd>
            </div>
            <div>
              <dt>Heartbeat</dt>
              <dd>{formatDateTime(account?.lastLeaseRefreshAt ?? null)}</dd>
            </div>
          </dl>
          {state.backup.lastError ? <p className="warning-banner">{state.backup.lastError}</p> : null}
          {!hasRemoteBackup && hasAccount && !state.backup.lastError ? (
            <p className="warning-banner">
              Esta conta ja esta vinculada, mas ainda nao temos confirmacao de backup remoto salvo.
            </p>
          ) : null}
          <div className="toolbar">
            <button className="button button-primary" onClick={() => void markSyncNow()}>
              Sincronizar agora
            </button>
            {!account ? (
              <Link className="button button-secondary" to="/account/required">
                Vincular conta
              </Link>
            ) : null}
          </div>
        </article>

        <article className="info-card">
          <span className="section-label">Seguranca</span>
          <h2>Protecao e sessao deste dispositivo</h2>
          <dl className="home-stats-grid">
            <div>
              <dt>Bloqueador</dt>
              <dd>{state.blocker.isEnabled ? 'Ligado' : 'Desligado'}</dd>
            </div>
            <div>
              <dt>Dominios protegidos</dt>
              <dd>{blockerDomainsCount || 0}</dd>
            </div>
            <div>
              <dt>Ambiente</dt>
              <dd>{platform}</dd>
            </div>
            <div>
              <dt>Plataforma</dt>
              <dd>{isNativePlatform ? 'Capacitor' : 'Web'}</dd>
            </div>
          </dl>
          <div className="toolbar">
            <Link className="button button-secondary" to="/blocker">
              Abrir bloqueador
            </Link>
            <Link className="button button-secondary" to="/sos">
              Abrir panico
            </Link>
          </div>
        </article>

        <article className="info-card">
          <span className="section-label">Logout</span>
          <h2>Sair desta conta</h2>
          <p>
            Ao sair, o app limpa o cache local deste aparelho e retorna voce para a landing. O
            backup remoto continua salvo na conta.
          </p>
          <button className="button button-secondary" onClick={() => void handleLogout()}>
            Fazer logout
          </button>
        </article>
      </section>
    </AppShell>
  )
}
