import type {
  MarkerRule,
  PlanOption,
  QuizQuestion,
  SymptomCategory,
  SymptomOption,
  Testimonial,
} from './types'

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    prompt: 'Qual e o seu genero?',
    factor: 'Demografico',
    answers: [
      { label: 'Homem', points: 0 },
      { label: 'Mulher', points: 0 },
      { label: 'Prefiro nao dizer', points: 0 },
    ],
  },
  {
    id: 2,
    prompt: 'Qual a frequencia do seu consumo de conteudo adulto?',
    factor: 'Intensidade',
    answers: [
      { label: 'Menos de uma vez por semana', points: 0 },
      { label: 'De 1 a 6 vezes por semana', points: 2 },
      { label: 'Todos os dias', points: 4 },
      { label: 'Mais de uma vez por dia', points: 6 },
    ],
  },
  {
    id: 3,
    prompt: 'Com que idade voce teve o primeiro contato?',
    factor: 'Precocidade',
    answers: [
      { label: '18 anos ou mais', points: 0 },
      { label: '15-17 anos', points: 1 },
      { label: '10-14 anos', points: 2 },
      { label: 'Antes dos 10 anos', points: 3 },
    ],
  },
  {
    id: 4,
    prompt: 'Onde esse consumo acontece com mais frequencia?',
    factor: 'Contexto / Plataforma',
    answers: [
      { label: 'Site de conteudo adulto', points: 0 },
      { label: 'Redes sociais', points: 1 },
      { label: 'Apps de mensagem e grupos privados', points: 2 },
      { label: 'Plataformas pagas (OnlyFans, etc.)', points: 3 },
    ],
  },
  {
    id: 5,
    prompt: 'Quanto tempo costuma durar uma sessao?',
    factor: 'Tempo dispendido',
    answers: [
      { label: 'Ate 10 minutos', points: 0 },
      { label: 'Entre 10 e 30 minutos', points: 2 },
      { label: 'Entre 30 e 60 minutos', points: 3 },
      { label: 'Mais de 60 minutos', points: 5 },
    ],
  },
  {
    id: 6,
    prompt: 'Voce sente que o consumo de pornografia tem sido um problema na sua vida?',
    factor: 'Autocritica',
    answers: [
      { label: 'Nao', points: 0 },
      { label: 'Talvez, nao tenho certeza', points: 3 },
      { label: 'Sim, me incomoda um pouco', points: 7 },
      { label: 'Sim, ja atrapalha areas da minha vida', points: 12 },
      { label: 'Sim, sinto que esta fora de controle', points: 16 },
    ],
  },
  {
    id: 7,
    prompt: 'Ha quanto tempo voce avalia que isso tem sido um problema?',
    factor: 'Cronicidade',
    answers: [
      { label: 'Nao considero um problema', points: 0 },
      { label: 'Menos de 6 meses', points: 1 },
      { label: '1 ano', points: 3 },
      { label: 'Mais de 1 ano', points: 4 },
    ],
  },
  {
    id: 8,
    prompt: 'O consumo de pornografia afeta seu desempenho sexual?',
    factor: 'Disfuncao sexual',
    answers: [
      { label: 'Nao', points: 0 },
      { label: 'Raramente', points: 2 },
      { label: 'As vezes, e eu percebo esse impacto', points: 5 },
      { label: 'Frequentemente', points: 9 },
      { label: 'Muito, a ponto de evitar sexo ou me atrapalhar bastante', points: 12 },
    ],
  },
  {
    id: 9,
    prompt: 'Como voce se sente logo apos o consumo desse tipo de conteudo?',
    factor: 'Reforco negativo / ciclo vicioso',
    answers: [
      { label: 'Normal ou relaxado', points: 0 },
      { label: 'Com leve culpa ou desconforto', points: 2 },
      { label: 'Arrependimento frequente', points: 5 },
      { label: 'Ansioso, triste ou irritado depois', points: 8 },
      { label: 'Muito mal, com vergonha forte, vazio ou aversao a mim mesmo', points: 10 },
    ],
  },
  {
    id: 10,
    prompt: 'Voce sente que precisa de conteudos mais extremos para se satisfazer?',
    factor: 'Escalada / tolerancia',
    answers: [
      { label: 'Nao', points: 0 },
      { label: 'As vezes procuro novidade', points: 3 },
      { label: 'Tenho percebido uma escalada aos poucos', points: 6 },
      { label: 'Preciso de coisas bem diferentes do que via no inicio', points: 8 },
      { label: 'Sim, so consigo me satisfazer com conteudos muito mais extremos', points: 10 },
    ],
  },
  {
    id: 11,
    prompt: 'Voce ja gastou dinheiro com esse tipo de conteudo?',
    factor: 'Comprometimento financeiro',
    answers: [
      { label: 'Nunca', points: 0 },
      { label: 'Ja gastei uma vez, em valor pequeno', points: 1 },
      { label: 'As vezes, com pequenos gastos', points: 2 },
      { label: 'Gasto com certa regularidade', points: 4 },
      { label: 'Ja me trouxe prejuizo, como divida ou gastos escondidos', points: 5 },
    ],
  },
  {
    id: 12,
    prompt: 'Voce ja realizou tentativas de parar de assistir conteudo adulto?',
    factor: 'Recaida / manutencao',
    answers: [
      { label: 'Nunca tentei (nao senti necessidade)', points: 0 },
      { label: 'Tentei e foi facil', points: 2 },
      { label: 'Tentei 1 ou 2 vezes, mas voltei', points: 5 },
      { label: 'Tentei varias vezes, mas recaio rapido', points: 8 },
      { label: 'Tento com frequencia, mas nao consigo sustentar', points: 10 },
    ],
  },
  {
    id: 13,
    prompt: 'Voce sente que ja perdeu o controle em relacao ao seu consumo de pornografia?',
    factor: 'Compulsao',
    answers: [
      { label: 'Nao', points: 0 },
      { label: 'Sim', points: 16 },
    ],
  },
]

export const symptomCategories: SymptomCategory[] = ['Mental', 'Fisico', 'Social', 'Fe']

export const symptomOptions: SymptomOption[] = [
  { category: 'Mental', label: 'Falta de ambicao para buscar objetivos' },
  { category: 'Mental', label: 'Dificuldade de concentracao' },
  { category: 'Mental', label: 'Memoria fraca ou nevoa mental' },
  { category: 'Mental', label: 'Ansiedade generalizada' },
  { category: 'Mental', label: 'Sentindo-se desmotivado' },
  { category: 'Fisico', label: 'Cansaco e letargia' },
  { category: 'Fisico', label: 'Baixo desejo sexual' },
  { category: 'Fisico', label: 'Erecoes fracas sem pornografia' },
  { category: 'Social', label: 'Menor vontade de socializar' },
  { category: 'Social', label: 'Sentindo-se isolado dos outros' },
  { category: 'Social', label: 'Sentindo-se pouco atraente ou indigno de amor' },
  { category: 'Social', label: 'Baixa autoconfianca' },
  { category: 'Social', label: 'Sexo sem sucesso ou sem prazer' },
  { category: 'Fe', label: 'Sentindo-se distante de Deus' },
]

export const painSlides = [
  {
    title: 'Pornografia é uma droga',
    body: 'Usar pornografia libera uma substância química no cérebro chamada dopamina. Ela faz você se sentir bem — é por isso que surge prazer ao assistir pornografia.',
    icon: 'Brain'
  },
  {
    title: 'Pornografia destrói relacionamentos',
    body: 'A pornografia reduz sua fome por um relacionamento real e a substitui por desejo de ainda mais pornografia.',
    icon: 'HeartCrack'
  },
  {
    title: 'A pornografia destrói o desejo sexual',
    body: 'Mais de 50% dos dependentes de pornografia relatam perda de interesse em sexo real e uma queda geral no desejo sexual.',
    icon: 'Unplug'
  },
  {
    title: 'Sentindo-se infeliz?',
    body: 'Um nível elevado de dopamina faz você precisar de cada vez mais para se sentir bem. Por isso tantos usuários intensivos relatam sentir-se deprimidos, desmotivados e antissociais.',
    icon: 'Frown'
  },
]

export const solutionSlides = [
  {
    title: 'Bem-vindo ao Coruja',
    body: 'Com mais de 1.000.000 de usuários, o Coruja é referência, apoiado em anos de pesquisa e interação com a comunidade.',
    icon: 'Rocket'
  },
  {
    title: 'Reconecte seu cérebro',
    body: 'Exercícios baseados em ciência ajudam você a reconectar o cérebro, reconstruir seus receptores de dopamina e evitar recaídas.',
    icon: 'Brain'
  },
  {
    title: 'Mantenha-se motivado',
    body: 'Parar com a pornografia é desafiador. Seus check-ins diários mantêm você motivado enquanto se torna sua melhor versão.',
    icon: 'Flame'
  },
  {
    title: 'Evite recaídas',
    body: 'O Coruja aprende seus hábitos e gatilhos de tentação, oferecendo proteção 24 horas por dia.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Domine a si mesmo',
    body: 'Conheça-se para ir além. Entenda seus pontos fortes e fracos, conquiste medalhas e acompanhe seu progresso.',
    icon: 'Trophy'
  },
  {
    title: 'Caminho para a recuperação',
    body: 'A recuperação é possível. Ao se abster da pornografia, seu cérebro redefine a sensibilidade à dopamina, levando a relacionamentos mais saudáveis e a um bem-estar maior.',
    icon: 'Sprout'
  },
  {
    title: 'Eleve sua vida',
    body: 'Recomeçar traz imensos benefícios psicológicos e físicos. Fique mais forte, saudável e feliz.',
    icon: 'Activity'
  },
]

export const testimonials: Testimonial[] = [
  {
    name: 'Andrew Huberman, Ph.D.',
    role: 'Melhore drasticamente sua vida',
    quote: 'O reset do seu balanço de dopamina ao fazer uma pausa de conteúdos altamente estimulantes pode melhorar dramaticamente sua motivação, estabilidade emocional e prazer diário.',
  },
  {
    name: 'Steven Bartlett',
    role: 'Não há nada de bom na pornografia',
    quote: 'A pornografia não tem nenhum papel educacional — é apenas uma janela aberta para um mercado que traz mais vazio e vício do que lucro para si mesmo.',
  },
  {
    name: 'Connor',
    role: 'Parar me permitiu mudar minha mentalidade',
    quote: 'Eu estava começando a aceitar o fato de que a vida é escura, chata e deprimente. Esqueça isso. Parar me permitiu mudar minha mentalidade sobre as pequenas coisas da vida.',
  },
  {
    name: 'Rafael',
    role: 'Voltou a dormir sem culpa toda noite',
    quote: 'O maior alívio foi parar de acordar me sentindo mal no dia seguinte.',
  },
]

export const planOptions: PlanOption[] = [
  {
    id: 'annual',
    title: 'Plano anual',
    price: '12x de R$ 19,90',
    description: 'Melhor escolha para quem quer constancia, acompanhamento e mais tempo para consolidar a rotina.',
  },
  {
    id: 'lifetime',
    title: 'Acesso vitalicio',
    price: 'R$ 297 a vista',
    description: 'Para quem prefere liberar o acesso completo de uma vez e seguir no proprio ritmo.',
  },
]

export const markerRules: MarkerRule[] = [
  {
    id: 'perda-controle',
    title: 'Perda de controle em momentos-chave',
    matches: (answers: Map<number, number>) =>
      answers.get(13) === 1 || answers.get(6) === 4,
    copy:
      'Suas respostas mostram momentos em que interromper ou regular esse comportamento tem ficado dificil demais.',
  },
  {
    id: 'interferencia-vida',
    title: 'Impacto no dia a dia',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(6)
      return answer === 3 || answer === 4
    },
    copy:
      'Isso ja esta encostando em areas importantes da sua rotina, e por isso merece ser tratado com seriedade agora.',
  },
  {
    id: 'tentativas-frustradas',
    title: 'Dificuldade para sustentar tentativas',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(12)
      return answer === 3 || answer === 4
    },
    copy:
      'Voce ja tentou reduzir ou parar, mas nao conseguiu manter isso por muito tempo sozinho.',
  },
  {
    id: 'impacto-sexual',
    title: 'Impacto na vida sexual',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(8)
      return answer !== undefined && answer >= 2
    },
    copy:
      'Esse padrao tambem esta aparecendo na sua vida sexual, o que mostra que o problema nao ficou isolado.',
  },
  {
    id: 'escalada',
    title: 'Escalada do padrao',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(10)
      return answer !== undefined && answer >= 2
    },
    copy:
      'Ha sinais de que o que antes bastava ja nao tem o mesmo efeito, e a busca por estimulo tem aumentado.',
  },
  {
    id: 'impacto-emocional',
    title: 'Peso emocional depois do consumo',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(9)
      return answer !== undefined && answer >= 2
    },
    copy:
      'O que acontece depois tambem importa: culpa, vazio ou ansiedade costumam alimentar o retorno ao mesmo ciclo.',
  },
  {
    id: 'gasto-financeiro',
    title: 'Impacto financeiro',
    matches: (answers: Map<number, number>) => {
      const answer = answers.get(11)
      return answer === 3 || answer === 4
    },
    copy:
      'Voce tambem sinalizou impacto no dinheiro, o que mostra que esse padrao ja esta cobrando um preco concreto.',
  },
]
