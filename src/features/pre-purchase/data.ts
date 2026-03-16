import type { PlanOption, QuizQuestion, Testimonial } from './types'

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    prompt: 'Com que frequência você sente que perdeu o controle do impulso?',
    answers: [
      { label: 'Quase nunca', points: 1 },
      { label: 'Às vezes', points: 2 },
      { label: 'Muitas vezes', points: 3 },
      { label: 'Quase sempre', points: 4 },
    ],
  },
  {
    id: 2,
    prompt: 'Quanto isso vem afetando sua autoestima?',
    answers: [
      { label: 'Pouco', points: 1 },
      { label: 'Moderadamente', points: 2 },
      { label: 'Bastante', points: 3 },
      { label: 'Profundamente', points: 4 },
    ],
  },
  {
    id: 3,
    prompt: 'Você percebe impacto no seu foco e produtividade?',
    answers: [
      { label: 'Não percebo', points: 1 },
      { label: 'Leve', points: 2 },
      { label: 'Claro', points: 3 },
      { label: 'Muito forte', points: 4 },
    ],
  },
  {
    id: 4,
    prompt: 'Seu sono ou energia pioram depois desses episódios?',
    answers: [
      { label: 'Quase nunca', points: 1 },
      { label: 'Algumas vezes', points: 2 },
      { label: 'Frequentemente', points: 3 },
      { label: 'Sempre', points: 4 },
    ],
  },
  {
    id: 5,
    prompt: 'Você já tentou parar mais de uma vez sem conseguir manter?',
    answers: [
      { label: 'Não', points: 1 },
      { label: '1 ou 2 vezes', points: 2 },
      { label: 'Várias vezes', points: 3 },
      { label: 'Perdi a conta', points: 4 },
    ],
  },
  {
    id: 6,
    prompt: 'Em momentos de ansiedade, a vontade aumenta?',
    answers: [
      { label: 'Raramente', points: 1 },
      { label: 'Às vezes', points: 2 },
      { label: 'Muito', points: 3 },
      { label: 'É meu principal gatilho', points: 4 },
    ],
  },
  {
    id: 7,
    prompt: 'Quanto isso interfere na sua relação com o celular?',
    answers: [
      { label: 'Pouco', points: 1 },
      { label: 'Moderadamente', points: 2 },
      { label: 'Muito', points: 3 },
      { label: 'Dominou a rotina', points: 4 },
    ],
  },
  {
    id: 8,
    prompt: 'Você se sente mais isolado ou envergonhado por causa disso?',
    answers: [
      { label: 'Não', points: 1 },
      { label: 'Um pouco', points: 2 },
      { label: 'Sim', points: 3 },
      { label: 'Fortemente', points: 4 },
    ],
  },
  {
    id: 9,
    prompt: 'É comum acontecer no fim do dia ou de madrugada?',
    answers: [
      { label: 'Quase nunca', points: 1 },
      { label: 'Às vezes', points: 2 },
      { label: 'Frequentemente', points: 3 },
      { label: 'É o padrão', points: 4 },
    ],
  },
  {
    id: 10,
    prompt: 'Você sente que precisa de um plano mais estruturado para sair desse ciclo?',
    answers: [
      { label: 'Talvez não', points: 1 },
      { label: 'Acho que sim', points: 2 },
      { label: 'Com certeza', points: 3 },
      { label: 'Urgentemente', points: 4 },
    ],
  },
  {
    id: 11,
    prompt: 'Seu humor muda bastante depois de uma recaída?',
    answers: [
      { label: 'Pouco', points: 1 },
      { label: 'Moderadamente', points: 2 },
      { label: 'Bastante', points: 3 },
      { label: 'Muito', points: 4 },
    ],
  },
  {
    id: 12,
    prompt: 'Quanto isso impacta sua disciplina em outras áreas?',
    answers: [
      { label: 'Quase nada', points: 1 },
      { label: 'Um pouco', points: 2 },
      { label: 'Bastante', points: 3 },
      { label: 'Muito', points: 4 },
    ],
  },
  {
    id: 13,
    prompt: 'Se nada mudar, como você imagina os próximos meses?',
    answers: [
      { label: 'Estáveis', points: 1 },
      { label: 'Incertos', points: 2 },
      { label: 'Preocupantes', points: 3 },
      { label: 'Difíceis', points: 4 },
    ],
  },
]

export const symptomOptions = [
  'Ansiedade alta',
  'Culpa recorrente',
  'Falta de foco',
  'Sono ruim',
  'Oscilação de humor',
  'Impulsividade',
  'Baixa energia',
  'Procrastinação',
]

export const painSlides = [
  {
    title: 'Seu cérebro aprende o atalho mais fácil',
    body: 'Quanto mais repetição sem estratégia, maior o ciclo entre gatilho, impulso e culpa.',
  },
  {
    title: 'A rotina perde previsibilidade',
    body: 'Noite, celular e ansiedade viram um roteiro automático difícil de quebrar no improviso.',
  },
  {
    title: 'A recaída derruba a confiança',
    body: 'Você não perde só um dia. Perde também a sensação de consistência.',
  },
  {
    title: 'Sem plano, a motivação sozinha não sustenta',
    body: 'Vontade ajuda a começar, mas sistema é o que ajuda a manter.',
  },
]

export const solutionSlides = [
  {
    title: 'Diagnóstico claro antes da ação',
    body: 'O app organiza gatilhos, padrão do dia e rotina para reduzir tentativa e erro.',
  },
  {
    title: 'Intervenção rápida nos momentos críticos',
    body: 'Check-in, SOS e plano de ação substituem reação automática por escolha guiada.',
  },
  {
    title: 'Consistência visível',
    body: 'Seu progresso aparece em metas, streak e próximos passos, não só em sensação.',
  },
  {
    title: 'Monetização separada do produto',
    body: 'O paywall vira um módulo, não um desvio de navegação dentro do app inteiro.',
  },
]

export const testimonials: Testimonial[] = [
  {
    name: 'Rafael',
    role: '22 dias de consistência',
    quote: 'Pela primeira vez eu senti que tinha um sistema e não só força de vontade.',
  },
  {
    name: 'João',
    role: 'Rotina noturna reconstruída',
    quote: 'O maior ganho foi clareza. Passei a perceber meus gatilhos antes de explodir.',
  },
  {
    name: 'Mateus',
    role: 'Recomeço com menos culpa',
    quote: 'Quando eu recaía, antes eu sumia. Com um plano, eu voltava no mesmo dia.',
  },
]

export const planOptions: PlanOption[] = [
  {
    id: 'annual',
    title: 'Plano anual',
    price: '12x de R$ 19,90',
    description: 'Melhor custo para quem quer reconstruir a rotina com acompanhamento contínuo.',
  },
  {
    id: 'lifetime',
    title: 'Acesso vitalício',
    price: 'R$ 297 à vista',
    description: 'Uma compra só para liberar a base completa e futuras evoluções.',
  },
]
