// ── Motivation options ─────────────────────────────────────────────────────

export interface MotivationOption {
  id: string
  label: string
  icon: string
}

export const MOTIVATION_OPTIONS: MotivationOption[] = [
  { id: 'clareza', label: 'Mais clareza mental', icon: 'brain' },
  { id: 'sono', label: 'Dormir em paz', icon: 'moon' },
  { id: 'controle', label: 'Voltar a ter controle', icon: 'target' },
  { id: 'relacionamentos', label: 'Melhores relações', icon: 'heart' },
  { id: 'presente', label: 'Estar mais presente', icon: 'sparkles' },
  { id: 'autoestima', label: 'Autoestima mais sólida', icon: 'shield' },
  { id: 'foco', label: 'Mais foco', icon: 'compass' },
  { id: 'energia', label: 'Mais energia', icon: 'sparkles' },
  { id: 'inteireza', label: 'Me sentir inteiro', icon: 'compass' },
  { id: 'respeito', label: 'Respeito próprio', icon: 'shield' },
  { id: 'futuro', label: 'Proteger quem eu quero ser', icon: 'sparkles' },
  { id: 'espiritualidade', label: 'Me alinhar com meus valores', icon: 'sparkles' },
  { id: 'culpa', label: 'Sair do ciclo de culpa', icon: 'compass' },
  { id: 'familia', label: 'Minha família', icon: 'heart' },
]

// ── Trigger groups ─────────────────────────────────────────────────────────

export interface TriggerGroup {
  label: string
  items: string[]
}

export const TRIGGER_GROUPS: TriggerGroup[] = [
  {
    label: 'Situações e contextos',
    items: [
      'Celular na cama',
      'Madrugada',
      'Sozinho no quarto',
      'Sem rumo no computador',
      'Logo ao acordar',
      'Fim de semana vazio',
      'Depois de beber',
      'Rolando redes sociais',
    ],
  },
  {
    label: 'Estados mentais e emocionais',
    items: [
      'Tédio',
      'Ansiedade',
      'Solidão',
      'Estresse acumulado',
      'Frustração',
      'Carência',
      'Cansaço',
      'Sensação de fracasso',
    ],
  },
]

export const TRIGGER_OPTIONS = TRIGGER_GROUPS.flatMap((group) => group.items)

// ── Mental traps ───────────────────────────────────────────────────────────

export interface MentalTrap {
  id: string
  text: string
  shortLabel: string
}

export const MENTAL_TRAPS: MentalTrap[] = [
  { id: 'just-today', text: 'Só hoje', shortLabel: 'Só hoje' },
  { id: 'deserve', text: 'Eu mereço isso', shortLabel: 'Eu mereço isso' },
  { id: 'already-ruined', text: 'Já estraguei tudo', shortLabel: 'Já estraguei tudo' },
  { id: 'no-one-knows', text: 'Ninguém vai saber', shortLabel: 'Ninguém vai saber' },
  { id: 'just-relief', text: 'Só pra aliviar', shortLabel: 'Só pra aliviar' },
  { id: 'loneliness', text: 'Só tô precisando de carinho', shortLabel: 'Só tô precisando de carinho' },
  { id: 'no-harm', text: 'Não faz mal', shortLabel: 'Não faz mal' },
  { id: 'later', text: 'Depois eu paro', shortLabel: 'Depois eu paro' },
  { id: 'last-time', text: 'É a última vez', shortLabel: 'É a última vez' },
  { id: 'testing', text: 'Só pra ver como eu reajo', shortLabel: 'Só pra ver como eu reajo' },
  { id: 'overconfident', text: 'Tô indo bem demais, uma vez não muda nada', shortLabel: 'Tô indo bem demais' },
]

// ── Response suggestions ───────────────────────────────────────────────────

export interface ResponseSuggestion {
  shortText: string
  draftText: string
}

export const RESPONSE_SUGGESTIONS: Record<string, ResponseSuggestion[]> = {
  'just-today': [
    {
      shortText: 'Convencer já é alerta',
      draftText: 'Se eu preciso me convencer de que é só hoje, isso já é sinal de alerta. Foi assim que esse ciclo começou antes.',
    },
    {
      shortText: 'O ciclo começa aqui',
      draftText: 'O "só hoje" nunca vem sozinho. É aqui que o ciclo volta a ganhar força.',
    },
    {
      shortText: 'Ceder alimenta o próximo',
      draftText: 'Se eu cedo agora, o próximo impulso vem mais forte. Resistir aqui enfraquece o ciclo.',
    },
  ],
  deserve: [
    {
      shortText: 'Eu mereço paz',
      draftText: 'Eu mereço paz, clareza e respeito por mim. Não alguns minutos que depois viram culpa.',
    },
    {
      shortText: 'Merecer não é ceder',
      draftText: 'Me dar o que me derruba não é recompensa. Merecer é me proteger agora.',
    },
    {
      shortText: 'Recompensa de verdade',
      draftText: 'A recompensa real é terminar esse momento inteiro, sem me entregar ao impulso.',
    },
  ],
  'already-ruined': [
    {
      shortText: 'Ainda dá pra parar',
      draftText: 'Eu não preciso piorar isso. Ainda dá para parar aqui e quebrar a sequência agora.',
    },
    {
      shortText: 'Um erro não decide tudo',
      draftText: 'Um erro não apaga meu progresso. O próximo passo ainda está nas minhas mãos.',
    },
    {
      shortText: 'Recomeça agora',
      draftText: 'Se eu volto agora, esse momento vira retomada, não sentença.',
    },
  ],
  'no-one-knows': [
    {
      shortText: 'Eu vou saber',
      draftText: 'Mesmo em segredo, eu vou saber. E carregar isso depois pesa em mim.',
    },
    {
      shortText: 'Segredo não protege',
      draftText: 'O segredo não me poupa das consequências internas. Ele só me deixa mais dividido.',
    },
    {
      shortText: 'Meu respeito conta',
      draftText: 'O respeito que eu tenho por mim também está em jogo agora.',
    },
  ],
  'just-relief': [
    {
      shortText: 'Alívio curto, peso longo',
      draftText: 'Isso promete aliviar agora, mas devolve mais peso depois. Não é o alívio que eu realmente preciso.',
    },
    {
      shortText: 'Não resolve, só adia',
      draftText: 'Esse caminho não resolve o que eu sinto. Só empurra a dor e me cobra mais caro depois.',
    },
    {
      shortText: 'Preciso de cuidado real',
      draftText: 'Se eu preciso aliviar, eu preciso de descanso, respiração ou apoio. Não disso.',
    },
  ],
  loneliness: [
    {
      shortText: 'Isso não é conexão',
      draftText: 'O que eu estou sentindo é carência, e isso não me dá conexão. Só me deixa mais vazio depois.',
    },
    {
      shortText: 'Carência pede cuidado',
      draftText: 'Se é carência, eu preciso de cuidado real, não de algo que me isola mais.',
    },
    {
      shortText: 'Não vou me abandonar',
      draftText: 'Estar carente não é motivo para me abandonar. Posso me acolher sem cair no mesmo ciclo.',
    },
  ],
  'no-harm': [
    {
      shortText: 'Não é neutro',
      draftText: 'Se isso me afasta do foco, da energia e do respeito por mim, então não é algo neutro.',
    },
    {
      shortText: 'O preço vem depois',
      draftText: 'Talvez o dano não apareça na hora, mas ele cobra depois no meu foco, na minha paz e na forma como eu me vejo.',
    },
    {
      shortText: 'Faz mal em mim',
      draftText: 'Pode parecer pequeno agora, mas faz mal em mim e me afasta do homem que eu quero ser.',
    },
  ],
  later: [
    {
      shortText: 'Depois vem mais fraco',
      draftText: 'Se eu adio para depois, eu chego mais cansado e com menos força. O melhor momento é agora.',
    },
    {
      shortText: 'Adiar alimenta o ciclo',
      draftText: 'Quando eu empurro para depois, o ciclo ganha mais espaço e eu fico mais vulnerável.',
    },
    {
      shortText: 'A força nasce agora',
      draftText: 'A força que eu quero construir aparece nesta decisão, não em algum momento ideal.',
    },
  ],
  'last-time': [
    {
      shortText: 'A última é não ceder',
      draftText: 'A única última vez que importa é esta: a vez em que eu não entro de novo.',
    },
    {
      shortText: 'Despedida é armadilha',
      draftText: 'Quando parece uma despedida final, quase sempre é o ciclo tentando me puxar de volta.',
    },
    {
      shortText: 'Entrar de novo não encerra',
      draftText: 'Fazer mais uma vez não fecha nada. Só reabre o padrão que eu quero romper.',
    },
  ],
  testing: [
    {
      shortText: 'Teste que já sei o resultado',
      draftText: 'Eu já conheço o resultado desse teste. Não é curiosidade, é o ciclo tentando voltar com outra roupa.',
    },
    {
      shortText: 'Não existe entrar com distância',
      draftText: 'Não existe testar com distância. Entrar é entrar. Eu já aprendi isso da pior forma.',
    },
    {
      shortText: 'Saber o final é suficiente',
      draftText: 'Conheço esse caminho de ponta a ponta. Saber como ele termina é motivo suficiente pra não começar.',
    },
  ],
  overconfident: [
    {
      shortText: 'Ir bem é razão pra proteger',
      draftText: 'Ir bem é exatamente quando o ciclo tenta uma brecha. Não vou desperdiçar o que construí por descuido.',
    },
    {
      shortText: 'Progresso não é desconto',
      draftText: 'Se eu estou indo bem, esse é o motivo pra proteger, não pra relaxar. O progresso não é desconto.',
    },
    {
      shortText: 'Uma vez é o começo',
      draftText: 'Uma vez nunca é só uma vez. Eu conheço esse padrão. Não hoje.',
    },
  ],
}

// ── Consequence groups ─────────────────────────────────────────────────────

export interface ConsequenceGroup {
  label: string
  items: string[]
}

export const CONSEQUENCE_GROUPS: ConsequenceGroup[] = [
  {
    label: 'Emocional',
    items: [
      'Culpa que não sai do dia',
      'Ansiedade e agitação sem motivo',
      'Levo dias para voltar ao normal',
      'Me sinto distante de mim mesmo',
    ],
  },
  {
    label: 'Energia e foco',
    items: [
      'Perco energia sem conseguir explicar',
      'Durmo mal naquela noite',
      'Fico travado sem conseguir focar',
      'Perco vontade de fazer o que gosto',
    ],
  },
  {
    label: 'Identidade e relações',
    items: [
      'Me afasto de quem amo',
      'Traio meu próprio progresso',
      'Perco respeito por mim mesmo',
      'Perco clareza sobre o que realmente importa',
      'Me sinto um homem dividido',
    ],
  },
]

export const CONSEQUENCES_OPTIONS = CONSEQUENCE_GROUPS.flatMap((group) => group.items)
