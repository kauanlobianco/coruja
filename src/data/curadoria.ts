export type CuradoriaTipo = 'video' | 'podcast' | 'article'

interface CuradoriaTheme {
  accent: string
  accentSoft: string
  glow: string
}

interface CuradoriaArticleSection {
  id: string
  titulo: string
  paragrafos: string[]
}

interface CuradoriaArticleReference {
  label: string
  url: string
}

interface CuradoriaBaseItem {
  id: string
  titulo: string
  subtitulo: string
  descricao: string
  legenda: string
  topicos: string[]
  url: string
  thumb: string
  backdrop: string
  badge?: string
  novo?: boolean
  theme: CuradoriaTheme
}

export interface CuradoriaVideoItem extends CuradoriaBaseItem {
  tipo: 'video'
  canal: string
  duracao: string
  plataforma: 'youtube'
}

export interface CuradoriaPodcastItem extends CuradoriaBaseItem {
  tipo: 'podcast'
  programa: string
  duracao: string
  plataforma: 'youtube' | 'spotify'
}

export interface CuradoriaArticleItem extends CuradoriaBaseItem {
  tipo: 'article'
  fonte: string
  tempo: string
  secoes: CuradoriaArticleSection[]
  referencias: CuradoriaArticleReference[]
}

export type CuradoriaPlayableItem = CuradoriaVideoItem | CuradoriaPodcastItem
export type CuradoriaCatalogItem = CuradoriaVideoItem | CuradoriaPodcastItem | CuradoriaArticleItem

function getYouTubeId(url: string) {
  try {
    const parsedUrl = new URL(url)
    return (
      parsedUrl.searchParams.get('v') ??
      (parsedUrl.hostname.includes('youtu.be') ? parsedUrl.pathname.replace('/', '') : null)
    )
  } catch {
    return null
  }
}

function getYouTubeThumbnail(url: string) {
  const videoId = getYouTubeId(url)
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : ''
}

function createThumbnail(params: {
  eyebrow: string
  title: string
  accent: string
}) {
  const { eyebrow, title, accent } = params
  const svg = `
    <svg width="1200" height="675" viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="675" rx="48" fill="#090D18"/>
      <rect width="1200" height="675" rx="48" fill="url(#bg)"/>
      <circle cx="938" cy="122" r="164" fill="${accent}" fill-opacity="0.22"/>
      <circle cx="174" cy="582" r="214" fill="${accent}" fill-opacity="0.12"/>
      <rect x="84" y="76" width="220" height="50" rx="25" fill="rgba(255,255,255,0.08)"/>
      <text x="194" y="108" text-anchor="middle" fill="#F8FBFF" font-size="20" font-family="Satoshi, Arial, sans-serif" font-weight="700" letter-spacing="3">
        ${eyebrow}
      </text>
      <rect x="84" y="404" width="484" height="20" rx="10" fill="rgba(255,255,255,0.10)"/>
      <rect x="84" y="442" width="356" height="20" rx="10" fill="rgba(255,255,255,0.08)"/>
      <text x="84" y="278" fill="#FFFFFF" font-size="52" font-family="Satoshi, Arial, sans-serif" font-weight="800">
        <tspan x="84" dy="0">${title}</tspan>
      </text>
      <g filter="url(#glass)">
        <circle cx="968" cy="470" r="88" fill="rgba(255,255,255,0.12)"/>
        <circle cx="968" cy="470" r="87.5" stroke="rgba(255,255,255,0.18)"/>
      </g>
      <path d="M947 428L1014 470L947 512V428Z" fill="#FFFFFF"/>
      <defs>
        <linearGradient id="bg" x1="132" y1="72" x2="1088" y2="645" gradientUnits="userSpaceOnUse">
          <stop stop-color="#121826"/>
          <stop offset="0.52" stop-color="#0E1322"/>
          <stop offset="1" stop-color="#1B2238"/>
        </linearGradient>
        <filter id="glass" x="856" y="358" width="224" height="224" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
          <feGaussianBlur stdDeviation="12" result="effect1_foregroundBlur_100_2"/>
        </filter>
      </defs>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const emberTheme: CuradoriaTheme = {
  accent: '#EC9E32',
  accentSoft: 'rgba(236, 158, 50, 0.22)',
  glow: 'rgba(227, 91, 46, 0.28)',
}

const orangeTheme: CuradoriaTheme = {
  accent: '#F97316',
  accentSoft: 'rgba(249, 115, 22, 0.22)',
  glow: 'rgba(249, 115, 22, 0.3)',
}

const cyanTheme: CuradoriaTheme = {
  accent: '#5ECFDB',
  accentSoft: 'rgba(94, 207, 219, 0.2)',
  glow: 'rgba(50, 153, 194, 0.26)',
}

const blueTheme: CuradoriaTheme = {
  accent: '#3299C2',
  accentSoft: 'rgba(50, 153, 194, 0.22)',
  glow: 'rgba(67, 83, 203, 0.22)',
}

const purpleTheme: CuradoriaTheme = {
  accent: '#6B63D9',
  accentSoft: 'rgba(107, 99, 217, 0.2)',
  glow: 'rgba(67, 83, 203, 0.28)',
}

export const curadoriaDestaque: CuradoriaVideoItem = {
  id: 'gary-wilson-tedx',
  titulo: 'O Grande Experimento do Porno',
  subtitulo: 'Uma analise profunda e pioneira sobre o impacto neurologico do consumo digital moderno.',
  tipo: 'video',
  canal: 'TEDx Talks (Gary Wilson)',
  descricao:
    'Uma analise profunda e pioneira sobre o impacto neurologico do consumo digital moderno na saude sexual e mental.',
  legenda:
    'Uma boa porta de entrada para entender o quadro geral antes de mergulhar nos episodios mais longos e nos artigos internos.',
  topicos: [
    'impacto do consumo digital na saude sexual',
    'novidade infinita e superestimulacao',
    'efeitos sobre motivacao, libido e foco',
  ],
  thumb: getYouTubeThumbnail('https://www.youtube.com/watch?v=wSF82AwSDiU'),
  backdrop: getYouTubeThumbnail('https://www.youtube.com/watch?v=wSF82AwSDiU'),
  url: 'https://www.youtube.com/watch?v=wSF82AwSDiU',
  duracao: '16 min',
  badge: 'ESSENCIAL',
  plataforma: 'youtube',
  theme: emberTheme,
}

export const curadoriaVideos: CuradoriaVideoItem[] = [
  {
    id: 'andrei-mayer-neurobiologia',
    titulo: 'Como a pornografia afeta o seu cerebro',
    subtitulo: 'Neurobiologia aplicada para entender recompensa, adaptacao e prejuizo.',
    tipo: 'video',
    canal: 'Prof. Dr. Andrei Mayer',
    descricao:
      'Entenda o mecanismo de recompensa e como o cerebro se adapta, e se prejudica, com a superestimulacao visual.',
    legenda:
      'Conteudo forte para quem quer sair da visao moral do problema e compreender o mecanismo neurobiologico por tras do habito.',
    topicos: [
      'via de recompensa e dopamina',
      'adaptacao cerebral ao excesso visual',
      'como o cerebro aprende e piora com repeticao',
    ],
    duracao: '2h 04min',
    thumb: getYouTubeThumbnail('https://www.youtube.com/watch?v=xvLa9cJ1m0E'),
    backdrop: getYouTubeThumbnail('https://www.youtube.com/watch?v=xvLa9cJ1m0E'),
    url: 'https://www.youtube.com/watch?v=xvLa9cJ1m0E',
    novo: true,
    plataforma: 'youtube',
    theme: cyanTheme,
  },
  {
    id: 'eslen-delanogare-dopamina',
    titulo: 'A Mecanica do Vicio e a Dopamina',
    subtitulo: 'Psicologia clinica para reconstruir uma relacao mais saudavel com os estimulos.',
    tipo: 'video',
    canal: 'Eslen Delanogare',
    descricao:
      'Desmistificando os habitos destrutivos e aprendendo a reconstruir uma relacao saudavel com os estimulos do dia a dia.',
    legenda:
      'Bom para quem precisa de uma explicacao mais clinica, objetiva e pratica sobre compulsao, vergonha e rotina.',
    topicos: [
      'habitos destrutivos e identidade',
      'dopamina, rotina e reconstrucao',
      'como sair do ciclo sem romantizacao',
    ],
    duracao: '28 min',
    thumb: getYouTubeThumbnail('https://www.youtube.com/watch?v=SWFspqxtzFw'),
    backdrop: getYouTubeThumbnail('https://www.youtube.com/watch?v=SWFspqxtzFw'),
    url: 'https://www.youtube.com/watch?v=SWFspqxtzFw',
    plataforma: 'youtube',
    theme: orangeTheme,
  },
]

export const curadoriaPodcasts: CuradoriaPodcastItem[] = [
  {
    id: 'huberman-dopamina-foco',
    titulo: 'Controlando a sua Dopamina para Motivacao e Foco',
    subtitulo: 'Aula definitiva sobre como picos de dopamina drenam motivacao diaria.',
    tipo: 'podcast',
    programa: 'Huberman Lab',
    descricao:
      'Uma referencia global para entender como o vicio em picos de dopamina destrói motivacao, foco e satisfacao cotidiana.',
    legenda:
      'Mesmo em ingles, vale muito pela clareza cientifica e pela qualidade das legendas automaticas do YouTube.',
    topicos: [
      'motivacao e baseline de dopamina',
      'picos artificiais e perda de energia',
      'foco sustentado com menos ruido',
    ],
    duracao: '1h 56min',
    thumb: getYouTubeThumbnail('https://www.youtube.com/watch?v=QmOF0crdyRU'),
    backdrop: getYouTubeThumbnail('https://www.youtube.com/watch?v=QmOF0crdyRU'),
    url: 'https://www.youtube.com/watch?v=QmOF0crdyRU',
    plataforma: 'youtube',
    theme: blueTheme,
  },
  {
    id: 'os-socios-jejum-dopamina',
    titulo: 'Jejum de Dopamina e Mudanca de Habitos',
    subtitulo: 'Conversa longa, em portugues, sobre foco, impulsos e reestruturacao de rotina.',
    tipo: 'podcast',
    programa: 'Os Socios Podcast',
    descricao:
      'Uma conversa profunda, em portugues, excelente para ouvir em caminhada ou como substituicao de tempo de tela.',
    legenda:
      'Conecta o tema a rotina real e ajuda o usuario a transformar teoria em higiene digital e mudanca de habito.',
    topicos: [
      'jejum de dopamina sem misticismo',
      'controle de impulsos e ambiente',
      'reestruturacao de habitos a longo prazo',
    ],
    duracao: '1h 32min',
    thumb: getYouTubeThumbnail('https://www.youtube.com/watch?v=uG3Z0rivKe0'),
    backdrop: getYouTubeThumbnail('https://www.youtube.com/watch?v=uG3Z0rivKe0'),
    url: 'https://www.youtube.com/watch?v=uG3Z0rivKe0',
    plataforma: 'youtube',
    theme: cyanTheme,
  },
]

export const curadoriaArtigos: CuradoriaArticleItem[] = [
  {
    id: 'artigo-recompensas-harvard',
    titulo: 'O Vicio que Nao Parece Vicio',
    subtitulo: 'Por que pornografia digital cria compulsao real e como o cerebro muda com o uso.',
    tipo: 'article',
    fonte: 'Harvard Medical School + Gary Wilson',
    tempo: '12 min',
    descricao:
      'Explica como a pornografia digital moderna difere de qualquer estimulo sexual da historia humana e por que ela cria compulsao tao rapidamente.',
    legenda:
      'Base para entender que o problema e biologico e comportamental, nao fraqueza moral.',
    topicos: ['sistema de recompensa', 'dopamina e novidade', 'neuroplasticidade'],
    thumb: createThumbnail({ eyebrow: 'MODULO 1', title: 'O Vicio que Nao Parece Vicio', accent: '#5B5FC7' }),
    backdrop: createThumbnail({ eyebrow: 'MODULO 1', title: 'O Vicio que Nao Parece Vicio', accent: '#5B5FC7' }),
    url: 'https://sitn.hms.harvard.edu/flash/2018/dopamine-smartphones-battle-time/',
    secoes: [
      {
        id: 'vic-1',
        titulo: 'Por que pornografia digital e diferente',
        paragrafos: [
          'Durante a maior parte da historia humana, o acesso a estimulos sexuais exigia presenca fisica, esforco social e contexto emocional. O cerebro evoluiu dentro dessas restricoes. A pornografia digital moderna quebra todas elas ao mesmo tempo: acesso ilimitado, variedade infinita, troca de parceiro a cada clique, intensidade crescente e zero consequencias sociais.',
          'Gary Wilson, autor de "Your Brain on Porn" e responsavel por um dos primeiros estudos sistematicos sobre o tema, descreve isso como uma "supernormal stimulus" — um estimulo tao fora do que o cerebro foi calibrado para processar que ele passa a reagir de forma desproporcional. O resultado nao e prazer aumentado no longo prazo, mas uma escalada de necessidade com satisfacao cada vez menor.',
          'O ponto mais importante aqui e este: ninguem começa querendo criar um vicio. O mecanismo e automatico, biologico e previsivel. A maioria dos usuarios nao percebe o problema ate que tentam parar e descobrem que nao conseguem com facilidade.',
        ],
      },
      {
        id: 'vic-2',
        titulo: 'Como o sistema de recompensa entra em colapso',
        paragrafos: [
          'O nucleo accumbens, parte central da via mesolimbica, processa antecipacao de recompensa. Quando ativado repetidamente com estimulos de alta intensidade, ele se adapta reduzindo a quantidade de receptores de dopamina — um processo chamado downregulation. Com menos receptores, o mesmo nivel de estimulo passa a gerar menos resposta. O usuario precisa de mais, ou de algo mais intenso, para sentir o mesmo efeito.',
          'Isso explica dois fenomenos comuns: a escalada para conteudos cada vez mais extremos e a perda de interesse por estimulos que antes pareciam suficientes. Nao e que o cerebro ficou "viciado em choque" — e que o baseline de resposta caiu, e qualquer coisa abaixo do pico habitual parece apagada.',
          'A neurociencia chama isso de tolerancia, e e o mesmo mecanismo presente em dependencias quimicas. A diferenca e que aqui o "agente" e uma sequencia de imagens e o circuito de busca por novidade — ambos acessiveis 24 horas por dia no bolso.',
        ],
      },
      {
        id: 'vic-3',
        titulo: 'Neuroplasticidade: o cerebro aprende o que voce repete',
        paragrafos: [
          'O cerebro e um orgao que aprende por repeticao. Cada vez que um circuito e ativado, a conexao entre os neuronios envolvidos fica mais forte. Donald Hebb descreveu isso nos anos 1940: "neurons that fire together, wire together." O habito de usar pornografia literalmente constroi uma via neural preferencial — rapida, automatica e cada vez mais resistente.',
          'A boa noticia e que neuroplasticidade funciona nos dois sentidos. Assim como o uso repetido fortaleceu os circuitos do habito, a abstinencia e a construcao de novos comportamentos comecam a enfraquecer essas conexoes e fortalecer outras. O processo e lento — semanas a meses — mas e mensuravel e documentado.',
          'Entender isso muda a relacao com a recuperacao. Nao e uma questao de forca de vontade no momento do impulso. E uma questao de quantas vezes o circuito alternativo foi ativado nos dias anteriores. Cada dia sem o habito e um dia de retreinamento neural, independente de como voce se sentiu durante.',
        ],
      },
      {
        id: 'vic-4',
        titulo: 'O ciclo que se perpetua sozinho',
        paragrafos: [
          'Vicio comportamental segue um ciclo previsivel: gatilho (estresse, tedio, solidao, hora especifica do dia) → craving (urgencia, pensamento intrusivo, racionalizacao) → comportamento → alivio temporario → culpa ou vergonha → aumento de estresse → novo gatilho. Quando esse ciclo se repete centenas de vezes, ele vira automatico. O comportamento comeca a ocorrer quase sem decisao consciente.',
          'Reconhecer o ciclo nao e suficiente para quebra-lo, mas e o primeiro passo necessario. Sem esse mapa, o usuario tenta resolver o problema no momento do pico do craving — que e exatamente o pior momento para tomar decisoes. Com o mapa, e possivel intervir antes: modificar o ambiente, interromper o gatilho ou atravessar o craving com uma tecnica especifica.',
          'Os modulos seguintes desta trilha vao cobrir cada parte desse ciclo em detalhe: o que acontece no corpo nos primeiros dias, como os gatilhos funcionam e como atravessar o impulso sem ceder. Mas tudo começa aqui — entendendo que voce esta lidando com um mecanismo neurologico real, nao com um defeito de carater.',
        ],
      },
    ],
    referencias: [
      { label: 'Harvard SITN — Dopamine, Smartphones & You', url: 'https://sitn.hms.harvard.edu/flash/2018/dopamine-smartphones-battle-time/' },
      { label: 'Gary Wilson — Your Brain on Porn (TEDx)', url: 'https://www.youtube.com/watch?v=wSF82AwSDiU' },
    ],
    theme: purpleTheme,
  },

  // ── MÓDULO 2 ──────────────────────────────────────────────────────────────
  {
    id: 'artigo-dopamina-huberman',
    titulo: 'Dopamina: Do Prazer a Armadilha',
    subtitulo: 'Por que picos artificiais drenam motivacao real e como recuperar sua baseline.',
    tipo: 'article',
    fonte: 'Huberman Lab — Andrew Huberman, PhD',
    tempo: '10 min',
    descricao:
      'Baseado na aula definitiva de Andrew Huberman sobre dopamina, este texto explica como picos repetidos destroem a capacidade de sentir motivacao e satisfacao natural.',
    legenda:
      'Para quem sente que tudo perdeu a graca ou que esta sempre entediado sem estimulo alto.',
    topicos: ['baseline de dopamina', 'picos vs. satisfacao', 'recuperacao da motivacao'],
    thumb: createThumbnail({ eyebrow: 'MODULO 2', title: 'Dopamina: Do Prazer a Armadilha', accent: '#3299C2' }),
    backdrop: createThumbnail({ eyebrow: 'MODULO 2', title: 'Dopamina: Do Prazer a Armadilha', accent: '#3299C2' }),
    url: 'https://www.youtube.com/watch?v=QmOF0crdyRU',
    secoes: [
      {
        id: 'dop-1',
        titulo: 'O que dopamina realmente sinaliza',
        paragrafos: [
          'Dopamina nao e o quimico do prazer — e o quimico da motivacao e da antecipacao. Ela e liberada quando o cerebro percebe que uma recompensa esta chegando, nao quando ela chega. E por isso que o scroll do feed da mais prazer do que terminar de assistir um video, e que o craving de pornografia costuma ser mais intenso do que a propria experiencia.',
          'Andrew Huberman descreve dois estados de dopamina: o baseline — o nivel de fundo que determina o quanto voce se sente motivado, disposto e capaz de encontrar prazer em coisas comuns — e os picos, que sao elevacoes rapidas e breves acima da baseline. O problema nao e ter picos. E que toda vez que um pico ocorre, o baseline subsequente cai abaixo do nivel anterior para compensar.',
          'Esse mecanismo existe por boas razoes evolutivas: apos uma recompensa grande, o cerebro precisa "recarregar" e orientar o organismo a buscar a proxima. O problema e que com estimulos artificiais e de alta intensidade, esse ciclo de pico-e-queda ocorre com frequencia tao alta que o baseline de motivacao fica cronicamente baixo.',
        ],
      },
      {
        id: 'dop-2',
        titulo: 'Por que tudo parece sem graca',
        paragrafos: [
          'Quando o baseline de dopamina cai, o mundo perde cor. Atividades que antes eram satisfatorias — trabalho interessante, exercicio, conversa com amigos, projetos pessoais — passam a parecer planas, exigentes demais ou sem sentido. Nao porque essas coisas mudaram, mas porque o sistema que avalia recompensa esta calibrado para estimulos muito mais intensos.',
          'Isso e especialmente traicoeiro porque a pessoa ainda sente que o problema e externo — trabalho chato, vida sem proposito, pessoas tediosas. A dificuldade em reconhecer que o problema e interno, e que ele e reversivel, e uma das razoes pelas quais tantos usuarios continuam o ciclo por anos sem conectar os pontos.',
          'Huberman descreve um fenomeno chamado "dopamine trough" — o vale de dopamina que segue um pico intenso. Quanto maior o pico, maior e mais longo o vale. Usuarios de pornografia que consomem diariamente vivem nesse vale quase o tempo todo, com breves elevacoes durante o uso. A sensacao de normalidade que buscam so ocorre durante o comportamento — o que e a definicao funcional de dependencia.',
        ],
      },
      {
        id: 'dop-3',
        titulo: 'Jejum de dopamina: o que funciona de verdade',
        paragrafos: [
          'A ideia de "jejum de dopamina" ficou popular, mas o conceito real e mais especifico: nao e evitar qualquer prazer, mas evitar picos artificiais e de alta intensidade por um periodo para que o baseline se recupere. Huberman fala em 10 a 30 dias de abstinencia de estimulos de alta voltagem para comecar a observar melhora na sensacao de motivacao basal.',
          'O que ajuda durante esse processo e nao confundir desconforto com dano. Tedio, ansiedade leve e ausencia de estimulo sao parte do proceso de recalibracao, nao sinais de que algo esta errado. O cerebro precisa aprender a tolerar estados neutros para que eles voltem a ser percebidos como satisfatorios.',
          'O que atrapalha e substituir um pico por outro: comer em excesso, uso excessivo de redes sociais, jogos, compras por impulso. Isso nao zera o contador — apenas troca a fonte de pico. A recuperacao mais eficaz envolve aumentar as fontes de dopamina de baixa intensidade e longo prazo: exercicio constante, conexao social, aprendizado, trabalho com significado.',
        ],
      },
      {
        id: 'dop-4',
        titulo: 'Reconstruindo a capacidade de sentir prazer',
        paragrafos: [
          'A neurociencia chama de "anhedonia" a incapacidade de sentir prazer. Em usuarios de pornografia, ela costuma ser parcial e reversivel — nao e dano permanente, e um estado de baixo baseline que melhora com abstinencia e habitos de recuperacao. A maioria relata melhora significativa entre 30 e 90 dias, com variacao individual grande.',
          'O que acelera a recuperacao nao e passividade, mas construcao ativa de fontes de recompensa natural. Exercicio fisico e um dos maiores estimuladores de dopamina de alta qualidade — elevar a baseline sem criar vale profundo depois. Sono regular, exposicao ao sol pela manha, frio moderado, aprendizado e conexoes sociais genuinas tambem contribuem de forma significativa.',
          'O objetivo nao e nunca mais sentir prazer intenso. E recalibrar o sistema para que coisas simples voltem a parecer boas. Quando isso acontece — e acontece — a recuperacao começa a se sustentar por si mesma, porque a vida sem o habito passa a parecer genuinamente melhor, nao apenas mais disciplinada.',
        ],
      },
    ],
    referencias: [
      { label: 'Huberman Lab — Controlling Your Dopamine', url: 'https://www.youtube.com/watch?v=QmOF0crdyRU' },
    ],
    theme: blueTheme,
  },

  // ── MÓDULO 3 ──────────────────────────────────────────────────────────────
  {
    id: 'artigo-abstinencia-flatline',
    titulo: 'Os Primeiros 30 Dias',
    subtitulo: 'O que esperar fisicamente e emocionalmente na fase inicial da recuperacao.',
    tipo: 'article',
    fonte: 'ISSM + literatura clinica sobre abst. comportamental',
    tempo: '10 min',
    descricao:
      'Guia pratico e honesto para atravessar as primeiras semanas sem pornografia, incluindo a flatline, a irritabilidade e as oscilacoes de humor.',
    legenda:
      'Para quem esta nos primeiros dias ou se prepara para comecar e quer saber o que esta por vir.',
    topicos: ['abstinencia comportamental', 'flatline', 'primeiros 30 dias'],
    thumb: createThumbnail({ eyebrow: 'MODULO 3', title: 'Os Primeiros 30 Dias', accent: '#4353CB' }),
    backdrop: createThumbnail({ eyebrow: 'MODULO 3', title: 'Os Primeiros 30 Dias', accent: '#4353CB' }),
    url: 'https://www.issm.info/sexual-health-qa/is-hypersexuality-sometimes-called-sex-addiction-a-real-health-condition',
    secoes: [
      {
        id: 'abs-1',
        titulo: 'O que acontece nos primeiros dias',
        paragrafos: [
          'Nos primeiros 3 a 7 dias sem pornografia, o cerebro percebe a ausencia do estimulo habitual e responde com sinais de busca: pensamentos intrusivos frequentes, irritabilidade, dificuldade de concentracao e ansiedade difusa. Isso nao e fraqueza — e o sistema de recompensa operando exatamente como foi condicionado. Ele ainda esta esperando o estimulo que aprendeu a antecipar.',
          'A literatura clinica sobre comportamentos compulsivos descreve essa fase como semelhante a sintomas leves de abstinencia em dependencias quimicas: agitacao, insonia, oscilacoes de humor e hipersensibilidade a frustracoes cotidianas. A intensidade varia com a frequencia e duracao do uso anterior — usuarios diarios de anos costumam ter primeira semana mais dura do que usuarios esporadicos.',
          'O erro mais comum nessa fase e interpretar o desconforto como sinal de que algo deu errado, ou de que a abstinencia esta fazendo mal. Nao esta. O desconforto e a evidencia de que o cerebro esta sendo obrigado a funcionar diferente. Atravessar essa fase intacto e o investimento mais importante que o usuario pode fazer em todo o processo.',
        ],
      },
      {
        id: 'abs-2',
        titulo: 'A fase plana (flatline) — o que e e por que assusta',
        paragrafos: [
          'Entre 1 e 6 semanas de abstinencia, muitos usuarios vivenciam o que a comunidade de recuperacao chama de flatline: queda abrupta de libido, sensacao de apatia emocional, ausencia de desejo sexual e sensacao de "apagamento". Isso costuma assustar, especialmente homens jovens que interpretam a queda de libido como dano permanente ou perda de masculinidade.',
          'A flatline nao e permanente e nao indica dano. Ela reflete o periodo em que o sistema nervoso esta recalibrando seus receptores e o cerebro esta reduzindo a sensibilidade aos estimulos de alta intensidade. Em termos neurologicos, e o processo de upregulation dos receptores de dopamina — o inverso da downregulation causada pelo uso excessivo.',
          'O que piora a flatline e tentar "testar" o sistema com estimulos moderados, buscar alivio em outros picos artificiais ou catastrofizar o estado atual. O que ajuda e aceitar que esse periodo e parte da cura, manter rotina, ter paciencia com a propria sensualidade e entender que a libido real — baseada em conexao humana e desejo genuino — costuma voltar entre 30 e 90 dias, geralmente mais intensa do que antes do habito.',
        ],
      },
      {
        id: 'abs-3',
        titulo: 'Semanas 2 a 4: o periodo mais traicoeiero',
        paragrafos: [
          'Depois da primeira semana, muitos usuarios se sentem bem o suficiente para acreditar que estao "curados" — e caem na recaida mais classica do processo. O senso de controle retornando, a flatline ainda nao instalada e a memoria do desconforto inicial ja apagada criam uma janela de vulnerabilidade alta. A vigilancia nessa fase precisa ser igual ou maior do que na primeira semana.',
          'Entre as semanas 2 e 4, as recaidas costumam ser precedidas por racionalizacoes sofisticadas: "so uma vez", "ja provei que consigo parar", "estou estressado e mereco um alivio". O cerebro compulsivo e muito bom em construir justificativas plausíveis — exatamente porque usa os mesmos circuitos de raciocinio que o resto do pensamento. Identificar esse padrao de pensamento como sintoma, nao como argumento valido, e uma habilidade critica.',
          'Ter um plano para situacoes de alto risco nessa fase — saber de antecipadamente o que fazer quando o craving aparecer, quem chamar, para onde ir, qual atividade usar como interrupcao — reduz dramaticamente a taxa de recaida. O proximo modulo desta trilha cobre exatamente essa preparacao.',
        ],
      },
      {
        id: 'abs-4',
        titulo: 'Como medir progresso de verdade',
        paragrafos: [
          'Um dos maiores erros na recuperacao e usar a contagem de dias como unica metrica. Dias sem o comportamento importam, mas eles contam o que voce nao fez — nao o que voce construiu. Usuarios que apenas "aguentam" sem criar novas rotinas, habilidades de enfrentamento e fontes de satisfacao tendem a recair logo apos marcos importantes (30, 90 dias) porque o habitual retorna quando a novidade da mudanca passa.',
          'Medir progresso de forma mais completa inclui: frequencia e intensidade dos cravings ao longo do tempo (tendem a diminuir e encurtar), capacidade de atravessar um craving sem ceder, qualidade do sono, nivel de energia e concentracao, presenca em relacoes sociais e retorno de interesse em atividades que o habito havia deslocado.',
          'Os primeiros 30 dias sao o periodo mais dificil e o mais importante. Nao porque tudo se resolve em 30 dias — nao se resolve — mas porque e nele que os circuitos alternativos comecam a ser construidos, a flatline costuma passar e a sensacao de que a vida sem o habito e possivel comeca a aparecer de forma concreta.',
        ],
      },
    ],
    referencias: [
      { label: 'ISSM — Compulsive Sexual Behavior Disorder', url: 'https://www.issm.info/sexual-health-qa/is-hypersexuality-sometimes-called-sex-addiction-a-real-health-condition' },
    ],
    theme: purpleTheme,
  },

  // ── MÓDULO 4 ──────────────────────────────────────────────────────────────
  {
    id: 'artigo-oms-cid11',
    titulo: 'Condicao Clinica, Nao Fraqueza Moral',
    subtitulo: 'O que a OMS classifica, o que isso significa e por que muda tudo na recuperacao.',
    tipo: 'article',
    fonte: 'OMS — CID-11 / Codigo 6C72',
    tempo: '8 min',
    descricao:
      'A pornografia compulsiva se encaixa no Transtorno do Comportamento Sexual Compulsivo reconhecido pela OMS. Entender isso transforma vergonha em estrategia.',
    legenda:
      'Para quem se ve como fraco ou sem carater e precisa de um enquadramento mais honesto do problema.',
    topicos: ['CID-11 / codigo 6C72', 'culpa vs. responsabilidade', 'tratamento e acompanhamento'],
    thumb: createThumbnail({ eyebrow: 'MODULO 4', title: 'Condicao Clinica, Nao Fraqueza Moral', accent: '#6B63D9' }),
    backdrop: createThumbnail({ eyebrow: 'MODULO 4', title: 'Condicao Clinica, Nao Fraqueza Moral', accent: '#6B63D9' }),
    url: 'https://icd.who.int/browse/2025-01/mms/en',
    secoes: [
      {
        id: 'oms-1',
        titulo: 'O que a OMS reconhece formalmente',
        paragrafos: [
          'A Classificacao Internacional de Doencas da OMS — CID-11, em vigor desde 2022 — inclui o Transtorno do Comportamento Sexual Compulsivo sob o codigo 6C72. Os criterios centrais sao: padrao persistente de falha em controlar impulsos sexuais intensos, preocupacao com atividade sexual que domina o pensamento, continuacao do comportamento apesar de consequencias negativas e sofrimento significativo.',
          'O reconhecimento nao patologiza libido alta nem qualquer orientacao sexual. O que o qualifica como transtorno e a perda recorrente de controle combinada com prejuizo real na vida do individuo. Muitos usuarios que chegam ao Coruja preenchem esses criterios sem nunca terem recebido essa leitura clinica — o que os deixa girando entre "estou exagerando" e "sou uma pessoa horivel", sem nunca chegar a "tenho um problema tratavel".',
          'Esse reconhecimento institucional importa por uma razao pratica: ele abre caminho para uma abordagem baseada em tratamento, nao em punição. Em vez de prometer nunca mais falhar, o foco passa a ser construir habilidades de regulacao, ambientes de apoio e estrategias de enfrentamento — as mesmas ferramentas usadas em outros transtornos de controle de impulsos.',
        ],
      },
      {
        id: 'oms-2',
        titulo: 'A diferenca entre culpa e responsabilidade',
        paragrafos: [
          'Culpa e vergonha sao estados emocionais que sinalizam violacao de valores proprios. Em doses moderadas, eles podem motivar mudanca. Em excesso, eles paralisam, geram sofrimento toxico e frequentemente aumentam o comportamento que tentam corrigir — porque a pessoa busca alivio emocional no mesmo comportamento pelo qual se sente culpada.',
          'Responsabilidade e diferente. Ela reconhece o problema sem punição e orienta para acao. Uma pessoa responsavel diz: "Tenho um padrao de comportamento que esta me prejudicando e preciso trabalhar para mudar." Isso e compativel com ter um transtorno reconhecido. Ter um problema clinico nao remove responsabilidade — ele apenas remove a crueldade desnecessaria que muitos se impõem.',
          'A pesquisa sobre adesao a tratamento mostra consistentemente que vergonha alta esta associada a menor adesao e a mais recaidas. Usuarios que conseguem se ver com compaixao clinica — "tenho um problema que posso trabalhar" em vez de "sou fraco e nojento" — apresentam melhores resultados a longo prazo.',
        ],
      },
      {
        id: 'oms-3',
        titulo: 'O que diferencia compulsao de desejo alto',
        paragrafos: [
          'Uma questao comum e: "como saber se eu realmente tenho um problema ou se estou sendo duro comigo mesmo?" Os criterios clinicos ajudam. Compulsao nao e querer muito — e quando o comportamento ocorre mesmo diante de decisao contraria, quando tentativas de parar falharam repetidamente, quando ele compromete trabalho, relacoes ou responsabilidades e quando o sofrimento associado e persistente e significativo.',
          'Libido alta, curiosidade sexual e interesse por conteudo erotico nao sao problemas em si. A linha cruza quando o comportamento e mais forte do que a intenção — quando a pessoa decide parar e o habito continua, ou quando o tempo e energia gastos ja causam dano concreto em outras areas da vida.',
          'Se voce chegou ao Coruja, provavelmente ja tem resposta para essa pergunta. O objetivo aqui nao e convencer ninguem de que tem um problema maior do que o que percebe. E mostrar que reconhecer o problema com precisao clinica — sem inflar nem minimizar — e o que permite uma abordagem que realmente funciona.',
        ],
      },
      {
        id: 'oms-4',
        titulo: 'Quando buscar acompanhamento profissional',
        paragrafos: [
          'O Coruja oferece ferramentas de automonitoramento, psicoeducacao e suporte comportamental. Para muitas pessoas, isso e suficiente como ponto de partida e como suporte continuo. Para outras — especialmente quando o habito coexiste com depressao, ansiedade social severa, trauma ou outras dependencias — acompanhamento profissional nao e opcional, e necessario.',
          'Psicologos especialistas em TCC (terapia cognitivo-comportamental) e terapeutas com experiencia em comportamentos compulsivos sao os profissionais mais indicados. Em casos com sofrimento emocional severo, o acompanhamento psiquiatrico pode ser util para avaliar se ha condicoes coexistentes que precisam de tratamento proprio.',
          'Buscar ajuda profissional nao e fracasso — e a decisao mais pragmatica disponivel. O problema e que muitos usuarios adiam esse passo por vergonha, por achar que "ainda nao e tao grave" ou por nao saber como encontrar o profissional certo. Se voce se identifica com isso, vale dizer: o momento ideal para buscar ajuda e antes do proximo fundo do poco, nao depois.',
        ],
      },
    ],
    referencias: [
      { label: 'WHO ICD-11 — Codigo 6C72', url: 'https://icd.who.int/browse/2025-01/mms/en' },
    ],
    theme: purpleTheme,
  },

  // ── MÓDULO 5 ──────────────────────────────────────────────────────────────
  {
    id: 'artigo-gatilhos-recaida',
    titulo: 'Gatilhos, Impulsos e Como Atravessa-los',
    subtitulo: 'Mapeie o que dispara o craving e aprenda a passar pelo impulso sem ceder.',
    tipo: 'article',
    fonte: 'TCC + Urge Surfing (Marlatt & Witkiewitz)',
    tempo: '11 min',
    descricao:
      'O modulo mais pratico da trilha. Cobre o mapeamento de gatilhos pessoais, a tecnica de urge surfing e o planejamento de resposta para situacoes de alto risco.',
    legenda:
      'Para quem ja entende o mecanismo e quer ferramentas concretas para o dia a dia.',
    topicos: ['mapeamento de gatilhos', 'urge surfing', 'plano de resposta'],
    thumb: createThumbnail({ eyebrow: 'MODULO 5', title: 'Gatilhos, Impulsos e Como Atravessa-los', accent: '#EC9E32' }),
    backdrop: createThumbnail({ eyebrow: 'MODULO 5', title: 'Gatilhos, Impulsos e Como Atravessa-los', accent: '#EC9E32' }),
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2220019/',
    secoes: [
      {
        id: 'gat-1',
        titulo: 'O que e um gatilho e por que ele e automatico',
        paragrafos: [
          'Gatilho e qualquer coisa — situacao, emocao, horario, ambiente, pensamento — que o cerebro associou ao comportamento por repeticao. A associacao foi construida durante cada uso: o cerebro registrou o contexto junto com a recompensa, e agora esse contexto ativa o circuito de busca mesmo antes de haver decisao consciente. Isso explica por que o craving parece chegar "do nada" — na verdade, veio de um gatilho que passou despercebido.',
          'Gatilhos mais comuns para pornografia incluem: solitude noturna, estresse nao processado, tedio prolongado, rejeicao social ou emocional, imagens ou sons especificos (mesmo nao eroticos) que foram associados ao habito, e determinados horarios ou rotinas (horario de dormir, chegada em casa, almoco sozinho). A lista e pessoal e vale ser mapeada com cuidado.',
          'O mapeamento nao precisa ser complexo. Uma semana de observacao honesta — anotando quando o craving apareceu, o que estava acontecendo antes, como a pessoa estava se sentindo e onde estava — costuma revelar 3 a 5 padroes principais. Conhecer esses padroes e o primeiro passo para intervir antes do pico do impulso, nao durante.',
        ],
      },
      {
        id: 'gat-2',
        titulo: 'Urge surfing: a tecnica de observar sem agir',
        paragrafos: [
          'Urge surfing foi desenvolvida pelo psicologo G. Alan Marlatt como tecnica de prevencao de recaidas baseada em mindfulness. A ideia central e que um impulso e uma onda: tem inicio, pico e diminuicao. Em media, um craving intenso dura entre 10 e 20 minutos se nao for alimentado. A maioria das recaidas ocorre porque o usuario age para aliviar o impulso antes que ele diminua naturalmente.',
          'O urge surfing funciona assim: quando o craving surge, em vez de lutar contra ele ou ceder, o usuario o observa como experiencia fisica e mental. Onde voce sente no corpo? Como e a qualidade do pensamento? O que a voz interna esta dizendo? Essa observacao cria distancia entre o impulso e a acao — distancia que e exatamente o que o habito automatico eliminou.',
          'Com pratica, o usuario descobre que e capaz de atravessar o impulso sem agir. Cada vez que isso acontece, o circuito de resposta automatica fica um pouco mais fraco — e a confianca de que "consigo passar por isso" fica mais forte. Isso nao elimina futuros cravings, mas muda fundamentalmente a relacao com eles: de ameaca inevitavel para experiencia que pode ser atravessada.',
        ],
      },
      {
        id: 'gat-3',
        titulo: 'Planejamento de resposta: o que fazer antes do craving',
        paragrafos: [
          'O problema de tentar decidir o que fazer no momento do craving e que o cortex pre-frontal — a regiao responsavel por decisao de longo prazo e controle de impulsos — fica parcialmente inibido quando o sistema de recompensa esta fortemente ativado. Decidir na hora e jogar com desvantagem. A solucao e tomar a decisao antes, quando o estado emocional esta neutro.',
          'Um plano de resposta simples funciona assim: identifique seus 3 principais gatilhos, defina uma acao especifica para cada um, e pratique a transicao antes de precisar dela. Exemplo: "Se sentir craving a noite sozinho em casa, vou colocar tenis e sair para caminhar por 10 minutos. Se nao quiser sair, vou ligar para alguem ou abrir o app de meditacao." A acao nao precisa ser perfeita — precisa ser especifica e acessivel.',
          'Ambientes tambem fazem parte do plano. Reduzir acesso — remover apps, usar softwares de bloqueio, nao carregar o celular para o quarto, deixar portas abertas — diminui a chance de sucumbir a um momento de impulso. Isso nao e fraqueza; e design de ambiente, e e uma das intervencoes mais eficazes que existe para comportamentos compulsivos.',
        ],
      },
      {
        id: 'gat-4',
        titulo: 'O que fazer depois de uma recaida',
        paragrafos: [
          'Recaidas sao comuns na recuperacao de qualquer comportamento compulsivo. A pergunta nao e se voce vai recair, mas o que voce vai fazer quando isso acontecer. A resposta a esse momento define muito mais o progresso a longo prazo do que a propria recaida.',
          'O erro mais caro e o que os pesquisadores chamam de "efeito de violacao da abstinencia": a recaida gera culpa → a culpa gera sofrimento → o sofrimento ativa o ciclo de busca de alivio → nova recaida. Sair dessa espiral exige interromper a espiral de auto-punicao antes que ela se complete. Isso significa reconhecer o que aconteceu, analisar o que precipitou (qual gatilho, qual estado emocional, qual lacuna no plano) e retomar sem catastrofizar.',
          'Uma recaida nao apaga o progresso biologico acumulado. O cerebro nao volta ao estado do dia zero. Dias de abstinencia construiram coneccoes reais que permanecem. O que a recaida muda e o numero no streak — nao o trabalho feito. Reconhecer isso permite retomar mais rapido, com mais inteligencia sobre o que falhou, em vez de entrar em colapso emocional.',
        ],
      },
    ],
    referencias: [
      { label: 'Marlatt & Witkiewitz — Relapse Prevention', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2220019/' },
    ],
    theme: emberTheme,
  },

  // ── MÓDULO 6 ──────────────────────────────────────────────────────────────
  {
    id: 'artigo-identidade-vida',
    titulo: 'Reconstruindo Quem Voce E',
    subtitulo: 'Como o habito moldou sua identidade — e como construir uma versao real e sustentavel de si mesmo.',
    tipo: 'article',
    fonte: 'Psicologia Positiva + TCC identitaria',
    tempo: '10 min',
    descricao:
      'O ultimo modulo foca no longo prazo: quem voce quer ser, como o habito afetou relacoes e autoimagem, e como construir uma identidade que nao precisa de evasao para existir.',
    legenda:
      'Para quem ja passou das primeiras semanas e quer entender o horizonte da recuperacao.',
    topicos: ['identidade', 'relacoes', 'proposito e longo prazo'],
    thumb: createThumbnail({ eyebrow: 'MODULO 6', title: 'Reconstruindo Quem Voce E', accent: '#059669' }),
    backdrop: createThumbnail({ eyebrow: 'MODULO 6', title: 'Reconstruindo Quem Voce E', accent: '#059669' }),
    url: 'https://positivepsychology.com/self-identity/',
    secoes: [
      {
        id: 'id-1',
        titulo: 'Como o habito molda identidade',
        paragrafos: [
          'Um habito de anos nao e apenas um comportamento repetido — ele molda a forma como a pessoa se ve. Usuarios de longa data frequentemente descrevem a sensacao de que o habito faz parte de quem sao, que sem ele nao sabem o que fazer com o tempo, que a excitacao artificial se tornou o modo padrao de processar emocao. Quando param, surge a pergunta: quem sou eu sem isso?',
          'Essa questao nao e psicologicamente trivial. Parte do trabalho da recuperacao e construir uma resposta concreta a ela — nao abstrata ("quero ser uma pessoa melhor"), mas especifica: quais valores voce quer viver, como voce quer se relacionar, o que voce quer criar ou contribuir, quais versoes de si mesmo voce admira. Sem uma identidade alternativa clara, a recuperacao fica como um buraco onde o habito estava — e buracos tendem a ser preenchidos.',
          'O psicologo James Clear, em "Habitos Atomicos", descreve o processo de mudanca de habito como um processo de mudanca de identidade. O nivel mais profundo da mudanca nao e "quero parar de fazer X" — e "quero ser o tipo de pessoa que nao faz X". Esse enquadramento muda o que conta como evidencia de progresso: cada dia sem o habito nao e so ausencia, e uma prova de que voce e a pessoa que disse que queria ser.',
        ],
      },
      {
        id: 'id-2',
        titulo: 'O impacto real em relacoes e intimidade',
        paragrafos: [
          'O uso prolongado de pornografia afeta relacoes de formas que nem sempre sao imediatas ou obvias. A pesquisa nessa area mostra associacao com reducao de satisfacao relacional, comparacao entre parceiros reais e fantasias construidas pelo habito, dificuldade de presenca emocional durante intimidade e, em alguns casos, disfuncao erotica adquirida — dificuldade de excitacao com parceiros reais depois de anos condicionando a resposta sexual a um tipo especifico de estimulo.',
          'Isso nao significa que toda relacao foi danificada ou que o dano e irreversivel. Significa que a recuperacao frequentemente inclui trabalho nessa area: reconectar com o que e atraente em pessoas reais, praticar presenca emocional genuina na intimidade, e em alguns casos ter conversas dificeis com parceiros. Essa parte do trabalho e menos linear do que a abstinencia biologica, mas e igualmente importante.',
          'Para usuarios sem parceiro, o habito frequentemente funcionou como substituto de conexao real — especialmente em momentos de solidao, rejeicao ou dificuldade social. Parte da recuperacao e aprender a tolerar esses estados sem evasao, e buscar conexao de formas que construam algo ao longo do tempo em vez de apenas aliviar o momento.',
        ],
      },
      {
        id: 'id-3',
        titulo: 'Preenchendo o espaco com algo real',
        paragrafos: [
          'Abstinencia cria tempo e capacidade cognitiva. Usuarios que pararam frequentemente reportam que nao tinham ideia de quanto tempo o habito consumia — nao apenas o tempo do comportamento em si, mas o tempo de pensamento obsessivo, de planejamento, de arrependimento e de recuperacao emocional depois.',
          'O que voce faz com esse espaco define muito da qualidade da recuperacao. Nao no sentido de que precisa "preencher o buraco" com algo produtivo imediatamente — mas no sentido de que construir areas de vida que geram satisfacao real e proposito e o que faz a recuperacao se sustentar sem esforco. Exercicio, aprendizado, criacao, servico, conexao social genuina, trabalho com significado — qualquer dessas areas, desenvolvida com consistencia, muda progressivamente o como a vida sem o habito parece.',
          'O objetivo a longo prazo nao e nunca sentir craving. E construir uma vida tao cheia de coisas que importam que o habito perde atratividade. Isso nao acontece por decreto — acontece um dia, uma escolha e uma construcao de cada vez. E aqui, no modulo 6, que isso fica claro: a recuperacao nao e um processo de remover algo, e um processo de construir.',
        ],
      },
      {
        id: 'id-4',
        titulo: 'Sucesso a longo prazo — o que parece na pratica',
        paragrafos: [
          'Recuperacao a longo prazo nao parece vitoria constante. Parece dias normais em que o habito simplesmente nao aconteceu. Parece situacoes que antes seriam alto risco passando sem drama. Parece cravings que aparecem, passam e nao viram eventos. Parece relacoes mais presentes, trabalho com mais foco e sono sem culpa.',
          'Pessoas que se recuperam com consistencia raramente descrevem o processo como uma conquista heróica. Descrevem como um conjunto de escolhas que foi ficando mais facil ao longo do tempo, porque cada escolha constroiu algo — um habito alternativo, uma rede de apoio, uma versao mais clara de si mesmo.',
          'O Coruja esta aqui para acompanhar esse processo com ferramentas, dados e educacao. Mas o processo e seu. Voce chegou ao fim da trilha com mais entendimento do mecanismo, das estrategias e do horizonte do que a maioria das pessoas que passa anos nesse ciclo. O que voce faz com isso — comecando hoje — e o que vai determinar onde voce esta em 6 meses.',
        ],
      },
    ],
    referencias: [
      { label: 'James Clear — Habitos Atomicos', url: 'https://jamesclear.com/atomic-habits' },
      { label: 'Positive Psychology — Self-Identity', url: 'https://positivepsychology.com/self-identity/' },
    ],
    theme: cyanTheme,
  },
]

export const curadoriaCatalogo: CuradoriaCatalogItem[] = [
  curadoriaDestaque,
  curadoriaVideos[0],
  curadoriaPodcasts[0],
  curadoriaVideos[1],
  curadoriaPodcasts[1],
  curadoriaArtigos[0],
  curadoriaArtigos[1],
  curadoriaArtigos[2],
]
