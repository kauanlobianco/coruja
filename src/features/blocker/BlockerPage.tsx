import { useMemo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Globe, Plus, ShieldCheck, ShieldOff, Trash2 } from 'lucide-react'
import { Capacitor } from '@capacitor/core'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
import { appRoutes } from '../../core/config/routes'
import {
  checkBlockerPermission,
  getBlockerVpnStatus,
  isBlockerVpnRunning,
  requestBlockerPermission,
  startBlockerVpn,
  stopBlockerVpn,
} from './blocker-native'
import {
  DEFAULT_BLOCKED_DOMAINS,
  normalizeDomainInput,
} from './blocked-domains'
import { BackgroundCircles } from '../../components/ui/BackgroundCircles'

export function BlockerPage() {
  const navigate = useNavigate()
  const { state, setBlockerEnabled, setBlockedDomains } = useAppState()
  const [customInput, setCustomInput] = useState('')
  const [permissionGranted, setPermissionGranted] = useState(false)
  // Inicializa com o valor persistido para evitar flash de "inativo" ao navegar
  const [vpnActive, setVpnActive] = useState(state.blocker.isEnabled)
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const userDomains = useMemo(
    () => state.blocker.blockedDomains.filter((d) => !DEFAULT_BLOCKED_DOMAINS.includes(d)),
    [state.blocker.blockedDomains],
  )

  // Domínios reais a enviar para o VPN = personalizados + padrões
  const allDomains = useMemo(() => {
    const custom = state.blocker.blockedDomains.filter((d) => !DEFAULT_BLOCKED_DOMAINS.includes(d))
    return [...DEFAULT_BLOCKED_DOMAINS, ...custom]
  }, [state.blocker.blockedDomains])

  useEffect(() => {
    let active = true
    async function syncNativeStatus() {
      setLoadingStatus(true)
      try {
        const [permission, vpnStatus, running] = await Promise.all([
          checkBlockerPermission(),
          getBlockerVpnStatus(),
          isBlockerVpnRunning(),
        ])
        if (!active) return
        setPermissionGranted(permission.granted)
        // No web, a VPN nativa sempre retorna false — confiar no estado persistido
        if (!Capacitor.isNativePlatform()) return
        const nativeActive = vpnStatus.active || running.running
        setVpnActive(nativeActive)
        if (nativeActive !== state.blocker.isEnabled) {
          await setBlockerEnabled(nativeActive)
        }
      } catch {
        if (!active) return
        setError('Não foi possível ler o estado do bloqueador.')
      } finally {
        if (active) setLoadingStatus(false)
      }
    }
    void syncNativeStatus()
    return () => { active = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addCustomDomain() {
    const normalized = normalizeDomainInput(customInput)
    if (!normalized || allDomains.includes(normalized)) {
      setCustomInput('')
      return
    }
    void setBlockedDomains([...allDomains, normalized])
    setCustomInput('')
  }

  function removeDomain(domain: string) {
    void setBlockedDomains(allDomains.filter((d) => d !== domain))
  }

  async function handleRequestPermission() {
    setBusy(true)
    setError('')
    try {
      const result = await requestBlockerPermission()
      setPermissionGranted(result.granted)
      if (!result.granted) setError('A permissão VPN ainda não foi concedida.')
    } catch {
      setError('Não foi possível solicitar a permissão VPN.')
    } finally {
      setBusy(false)
    }
  }

  async function handleToggleProtection() {
    if (busy || loadingStatus) return
    setBusy(true)
    setError('')
    try {
      if (!permissionGranted) {
        const permission = await requestBlockerPermission()
        setPermissionGranted(permission.granted)
        if (!permission.granted) {
          setError('Sem permissão VPN, o bloqueador não pode ser ativado.')
          return
        }
      }
      if (vpnActive) {
        await stopBlockerVpn()
        await setBlockerEnabled(false)
        setVpnActive(false)
        return
      }
      await startBlockerVpn(allDomains)
      await setBlockerEnabled(true)
      setVpnActive(true)
    } catch {
      setError('Não foi possível alternar o bloqueador agora.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell
      title="Bloqueador"
      leading={
        <button className="app-back-button" type="button" onClick={() => navigate(appRoutes.home)}>
          <ChevronLeft size={18} strokeWidth={2.2} />
        </button>
      }
    >

      {/* 1 ── Círculos + escudo ──────────────────────────── */}
      <div className="blocker-circles-wrap">
        <BackgroundCircles variant={vpnActive ? 'active' : 'inactive'}>
          {vpnActive
            ? <ShieldCheck size={64} strokeWidth={1.4} />
            : <ShieldOff  size={64} strokeWidth={1.4} />
          }
          <p className="bg-circles-status-label">
            {loadingStatus ? 'VERIFICANDO…' : vpnActive ? 'PROTEÇÃO ATIVA' : 'DESPROTEGIDO'}
          </p>
          <p className="bg-circles-status-sub">
            {vpnActive
              ? 'Sites bloqueados em segundo plano'
              : 'Ative para bloquear conteúdo indesejado'}
          </p>
        </BackgroundCircles>
      </div>

      {/* 2 ── Toggle switch ──────────────────────────────── */}
      <div className="blocker-toggle-row">
        <button
          type="button"
          role="switch"
          aria-checked={vpnActive ? 'true' : 'false'}
          aria-label={vpnActive ? 'Desativar proteção' : 'Ativar proteção'}
          className={`blocker-switch-track ${vpnActive ? 'blocker-switch-track--on' : 'blocker-switch-track--off'}`}
          onClick={() => void handleToggleProtection()}
          disabled={busy || loadingStatus}
        >
          <motion.div
            className="blocker-switch-thumb"
            animate={{ x: vpnActive ? 34 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
        <div className="blocker-toggle-label">
          <span className="blocker-toggle-label-title">Proteção</span>
          <span className={`blocker-toggle-label-state ${vpnActive ? 'blocker-toggle-label-state--on' : 'blocker-toggle-label-state--off'}`}>
            {vpnActive ? 'Ativa' : 'Inativa'}
          </span>
        </div>
      </div>

      {/* 3 ── Cards de info ──────────────────────────────── */}
      <div className="blocker-info-row">
        <div className="blocker-info-card">
          <span className="blocker-info-value">{userDomains.length}</span>
          <span className="blocker-info-label">PERSONALIZADOS</span>
        </div>
        <div className="blocker-info-card">
          <span className={`blocker-info-value ${vpnActive ? 'blocker-info-value--on' : 'blocker-info-value--off'}`}>
            {loadingStatus ? '—' : vpnActive ? 'Ativa' : 'Inativa'}
          </span>
          <span className="blocker-info-label">STATUS</span>
        </div>
      </div>

      {/* ── Permissão VPN pendente ─────────────────────── */}
      {!permissionGranted && !loadingStatus && (
        <div className="blocker-permission-banner">
          <p className="blocker-permission-text">
            Permissão VPN necessária para ativar o bloqueador.
          </p>
          <button
            type="button"
            className="blocker-permission-btn"
            onClick={() => void handleRequestPermission()}
            disabled={busy}
          >
            Conceder permissão
          </button>
        </div>
      )}

      {error ? <p className="toast toast-error">{error}</p> : null}

      {/* 4 ── Sites personalizados ────────────────────── */}
      <div className="blocker-domains-card">
        <div className="blocker-domains-header">
          <p className="blocker-domains-title">Sites Personalizados</p>
          <p className="blocker-domains-sub">Sites extras adicionados por você</p>
        </div>

        <div className="blocker-add-row">
          <input
            className="blocker-input"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); addCustomDomain() }
            }}
            placeholder="ex: reddit.com"
          />
          <button
            type="button"
            className="blocker-add-btn"
            onClick={addCustomDomain}
            disabled={!customInput.trim()}
            aria-label="Adicionar site"
          >
            <Plus size={18} strokeWidth={2.4} />
          </button>
        </div>

        {userDomains.length === 0 ? (
          <p className="blocker-empty-inline">Nenhum site adicionado ainda.</p>
        ) : (
          <div className="blocker-domain-list">
            {userDomains.map((domain) => (
              <div key={domain} className="blocker-domain-item">
                <Globe size={13} className="blocker-domain-globe" />
                <span className="blocker-domain-name">{domain}</span>
                <button
                  type="button"
                  className="blocker-domain-remove"
                  onClick={() => removeDomain(domain)}
                  aria-label={`Remover ${domain}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </AppShell>
  )
}
