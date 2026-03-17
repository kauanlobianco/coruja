export type ProductDomainId =
  | 'pre-purchase'
  | 'account'
  | 'onboarding'
  | 'home'
  | 'check-in'
  | 'sos'
  | 'journal'
  | 'relapse'
  | 'analytics'
  | 'blocker'
  | 'settings'
  | 'library'

export interface ProductDomainDefinition {
  id: ProductDomainId
  title: string
  routeScope: 'entry' | 'app-shell' | 'system'
  criticality: 'core' | 'critical' | 'supporting'
  owns: string[]
  routes: string[]
  dependsOn: ProductDomainId[]
}

export const productDomains: ProductDomainDefinition[] = [
  {
    id: 'pre-purchase',
    title: 'Pre-compra',
    routeScope: 'entry',
    criticality: 'core',
    owns: ['quiz', 'score de risco', 'sintomas', 'diagnostico', 'paywall'],
    routes: ['/pre-purchase', '/paywall'],
    dependsOn: [],
  },
  {
    id: 'account',
    title: 'Conta e backup',
    routeScope: 'entry',
    criticality: 'critical',
    owns: ['auth', 'restore', 'backup remoto', 'sessao exclusiva'],
    routes: ['/account/required', '/account/auth'],
    dependsOn: ['pre-purchase'],
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    routeScope: 'entry',
    criticality: 'core',
    owns: ['identidade', 'meta inicial', 'motivos', 'gatilhos'],
    routes: ['/onboarding'],
    dependsOn: ['account'],
  },
  {
    id: 'home',
    title: 'Home',
    routeScope: 'app-shell',
    criticality: 'core',
    owns: ['streak', 'acao principal do dia', 'atalhos centrais'],
    routes: ['/app'],
    dependsOn: ['onboarding', 'check-in', 'journal', 'blocker', 'analytics'],
  },
  {
    id: 'check-in',
    title: 'Check-in',
    routeScope: 'app-shell',
    criticality: 'core',
    owns: ['check-in diario', 'estrategia do dia', 'escalada para SOS'],
    routes: ['/check-in'],
    dependsOn: ['onboarding'],
  },
  {
    id: 'sos',
    title: 'Panico / SOS',
    routeScope: 'app-shell',
    criticality: 'core',
    owns: ['intervencao imediata', 'motivos rotativos', 'timer de crise'],
    routes: ['/sos'],
    dependsOn: ['onboarding', 'check-in'],
  },
  {
    id: 'journal',
    title: 'Journal',
    routeScope: 'app-shell',
    criticality: 'supporting',
    owns: ['entradas livres', 'historico emocional'],
    routes: ['/journal'],
    dependsOn: ['onboarding'],
  },
  {
    id: 'relapse',
    title: 'Recaida',
    routeScope: 'app-shell',
    criticality: 'critical',
    owns: ['reset de streak', 'nova meta', 'reflexao de recaida'],
    routes: ['/relapse'],
    dependsOn: ['journal', 'home'],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    routeScope: 'app-shell',
    criticality: 'supporting',
    owns: ['score de recuperacao', 'series', 'distribuicoes', 'insights'],
    routes: ['/analytics'],
    dependsOn: ['check-in', 'relapse'],
  },
  {
    id: 'blocker',
    title: 'Bloqueador',
    routeScope: 'app-shell',
    criticality: 'critical',
    owns: ['configuracao local', 'bridge nativa', 'tentativas bloqueadas'],
    routes: ['/blocker', '/blocked'],
    dependsOn: ['home', 'settings'],
  },
  {
    id: 'settings',
    title: 'Settings',
    routeScope: 'app-shell',
    criticality: 'supporting',
    owns: ['conta', 'sync manual', 'logout', 'limpeza local'],
    routes: ['/settings'],
    dependsOn: ['account', 'blocker'],
  },
  {
    id: 'library',
    title: 'Biblioteca',
    routeScope: 'app-shell',
    criticality: 'supporting',
    owns: ['conteudo futuro', 'jogos e licoes'],
    routes: ['/library'],
    dependsOn: ['home'],
  },
]
