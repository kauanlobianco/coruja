import type {
  MarkerRule,
  PlanOption,
  QuizQuestion,
  SymptomCategory,
  SymptomOption,
  Testimonial,
} from './types'

// Escala BPS: A = 0 pts | B = 1 pt | C = 2 pts
// Q1 e Q3 são demográficas (0 pts em todas as opções, não entram no score)
// Q12 tem apenas opções A e C (sem B) — 0 ou 2 pts
// Pontuação máxima = 20 pts (Q2 + Q4–Q12)
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    prompt: 'Pra começar, com qual gênero você se identifica?',
    factor: 'Demográfico',
    answers: [
      { label: 'Homem', points: 0 },
      { label: 'Mulher', points: 0 },
      { label: 'Outro / Prefiro não dizer', points: 0 },
    ],
  },
  {
    id: 2,
    prompt: 'Com que idade você deu o primeiro clique nesse tipo de conteúdo?',
    factor: 'Precocidade',
    answers: [
      { label: 'Depois dos 18 anos', points: 0 },
      { label: 'Na adolescência (15–17)', points: 1 },
      { label: 'Ainda na infância (menos de 14)', points: 2 },
    ],
  },
  {
    id: 3,
    prompt: 'Onde você costuma buscar isso na maioria das vezes?',
    factor: 'Plataforma',
    answers: [
      { label: 'Sites tradicionais', points: 0 },
      { label: 'Redes sociais (X / Reddit)', points: 0 },
      { label: 'Canais ou grupos pagos', points: 0 },
    ],
  },
  {
    id: 4,
    prompt: 'Você tem consumido pornografia mais do que gostaria?',
    factor: 'Controle',
    answers: [
      { label: 'Não, está sob controle', points: 0 },
      { label: 'Sinto que às vezes passo do ponto', points: 1 },
      { label: 'Com certeza, preciso parar', points: 2 },
    ],
  },
  {
    id: 5,
    prompt: 'Sente que precisa de vídeos cada vez mais "pesados" pra ter o mesmo prazer de antes?',
    factor: 'Escalada',
    answers: [
      { label: 'Não, curto o básico de sempre', points: 0 },
      { label: 'Às vezes busco uma novidade', points: 1 },
      { label: 'Se não for algo extremo, nem sinto nada', points: 2 },
    ],
  },
  {
    id: 6,
    prompt: 'Você usa a pornografia pra fugir do estresse, da ansiedade ou do tédio?',
    factor: 'Gatilho emocional',
    answers: [
      { label: 'Não, vejo porque quero', points: 0 },
      { label: 'Às vezes uso pra relaxar', points: 1 },
      { label: 'É o meu "escape" principal pra tudo', points: 2 },
    ],
  },
  {
    id: 7,
    prompt: 'Já chegou a gastar dinheiro ou esconder gastos com esse tipo de conteúdo?',
    factor: 'Impacto financeiro',
    answers: [
      { label: 'Nunca gastei um centavo', points: 0 },
      { label: 'Já comprei algo pontual', points: 1 },
      { label: 'Gasto com frequência ou escondo gastos', points: 2 },
    ],
  },
  {
    id: 8,
    prompt: 'Sente que o pornô está atrapalhando o seu desejo ou desempenho no sexo real?',
    factor: 'Disfunção sexual',
    answers: [
      { label: 'Zero impacto, tudo normal', points: 0 },
      { label: 'Às vezes sinto uma oscilação', points: 1 },
      { label: 'Atrapalha muito, prefiro o vídeo ao real', points: 2 },
    ],
  },
  {
    id: 9,
    prompt: 'Você continua assistindo mesmo quando se sente culpado ou insatisfeito depois?',
    factor: 'Ciclo vicioso',
    answers: [
      { label: 'Não me sinto mal', points: 0 },
      { label: 'Bate um arrependimento às vezes', points: 1 },
      { label: 'Sinto um vazio enorme, mas não paro', points: 2 },
    ],
  },
  {
    id: 10,
    prompt: 'Você já tentou dar um tempo ou parar de vez, mas acabou voltando atrás?',
    factor: 'Recaída',
    answers: [
      { label: 'Nunca senti necessidade', points: 0 },
      { label: 'Tentei e foi difícil segurar', points: 1 },
      { label: 'Já tentei várias vezes e sempre volto', points: 2 },
    ],
  },
  {
    id: 11,
    prompt: 'Você se sente "fissurado" ou fica com pensamentos pornográficos martelando na cabeça?',
    factor: 'Compulsão',
    answers: [
      { label: 'Só quando decido assistir', points: 0 },
      { label: 'Vira e mexe eu penso nisso', points: 1 },
      { label: 'Fica martelando na cabeça o dia todo', points: 2 },
    ],
  },
  {
    id: 12,
    prompt: 'No fundo, você sente que já perdeu o controle sobre esse consumo?',
    factor: 'Perda de controle',
    answers: [
      { label: 'Está sob controle', points: 0 },
      { label: 'Perdi o controle', points: 2 },
    ],
  },
]

export const symptomCategories: SymptomCategory[] = ['Mental', 'Físico', 'Social', 'Fé']

export const symptomOptions: SymptomOption[] = [
  { category: 'Mental', label: 'Falta de ambição para buscar objetivos' },
  { category: 'Mental', label: 'Dificuldade de concentração' },
  { category: 'Mental', label: 'Memória fraca ou névoa mental' },
  { category: 'Mental', label: 'Ansiedade generalizada' },
  { category: 'Mental', label: 'Sentindo-se desmotivado' },
  { category: 'Físico', label: 'Cansaço e letargia' },
  { category: 'Físico', label: 'Baixo desejo sexual' },
  { category: 'Físico', label: 'Ereções fracas sem pornografia' },
  { category: 'Social', label: 'Menor vontade de socializar' },
  { category: 'Social', label: 'Sentindo-se isolado dos outros' },
  { category: 'Social', label: 'Sentindo-se pouco atraente ou indigno de amor' },
  { category: 'Social', label: 'Baixa autoconfiança' },
  { category: 'Social', label: 'Sexo sem sucesso ou sem prazer' },
  { category: 'Fé', label: 'Sentindo-se distante de Deus' },
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
  {
    title: 'Você pode voltar a ser livre.',
    body: 'O vício é um caminho, mas ele não define quem você é. O primeiro passo foi dado: você reconheceu o problema.',
    icon: 'Unlock'
  },
]

export const solutionSlides = [
  {
    title: 'Bem-vindo ao Foco Mode',
    body: 'Com mais de 1.000.000 de usuários, o Foco Mode é referência, apoiado em anos de pesquisa e interação com a comunidade.',
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
    body: 'O Foco Mode aprende seus hábitos e gatilhos de tentação, oferecendo proteção 24 horas por dia.',
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
    description: 'Melhor escolha para quem quer constância, acompanhamento e mais tempo para consolidar a rotina.',
  },
  {
    id: 'lifetime',
    title: 'Acesso vitalício',
    price: 'R$ 297 à vista',
    description: 'Para quem prefere liberar o acesso completo de uma vez e seguir no próprio ritmo.',
  },
]

// Regras ordenadas por prioridade (gravidade decrescente).
// "Opção C" = answerIndex 2 para Q2–Q11; answerIndex 1 para Q12 (só tem A e C).
// buildDiagnosisReport retorna os 3 primeiros que o usuário ativou.
export const markerRules: MarkerRule[] = [
  {
    id: 'perda-controle',
    title: 'Perda de controle sobre si mesmo',
    matches: (answers) => answers.get(12) === 1,
    copy: 'Você perdeu o controle. Sua consciência sabe que é preciso parar, mas o impulso sempre te vence. Hoje, a pornografia dita as regras e você apenas obedece.',
  },
  {
    id: 'pensamentos-compulsivos',
    title: 'Pensamentos compulsivos diários',
    matches: (answers) => answers.get(11) === 2,
    copy: 'Pensar sobre pornografia durante o dia não pode se tornar um comportamento normal.',
  },
  {
    id: 'recaidas-constantes',
    title: 'Recaídas constantes',
    matches: (answers) => answers.get(10) === 2,
    copy: 'Suas recaídas constantes mostram que sua força de vontade sozinha não é mais suficiente.',
  },
  {
    id: 'ciclo-culpa',
    title: 'Ciclo de culpa sem controle',
    matches: (answers) => answers.get(9) === 2,
    copy: 'Continuar assistindo mesmo sentindo culpa é o sinal mais claro de que sua autonomia foi sequestrada.',
  },
  {
    id: 'desconexao-sexual',
    title: 'Desconexão sexual grave',
    matches: (answers) => answers.get(8) === 2,
    copy: 'Seu corpo está parando de responder ao prazer real. Isso é um sinal grave de desconexão biológica.',
  },
  {
    id: 'escalada-extrema',
    title: 'Escalada para conteúdos extremos',
    matches: (answers) => answers.get(5) === 2,
    copy: 'A necessidade de conteúdos extremos mostra que seu cérebro está anestesiado e exige doses perigosas.',
  },
  {
    id: 'consumo-excessivo',
    title: 'Consumo além do desejado',
    matches: (answers) => answers.get(4) === 2,
    copy: 'Você consome pornografia mais do que gostaria. Você sabe que precisa parar e precisa de ajuda para isso.',
  },
  {
    id: 'escape-emocional',
    title: 'Armadilha emocional',
    matches: (answers) => answers.get(6) === 2,
    copy: 'Usar pornô como remédio para o estresse é criar uma armadilha emocional onde você sempre sai perdendo.',
  },
  {
    id: 'impacto-financeiro',
    title: 'Impacto no bolso',
    matches: (answers) => answers.get(7) === 2,
    copy: 'O vício já está afetando seu bolso. Quando o dinheiro vai embora, o prejuízo deixa de ser apenas mental.',
  },
  {
    id: 'contato-precoce',
    title: 'Raízes desde a infância',
    matches: (answers) => answers.get(2) === 2,
    copy: 'Seu contato precoce criou raízes profundas. Você está lutando contra um hábito moldado na sua infância.',
  },
]
