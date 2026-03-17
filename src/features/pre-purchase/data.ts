import type {
  PlanOption,
  QuizQuestion,
  SymptomCategory,
  SymptomOption,
  Testimonial,
} from './types'

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    prompt: 'Genero',
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
      { label: 'Mais de uma vez por semana', points: 2 },
      { label: 'Todo dia', points: 4 },
      { label: 'Mais de uma vez por dia', points: 6 },
    ],
  },
  {
    id: 3,
    prompt: 'Quando foi seu primeiro contato?',
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
    prompt: 'Onde voce costuma consumir esse tipo de conteudo?',
    factor: 'Contexto / Plataforma',
    answers: [
      { label: 'Site de conteudo adulto', points: 0 },
      { label: 'Rede social (Twitter, Instagram...)', points: 1 },
      { label: 'Canais de mensagem (WhatsApp, Telegram...)', points: 2 },
      { label: 'Plataformas pagas (OnlyFans, etc.)', points: 3 },
    ],
  },
  {
    id: 5,
    prompt: 'Quanto tempo dura uma sessao tipica?',
    factor: 'Tempo dispendido',
    answers: [
      { label: 'Ate 10 min', points: 0 },
      { label: '10-30 min', points: 2 },
      { label: '30-60 min', points: 3 },
      { label: 'Mais de 60 min', points: 5 },
    ],
  },
  {
    id: 6,
    prompt: 'Voce sente que o consumo de pornografia tem sido um problema na sua vida?',
    factor: 'Autocritica',
    answers: [
      { label: 'Nao', points: 0 },
      { label: 'Talvez / nao tenho certeza', points: 3 },
      { label: 'Sim, leve (me incomoda um pouco)', points: 7 },
      { label: 'Sim, atrapalha areas da vida', points: 12 },
      { label: 'Sim, parece fora de controle', points: 16 },
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
      { label: 'As vezes (percebo impacto)', points: 5 },
      { label: 'Frequentemente', points: 9 },
      { label: 'Muito (evito sexo / atrapalha bastante)', points: 12 },
    ],
  },
  {
    id: 9,
    prompt: 'Como voce se sente logo apos o consumo desse tipo de conteudo?',
    factor: 'Reforco negativo / ciclo vicioso',
    answers: [
      { label: 'Normal / relaxado', points: 0 },
      { label: 'Leve culpa / desconforto', points: 2 },
      { label: 'Arrependimento frequente', points: 5 },
      { label: 'Ansioso / triste / irritado depois', points: 8 },
      { label: 'Pessimo (vergonha forte / vazio / autoaversao)', points: 10 },
    ],
  },
  {
    id: 10,
    prompt: 'Voce sente que precisa de conteudos mais extremos para se satisfazer?',
    factor: 'Escalada / tolerancia',
    answers: [
      { label: 'Nao', points: 0 },
      { label: 'As vezes busco novidade', points: 3 },
      { label: 'Tenho notado escalada gradual', points: 6 },
      { label: 'Preciso de coisas bem diferentes do inicio', points: 8 },
      { label: 'Sim, so consigo com conteudo bem mais extremo', points: 10 },
    ],
  },
  {
    id: 11,
    prompt: 'Voce ja gastou dinheiro com esse tipo de conteudo?',
    factor: 'Comprometimento financeiro',
    answers: [
      { label: 'Nunca', points: 0 },
      { label: 'Ja gastei uma vez (valor pequeno)', points: 1 },
      { label: 'As vezes (pequenos gastos)', points: 2 },
      { label: 'Gasto com certa regularidade', points: 4 },
      { label: 'Ja trouxe prejuizo (divida, esconder gastos)', points: 5 },
    ],
  },
  {
    id: 12,
    prompt: 'Voce ja realizou tentativas de parar de assistir conteudo adulto?',
    factor: 'Recaida / manutencao',
    answers: [
      { label: 'Nunca tentei (nao senti necessidade)', points: 0 },
      { label: 'Tentei e foi facil', points: 2 },
      { label: 'Tentei 1-2x, mas voltei', points: 5 },
      { label: 'Tentei varias vezes, recai rapido', points: 8 },
      { label: 'Tento sempre e nao consigo sustentar', points: 10 },
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
    title: 'Quando o consumo ganha frequencia, ele deixa de ser episodio e vira padrao.',
    body: 'A repeticao cria um circuito automatico entre gatilho, busca de alivio e culpa. O risco maior nao e so o conteudo, e a falta de governanca sobre a rotina.',
  },
  {
    title: 'A escalada costuma ser silenciosa: mais tempo, mais intensidade, menos controle.',
    body: 'O padrao vai pedindo mais estimulo para gerar o mesmo efeito. Isso amplia o desgaste emocional e enfraquece a capacidade de interromper no momento certo.',
  },
  {
    title: 'O impacto raramente fica isolado. Ele se espalha para foco, energia, sexualidade e relacoes.',
    body: 'Quando o comportamento comeca a interferir em areas do dia a dia, o custo deixa de ser privado e passa a ser funcional.',
  },
  {
    title: 'Sem sistema, a motivacao vira tentativa curta e recaida rapida.',
    body: 'O problema nao e faltar vontade. E tentar resolver algo automatico sem plano, sem medicao e sem resposta clara para o gatilho.',
  },
]

export const solutionSlides = [
  {
    title: 'Primeiro, diagnostico objetivo.',
    body: 'O quiz mede intensidade, precocidade, escalada, impacto sexual, impacto emocional e perda de controle para sair do achismo.',
  },
  {
    title: 'Depois, personalizacao por sintomas.',
    body: 'Os sintomas marcados ajudam a ajustar a conversa para foco mental, vitalidade fisica, reconexao social e motivacoes mais profundas.',
  },
  {
    title: 'Em seguida, plano com rotina e protecao.',
    body: 'O app organiza streak, check-in, journal, SOS e bloqueador em volta do mesmo objetivo: reduzir recaidas e reconstruir previsibilidade.',
  },
  {
    title: 'Por fim, acompanhamento visivel.',
    body: 'Seu progresso deixa de depender de sensacao. Ele passa a aparecer em metas, historico e proximos passos concretos.',
  },
]

export const testimonials: Testimonial[] = [
  {
    name: 'Rafael',
    role: '22 dias de consistencia',
    quote: 'Pela primeira vez eu senti que tinha um sistema e nao so forca de vontade.',
  },
  {
    name: 'Joao',
    role: 'Rotina noturna reconstruida',
    quote: 'O maior ganho foi clareza. Passei a perceber meus gatilhos antes de explodir.',
  },
  {
    name: 'Mateus',
    role: 'Recomeco com menos culpa',
    quote: 'Quando eu recaia, antes eu sumia. Com um plano, eu voltava no mesmo dia.',
  },
]

export const planOptions: PlanOption[] = [
  {
    id: 'annual',
    title: 'Plano anual',
    price: '12x de R$ 19,90',
    description: 'Melhor custo para quem quer reconstruir a rotina com acompanhamento continuo.',
  },
  {
    id: 'lifetime',
    title: 'Acesso vitalicio',
    price: 'R$ 297 a vista',
    description: 'Uma compra so para liberar a base completa e futuras evolucoes.',
  },
]
