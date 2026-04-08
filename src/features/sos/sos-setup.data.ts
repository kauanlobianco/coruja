export interface MentalTrap {
  id: string
  text: string
  shortLabel: string
}

export interface ResponseSuggestion {
  shortText: string
  draftText: string
}

export interface ConsequenceGroup {
  label: string
  items: string[]
}

export const MENTAL_TRAPS: MentalTrap[] = [
  { id: 'just-today', text: 'Só hoje', shortLabel: 'Só hoje' },
  { id: 'deserve', text: 'Eu mereço isso', shortLabel: 'Eu mereço isso' },
  { id: 'already-ruined', text: 'Já estraguei tudo', shortLabel: 'Já estraguei tudo' },
  { id: 'no-one-knows', text: 'Ninguém vai saber', shortLabel: 'Ninguém vai saber' },
  { id: 'just-relief', text: 'Só pra aliviar', shortLabel: 'Só pra aliviar' },
  { id: 'loneliness', text: 'É só carência', shortLabel: 'É só carência' },
  { id: 'no-harm', text: 'Não faz mal', shortLabel: 'Não faz mal' },
  { id: 'later', text: 'Depois eu paro', shortLabel: 'Depois eu paro' },
  { id: 'last-time', text: 'É a última vez', shortLabel: 'É a última vez' },
]

export const RESPONSE_SUGGESTIONS: Record<string, ResponseSuggestion[]> = {
  'just-today': [
    {
      shortText: 'Convencer já é alerta',
      draftText: 'Se eu preciso me convencer de que é só hoje, isso já é sinal de alerta. Foi assim que esse ciclo começou antes.',
    },
    {
      shortText: 'O ciclo começa aqui',
      draftText: 'O “só hoje” nunca vem sozinho. É aqui que o ciclo volta a ganhar força.',
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
}

export const CONSEQUENCE_GROUPS: ConsequenceGroup[] = [
  {
    label: 'Emocional',
    items: [
      'Me sinto culpado e envergonhado',
      'Fico ansioso e agitado',
      'Demoro dias para me recuperar emocionalmente',
    ],
  },
  {
    label: 'Energia e foco',
    items: [
      'Perco energia e motivação',
      'Durmo mal depois',
      'Perco foco no trabalho ou estudos',
    ],
  },
  {
    label: 'Identidade e relações',
    items: [
      'Me distancio das pessoas que amo',
      'Sinto que traí meu progresso',
      'Perco respeito próprio',
    ],
  },
]

export const CONSEQUENCES_OPTIONS = CONSEQUENCE_GROUPS.flatMap((group) => group.items)
