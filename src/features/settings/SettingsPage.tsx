import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { isNativePlatform } from '../../core/platform/capacitor'
import {
  Crown,
  KeyRound,
  Landmark,
  MonitorSmartphone,
  ShieldCheck,
  TriangleAlert,
  UserRound,
  ChevronRight,
  CircleUserRound,
  LogOut,
} from 'lucide-react'

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
  const {
    state,
    demoNow,
    demoOffsetDays,
    markSyncNow,
    logoutAccount,
    shiftDemoDays,
    resetDemoClock,
  } = useAppState()
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)

  const account = state.account
  const backupStatusLabel = getBackupStatusLabel(state.backup.status)
  const previewMode =
    typeof window !== 'undefined' &&
    window.localStorage.getItem('coruja-shell-preview-mode') === 'preview'

  function togglePreviewMode() {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem('coruja-shell-preview-mode', previewMode ? 'dev' : 'preview')
    window.location.reload()
  }

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
    <AppShell
      title="Configurações"
      eyebrow=""
      contentClassName="app-content-settings"
    >
      <section className="settings-stack home-flow">
        <article className="info-card highlight-card settings-profile-card">
          <div className="settings-profile-header">
            <div className="settings-avatar" aria-hidden="true">
              {(state.profile.name || 'Usuario').trim().slice(0, 1).toUpperCase()}
            </div>

            <div className="settings-profile-meta">
              <strong className="settings-profile-name">
                {state.profile.name || 'Usuário'}
              </strong>
              <span className="settings-profile-email">
                {account?.email ?? 'Conta ainda não conectada'}
              </span>
            </div>

            <button
              className="button button-secondary settings-edit-btn"
              type="button"
              onClick={() => navigate('/account/required')}
            >
              Editar
            </button>
          </div>

          <div className="settings-premium-banner">
            <div className="settings-premium-icon" aria-hidden="true">
              <Crown size={18} strokeWidth={2.2} />
            </div>
            <div className="settings-premium-copy">
              <strong>{state.hasProAccess ? 'Premium Account' : 'Conta gratuita'}</strong>
              <span>
                {state.hasProAccess
                  ? 'Recursos premium ativos no seu ritmo.'
                  : 'Ative o Premium para desbloquear recursos.'}
              </span>
            </div>
          </div>
        </article>

        <div className="settings-subsection-title">Configurações da conta</div>

        <article className="info-card settings-options-card">
          <button className="settings-option-row" type="button" onClick={() => navigate('/account/required')}>
            <div className="settings-option-left">
              <CircleUserRound size={18} strokeWidth={2.2} />
              <span>Informações da conta</span>
            </div>
            <ChevronRight size={18} strokeWidth={2.2} />
          </button>

          <div className="settings-option-row settings-option-row-disabled" role="presentation" aria-disabled="true">
            <div className="settings-option-left">
              <KeyRound size={18} strokeWidth={2.2} />
              <span>Alterar senha</span>
            </div>
            <ChevronRight size={18} strokeWidth={2.2} />
          </div>

          <div className="settings-option-row settings-option-row-disabled" role="presentation" aria-disabled="true">
            <div className="settings-option-left">
              <MonitorSmartphone size={18} strokeWidth={2.2} />
              <span>Dispositivo</span>
            </div>
            <ChevronRight size={18} strokeWidth={2.2} />
          </div>

          <div className="settings-option-row settings-option-row-disabled" role="presentation" aria-disabled="true">
            <div className="settings-option-left">
              <Landmark size={18} strokeWidth={2.2} />
              <span>Conectar bancos</span>
            </div>
            <ChevronRight size={18} strokeWidth={2.2} />
          </div>
        </article>

        <div className="settings-subsection-title">Preferências</div>

        <article className="info-card settings-options-card">
          <Link className="settings-option-row" to="/blocker">
            <div className="settings-option-left">
              <ShieldCheck size={18} strokeWidth={2.2} />
              <span>Bloqueador</span>
            </div>
            <ChevronRight size={18} strokeWidth={2.2} />
          </Link>

          <Link className="settings-option-row" to="/sos">
            <div className="settings-option-left">
              <TriangleAlert size={18} strokeWidth={2.2} />
              <span>SOS / Pânico</span>
            </div>
            <ChevronRight size={18} strokeWidth={2.2} />
          </Link>

          <button
            className="settings-option-row settings-option-row-action"
            type="button"
            onClick={() => setIsDemoModalOpen(true)}
          >
            <div className="settings-option-left">
              <UserRound size={18} strokeWidth={2.2} />
              <span>Ferramentas demo</span>
            </div>
            <ChevronRight size={18} strokeWidth={2.2} />
          </button>
        </article>

        <article className="info-card settings-options-card">
          <div className="settings-section-head">
            <div className="settings-section-title">Backup e sync</div>
            <div className="settings-section-meta">{backupStatusLabel}</div>
          </div>

          <button className="settings-option-row settings-option-row-action settings-option-row-inline" type="button" onClick={() => void markSyncNow()}>
            <div className="settings-option-left">
              <CircleUserRound size={18} strokeWidth={2.2} />
              <span>Sincronizar agora</span>
            </div>
            <ChevronRight size={18} strokeWidth={2.2} />
          </button>

          {!account ? (
            <Link className="settings-option-row settings-option-row-inline" to="/account/required">
              <div className="settings-option-left">
                <Crown size={18} strokeWidth={2.2} />
                <span>Vincular conta</span>
              </div>
              <ChevronRight size={18} strokeWidth={2.2} />
            </Link>
          ) : null}
        </article>

        <article className="info-card settings-options-card">
          <div className="settings-section-head">
            <div className="settings-section-title">Sair</div>
            <div className="settings-section-meta">Limpa cache local</div>
          </div>

          <button className="settings-logout-row" type="button" onClick={() => void handleLogout()}>
            <div className="settings-option-left">
              <LogOut size={18} strokeWidth={2.2} />
              <span>Fazer logout</span>
            </div>
          </button>
        </article>
      </section>

      {!isNativePlatform && isDemoModalOpen ? (
        <div className="modal-overlay" onClick={() => setIsDemoModalOpen(false)}>
          <div className="modal-content settings-demo-modal" onClick={(event) => event.stopPropagation()}>
            <span className="section-label">Demo</span>
            <h2>Painel de teste</h2>
            <p>Modo atual: {previewMode ? 'preview com moldura' : 'desenvolvimento sem moldura'}</p>
            <p>
              Data simulada: {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(demoNow)}
            </p>
            <p>Deslocamento: {demoOffsetDays >= 0 ? `+${demoOffsetDays}` : demoOffsetDays} dia(s)</p>
            <div className="demo-actions settings-demo-actions">
              <button className="button button-secondary" onClick={togglePreviewMode}>
                {previewMode ? 'Usar modo dev' : 'Ver moldura'}
              </button>
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
              <button
                className="button button-primary"
                onClick={async () => {
                  setIsDemoModalOpen(false)
                  await logoutAccount(null)
                  navigate('/pre-purchase', { replace: true })
                }}
              >
                Voltar ao pre-compra
              </button>
              <button className="button button-secondary" onClick={() => setIsDemoModalOpen(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  )
}
