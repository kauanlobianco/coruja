export interface ModuleDefinition {
  id: string
  title: string
  description: string
  status: 'ready' | 'next' | 'later'
}

export const productModules: ModuleDefinition[] = [
  {
    id: 'pre-purchase',
    title: 'Pre-compra',
    description: 'Funil React com quiz, score, sintomas, diagnostico, carrosseis e paywall.',
    status: 'ready',
  },
  {
    id: 'account',
    title: 'Conta e backup',
    description: 'Cadastro obrigatorio, login pela landing, restore, sync e takeover por dispositivo.',
    status: 'ready',
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    description: 'Nome, meta, motivos e gatilhos em um unico fluxo React.',
    status: 'ready',
  },
  {
    id: 'home',
    title: 'Home',
    description: 'Estrutura principal do app com streak, CTA do dia e atalhos centrais.',
    status: 'ready',
  },
  {
    id: 'checkin',
    title: 'Check-in diario',
    description: 'Leitura do momento, estrategia do dia e regra de um check-in por calendario.',
    status: 'ready',
  },
  {
    id: 'panic',
    title: 'SOS / Panico',
    description: 'Intervencao imediata com motivos, respiracao e timer para momentos criticos.',
    status: 'ready',
  },
  {
    id: 'journal',
    title: 'Journal',
    description: 'Entradas livres e historico emocional ligados ao resto da jornada.',
    status: 'ready',
  },
  {
    id: 'relapse',
    title: 'Recaida',
    description: 'Reset de streak, nova meta e reflexao opcional preservando historico.',
    status: 'ready',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Leitura derivada de check-ins e recaidas, sem depender de nomes fixos.',
    status: 'ready',
  },
  {
    id: 'blocker',
    title: 'Bloqueador',
    description: 'Camada nativa isolada por feature, com VPN, bridge e tela de bloqueio.',
    status: 'ready',
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Conta, backup, sessao, protecao e manutencao numa estrutura de produto.',
    status: 'ready',
  },
  {
    id: 'library',
    title: 'Biblioteca',
    description: 'Aba recolocada na navegacao final, ainda sem conteudo funcional.',
    status: 'later',
  },
]
