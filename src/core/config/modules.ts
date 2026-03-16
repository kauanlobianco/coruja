export interface ModuleDefinition {
  id: string
  title: string
  description: string
  status: 'ready' | 'next' | 'later'
}

export const productModules: ModuleDefinition[] = [
  {
    id: 'onboarding',
    title: 'Onboarding unico',
    description: 'Entrada, perfil inicial e preferências num único fluxo React.',
    status: 'ready',
  },
  {
    id: 'checkin',
    title: 'Check-in diario',
    description: 'Humor, fissura, gatilhos e plano de ação persistidos num modelo só.',
    status: 'next',
  },
  {
    id: 'panic',
    title: 'SOS e recaida',
    description: 'Fluxos de apoio emocional e reinício desacoplados do dashboard.',
    status: 'next',
  },
  {
    id: 'sync',
    title: 'Sincronizacao',
    description: 'Backup remoto com resolução clara de conflito, sem iframes ou bridges.',
    status: 'later',
  },
  {
    id: 'subscriptions',
    title: 'Assinaturas',
    description: 'RevenueCat tratado como módulo de monetização, não como fluxo de navegação.',
    status: 'later',
  },
  {
    id: 'blocker',
    title: 'Bloqueador',
    description: 'Camada nativa isolada por feature, com contratos explícitos por plataforma.',
    status: 'later',
  },
]
