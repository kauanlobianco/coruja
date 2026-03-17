import { Link } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { isNativePlatform, platform } from '../../core/platform/capacitor'

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
  const { state, markSyncNow, logoutAccount, resetApp } = useAppState()

  const account = state.account
  const blockerDomainsCount = state.blocker.blockedDomains.length
  const backupStatusLabel = getBackupStatusLabel(state.backup.status)

  return (
    <AppShell title="Conta, backup e seguranca" eyebrow="Settings">
      <section className="panel-stack">
        <article className="info-card highlight-card">
          <span className="section-label">Conta e backup</span>
          <h2>{account ? 'Sua conta esta protegendo seus dados' : 'Nenhuma conta vinculada'}</h2>
          <p>
            Aqui fica o centro da conta do usuario: associacao da compra,
            backup na nuvem e restauracao em outro dispositivo.
          </p>
          <dl className="home-stats-grid">
            <div>
              <dt>Email</dt>
              <dd>{account?.email ?? 'Conta ainda nao conectada'}</dd>
            </div>
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
          </dl>
          {state.backup.lastError ? (
            <p className="warning-banner">{state.backup.lastError}</p>
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
          <span className="section-label">Protecao</span>
          <h2>Bloqueador e rotina de seguranca</h2>
          <p>
            O bloqueador continua sendo uma das camadas mais criticas do app.
            Aqui o usuario entende rapido se a protecao esta ligada e se a rotina
            esta sendo sustentada.
          </p>
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
              <dt>Tentativas bloqueadas</dt>
              <dd>{state.blocker.blockedAttempts.length}</dd>
            </div>
            <div>
              <dt>Sessoes SOS</dt>
              <dd>{state.sos.totalSessions}</dd>
            </div>
          </dl>
          <div className="toolbar">
            <Link className="button button-secondary" to="/blocker">
              Abrir bloqueador
            </Link>
            <Link className="button button-secondary" to="/sos">
              Abrir SOS
            </Link>
          </div>
        </article>
      </section>

      <section className="panel-stack">
        <article className="info-card">
          <span className="section-label">Sessao</span>
          <h2>Acesso deste dispositivo</h2>
          <p>
            A conta fica ativa em um dispositivo por vez. Se outro aparelho
            assumir a sessao, esta tela ajuda a explicar o estado atual.
          </p>
          <dl className="stats-grid">
            <div>
              <dt>Heartbeat</dt>
              <dd>{formatDateTime(account?.lastLeaseRefreshAt ?? null)}</dd>
            </div>
            <div>
              <dt>Plataforma</dt>
              <dd>{isNativePlatform ? 'Capacitor' : 'Web'}</dd>
            </div>
            <div>
              <dt>Ambiente</dt>
              <dd>{platform}</dd>
            </div>
          </dl>
          <button className="button button-secondary" onClick={() => void logoutAccount()}>
            Sair desta conta
          </button>
        </article>

        <article className="info-card">
          <span className="section-label">Dados locais</span>
          <h2>Limpeza segura para testes e suporte</h2>
          <p>
            Use esta acao apenas quando quiser reiniciar o app neste aparelho.
            Se a conta estiver vinculada, os dados continuam protegidos no backup
            remoto.
          </p>
          <button className="button button-secondary" onClick={() => void resetApp()}>
            Limpar estado local
          </button>
        </article>
      </section>
    </AppShell>
  )
}
