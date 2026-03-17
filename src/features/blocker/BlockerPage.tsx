import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '../../shared/layout/AppShell'
import { useAppState } from '../../app/state/use-app-state'
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

export function BlockerPage() {
  const { state, setBlockerEnabled, setBlockedDomains } = useAppState()
  const [customInput, setCustomInput] = useState('')
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [vpnActive, setVpnActive] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const blockedDomains =
    state.blocker.blockedDomains.length > 0
      ? state.blocker.blockedDomains
      : DEFAULT_BLOCKED_DOMAINS

  const customDomains = useMemo(
    () => blockedDomains.filter((domain) => !DEFAULT_BLOCKED_DOMAINS.includes(domain)),
    [blockedDomains],
  )

  useEffect(() => {
    let active = true

    async function loadStatus() {
      setLoadingStatus(true)

      try {
        const [permission, vpnStatus, running] = await Promise.all([
          checkBlockerPermission(),
          getBlockerVpnStatus(),
          isBlockerVpnRunning(),
        ])

        if (!active) {
          return
        }

        setPermissionGranted(permission.granted)
        setVpnActive(vpnStatus.active || running.running)
      } catch {
        if (!active) {
          return
        }

        setError('Nao foi possivel ler o estado atual do bloqueador.')
      } finally {
        if (active) {
          setLoadingStatus(false)
        }
      }
    }

    void loadStatus()

    return () => {
      active = false
    }
  }, [])

  function toggleDefaultDomain(domain: string) {
    const nextDomains = blockedDomains.includes(domain)
      ? blockedDomains.filter((item) => item !== domain)
      : [...blockedDomains, domain]

    void setBlockedDomains(nextDomains)
  }

  function addCustomDomain() {
    const normalized = normalizeDomainInput(customInput)
    if (!normalized || blockedDomains.includes(normalized)) {
      setCustomInput('')
      return
    }

    void setBlockedDomains([...blockedDomains, normalized])
    setCustomInput('')
  }

  function removeDomain(domain: string) {
    void setBlockedDomains(blockedDomains.filter((item) => item !== domain))
  }

  async function handleRequestPermission() {
    setBusy(true)
    setError('')
    setMessage('')

    try {
      const result = await requestBlockerPermission()
      setPermissionGranted(result.granted)

      if (result.granted) {
        setMessage('Permissao VPN concedida.')
      } else {
        setError('A permissao VPN ainda nao foi concedida.')
      }
    } catch {
      setError('Nao foi possivel solicitar a permissao VPN.')
    } finally {
      setBusy(false)
    }
  }

  async function handleToggleProtection() {
    setBusy(true)
    setError('')
    setMessage('')

    try {
      if (!permissionGranted) {
        const permission = await requestBlockerPermission()
        setPermissionGranted(permission.granted)

        if (!permission.granted) {
          setError('Sem permissao VPN, o bloqueador nao pode ser ativado.')
          return
        }
      }

      if (vpnActive) {
        await stopBlockerVpn()
        await setBlockerEnabled(false)
        setVpnActive(false)
        setMessage('Bloqueador Android desativado.')
        return
      }

      const domainsToStart = blockedDomains.length > 0 ? blockedDomains : DEFAULT_BLOCKED_DOMAINS
      await setBlockedDomains(domainsToStart)
      await startBlockerVpn(domainsToStart)
      await setBlockerEnabled(true)
      setVpnActive(true)
      setMessage('Bloqueador Android ativado.')
    } catch {
      setError('Nao foi possivel alternar o bloqueador agora.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AppShell title="Bloqueador Android" eyebrow="Infra critica">
      <section className="info-card highlight-card">
        <span className="section-label">Status</span>
        <h2>{vpnActive ? 'Protecao ativa' : 'Protecao desligada'}</h2>
        <p>
          Esta feature usa uma VPN local no Android para interceptar DNS e bloquear os
          dominios configurados.
        </p>
        <p>
          Permissao VPN: {permissionGranted ? 'concedida' : 'pendente'} | Dominios:{' '}
          {blockedDomains.length}
        </p>
        <div className="hero-actions">
          <button
            className="button button-secondary"
            onClick={() => void handleRequestPermission()}
            disabled={busy}
          >
            Solicitar permissao
          </button>
          <button
            className="button button-primary"
            onClick={() => void handleToggleProtection()}
            disabled={busy || loadingStatus}
          >
            {busy ? 'Processando...' : vpnActive ? 'Desativar bloqueador' : 'Ativar bloqueador'}
          </button>
        </div>
        {message ? <p>{message}</p> : null}
        {error ? <p>{error}</p> : null}
      </section>

      <section className="info-card">
        <span className="section-label">Sites padrao</span>
        <h2>Lista base do app</h2>
        <div className="chip-row">
          {DEFAULT_BLOCKED_DOMAINS.map((domain) => (
            <button
              key={domain}
              className={blockedDomains.includes(domain) ? 'chip active' : 'chip'}
              onClick={() => toggleDefaultDomain(domain)}
            >
              {domain}
            </button>
          ))}
        </div>
      </section>

      <section className="info-card">
        <span className="section-label">Sites personalizados</span>
        <h2>Complementos da sua lista</h2>
        <div className="hero-actions">
          <input
            value={customInput}
            onChange={(event) => setCustomInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                addCustomDomain()
              }
            }}
            placeholder="ex: reddit.com"
          />
          <button className="button button-secondary" onClick={addCustomDomain}>
            Adicionar dominio
          </button>
        </div>

        {customDomains.length === 0 ? (
          <p>Nenhum dominio personalizado adicionado.</p>
        ) : (
          <div className="timeline-list">
            {customDomains.map((domain) => (
              <div key={domain} className="timeline-item">
                <strong>{domain}</strong>
                <button
                  className="text-link"
                  onClick={() => removeDomain(domain)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="info-card">
        <span className="section-label">Historico</span>
        <h2>Tentativas bloqueadas</h2>
        {state.blocker.blockedAttempts.length === 0 ? (
          <p>Nenhuma tentativa registrada ainda.</p>
        ) : (
          <div className="timeline-list">
            {[...state.blocker.blockedAttempts]
              .slice(-5)
              .reverse()
              .map((attempt) => (
                <div key={attempt.id} className="timeline-item">
                  <strong>{attempt.url}</strong>
                  <p>{new Date(attempt.createdAt).toLocaleString('pt-BR')}</p>
                </div>
              ))}
          </div>
        )}
      </section>
    </AppShell>
  )
}
