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
    title: 'Foco e energia',
    body: 'Quando esse padrao entra na rotina, ele costuma roubar presenca mental. O dia fica mais disperso, a energia cai e tarefas simples podem parecer mais pesadas.',
  },
  {
    title: 'Autoestima',
    body: 'Muita gente entra no mesmo ciclo: impulso, alivio rapido e peso depois. A repeticao disso desgasta a forma como voce se ve e faz parecer que nada muda de verdade.',
  },
  {
    title: 'Conexao',
    body: 'Com o tempo, isso tambem pode aparecer nas relacoes. Fica mais dificil estar presente, se conectar de verdade e sustentar proximidade sem distancia emocional.',
  },
]

export const solutionSlides = [
  {
    title: 'Nao e so falta de vontade',
    body: 'Quando esse ciclo ja ficou automatico, tentar segurar so no impulso costuma falhar. O problema nao e fraqueza. E o jeito como o padrao se repete.',
  },
  {
    title: 'Medir para entender',
    body: 'O check-in diario te ajuda a perceber como voce esta, o que pesa mais no dia e quando o risco sobe. Nao e julgamento. E clareza.',
  },
  {
    title: 'Proteger o ambiente',
    body: 'O bloqueador cria uma camada real de protecao nos momentos em que confiar so na disciplina nao basta. Nao e punicao. E apoio pratico.',
  },
  {
    title: 'Agir na hora certa',
    body: 'Quando o momento apertar, o SOS e o Jornal ajudam voce a atravessar a vulnerabilidade com mais presenca, em vez de cair no piloto automatico.',
  },
]

export const testimonials: Testimonial[] = [
  {
    name: 'Rafael',
    role: 'voltou a dormir sem culpa toda noite',
    quote: 'O maior alivio foi parar de acordar me sentindo mal no dia seguinte.',
  },
  {
    name: 'Joao',
    role: 'entendeu melhor os gatilhos da noite',
    quote: 'Eu achava que era so falta de controle. Depois percebi que eu repetia o mesmo gatilho quase todo dia.',
  },
  {
    name: 'Mateus',
    role: 'conseguiu recomecar mais rapido depois de cair',
    quote: 'Antes eu sumia quando errava. Com uma rotina, eu consegui voltar sem me abandonar por dias.',
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
