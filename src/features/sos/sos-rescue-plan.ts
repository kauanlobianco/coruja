import type { GameId } from '../games/GamesHub'
import type { SosConfiguration, UserProfile } from '../../core/domain/models'

interface SosRescueTrapOption {
  id: string
  text: string
  responseText: string
}

interface SosRescuePlan {
  entryLine: string
  presenceLine: string
  presenceTitle: string
  presencePhrases: string[]
  momentLine: string
  trapLine: string
  instructionLine: string
  groundingLine: string
  motivationLine: string
  shieldLine: string
  actionLine: string
  motivation: string
  consequence: string
  responseAnchor: string
  triggerHighlights: string[]
  activeTrap: SosRescueTrapOption
  quickActions: string[]
  fallbackResponse: string
  trapOptions: SosRescueTrapOption[]
  recommendedGame: GameId
  alternativeGames: GameId[]
  mentorSuggestions: string[]
}

const defaultTrapOptions: SosRescueTrapOption[] = [
  {
    id: 'sos-relief',
    text: 'So quero aliviar isso agora.',
    responseText: 'Isso promete alivio rapido, mas me deixa pior depois. Se eu atravessar estes minutos, eu continuo no controle.',
  },
  {
    id: 'sos-one-time',
    text: 'Uma parte de mim quer ceder so desta vez.',
    responseText: 'Se eu preciso me convencer, isso ja e um alerta. O passo mais forte agora e nao entrar no ciclo de novo.',
  },
  {
    id: 'sos-give-up',
    text: 'Parece que eu vou acabar desistindo.',
    responseText: 'Nao preciso decidir minha vida inteira agora. So preciso proteger os proximos minutos.',
  },
]

export type { SosRescuePlan, SosRescueTrapOption }

function lowerFirst(value: string) {
  if (!value) return value
  return value.charAt(0).toLowerCase() + value.slice(1)
}

function pushUnique(items: string[], value: string) {
  if (!items.includes(value)) {
    items.push(value)
  }
}

// Keeps the first sentence up to maxLength chars — avoids mid-word cuts
function shortenLine(value: string, maxLength = 65) {
  const firstSentence = value.split(/[.!?]/).find(Boolean)?.trim() ?? value.trim()
  if (firstSentence.length <= maxLength) return `${firstSentence}.`.replace('..', '.')
  return `${firstSentence.slice(0, maxLength).trimEnd()}...`
}

// Truncates trap text for display inside the orb (keeps it readable at small size)
function shortenTrap(text: string, max = 24) {
  const clean = text.replace(/^["']|["']$/g, '').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max).trimEnd()}…`
}

// Situational recognition — names the trigger context in plain language
function buildMomentLine(triggers: string[]) {
  const highlights = triggers.filter(Boolean).slice(0, 2)

  if (highlights.length >= 2) {
    return `${highlights[0]} e ${lowerFirst(highlights[1])} costumam abrir essa janela.`
  }

  if (highlights.length === 1) {
    return `${highlights[0]} costuma abrir essa janela.`
  }

  return 'Esse pico é real. E ele vai passar.'
}

// Concrete physical action — short and directive, matched to user's triggers
function buildActionLine(triggers: string[]) {
  const lower = triggers.map((t) => t.toLowerCase())

  if (lower.some((t) => t.includes('celular') || t.includes('computador') || t.includes('redes'))) {
    return 'Larga o celular agora.'
  }

  if (lower.some((t) => t.includes('sozinho') || t.includes('quarto'))) {
    return 'Sai do quarto. Muda o ambiente.'
  }

  if (lower.some((t) => t.includes('madrugada') || t.includes('cansaco') || t.includes('cansaço'))) {
    return 'Lava o rosto. Acende a luz.'
  }

  return 'Levanta. Respira. Fica aqui.'
}

function buildQuickActions(triggers: string[]) {
  const normalized = triggers.map((trigger) => trigger.toLowerCase())
  const actions: string[] = []

  if (normalized.some((trigger) =>
    trigger.includes('celular') ||
    trigger.includes('computador') ||
    trigger.includes('redes sociais'))
  ) {
    pushUnique(actions, 'Larga a tela e deixa o celular longe por 5 minutos')
  }

  if (normalized.some((trigger) =>
    trigger.includes('sozinho') ||
    trigger.includes('quarto'))
  ) {
    pushUnique(actions, 'Sai do quarto e vai para um lugar mais aberto da casa')
  }

  if (normalized.some((trigger) =>
    trigger.includes('madrugada') ||
    trigger.includes('cansaco') ||
    trigger.includes('cansaço'))
  ) {
    pushUnique(actions, 'Lava o rosto e acende a luz para quebrar o automatico')
  }

  pushUnique(actions, 'Bebe agua agora')
  pushUnique(actions, 'Faz 10 flexoes ou agachamentos para tirar o corpo da inercia')
  pushUnique(actions, 'Abre a janela ou anda por 2 minutos sem o celular na mao')

  return actions.slice(0, 4)
}

export function buildSosRescuePlan(
  profile: UserProfile,
  configuration: SosConfiguration | null,
): SosRescuePlan {
  const trapOptions =
    configuration?.traps.length
      ? configuration.traps.slice(0, 3).map((trap) => ({
          id: trap.id,
          text: trap.text,
          responseText: trap.responseText,
        }))
      : defaultTrapOptions

  const motivation =
    profile.motivations.find(Boolean) ??
    'Seu proximo passo ainda importa.'

  const consequence =
    configuration?.consequences.find(Boolean) ??
    'Ceder agora so prolonga o que esta te machucando.'

  const activeTrap = trapOptions[0] ?? defaultTrapOptions[0]
  const triggerHighlights = profile.triggers.filter(Boolean).slice(0, 3)
  const responseAnchor = activeTrap.responseText
  const quickActions = buildQuickActions(profile.triggers)

  // ── Orb rotating lines ───────────────────────────────────────────────────
  //
  // Order is intentional — follows crisis-intervention logic:
  // 1. Presence       — land. User needs to feel held before anything else.
  // 2. Recognition    — name the trigger situation, no shame.
  // 3. Defusion       — expose the cognitive trap by naming it.
  // 4. Value anchor   — reconnect with why they're doing this.
  // 5. Their voice    — the response they wrote for themselves.
  // 6. Directive      — one concrete physical action to break the cycle.

  // 1. Pure presence — no data, no analysis, just "I'm here"
  const presenceLine = 'Fica aqui. Estou com você.'

  // 2. Situational recognition — names the trigger context
  const momentLine = buildMomentLine(profile.triggers)

  // 3. Cognitive defusion — direct, no hedging
  const trapLine = `Sua cabeça está vendendo "${shortenTrap(activeTrap.text)}". Você já conhece esse truque.`

  // 4. Value anchor — present tense, not reported
  const motivationLine = `${motivation} — é isso que você está protegendo.`

  // 5. User's own shield response — their voice back to them
  const shieldLine = shortenLine(responseAnchor, 65)

  // 6. Physical directive — short and contextual
  const actionLine = buildActionLine(profile.triggers)

  // Grounding fallback (used in verbose contexts only)
  const instructionLine = 'Não decide nada agora.'
  const groundingLine = 'Voce nao precisa resolver sua vida inteira neste minuto. So precisa atravessar este pico sem obedecer ao impulso.'

  return {
    entryLine: 'Resgate em andamento',
    presenceLine,
    presenceTitle: 'Fica comigo.',
    presencePhrases: [
      'Eu ja li esse padrao.',
      'Nao negocia com isso agora.',
      triggerHighlights[0] ? `${triggerHighlights[0]} costuma abrir essa brecha.` : 'Seu escudo ja esta ativo.',
      'Volta para o presente comigo.',
    ],
    momentLine,
    trapLine,
    instructionLine,
    groundingLine,
    motivationLine,
    shieldLine,
    actionLine,
    motivation,
    consequence,
    responseAnchor,
    triggerHighlights,
    activeTrap,
    quickActions,
    fallbackResponse:
      'Essa vontade vai passar. Se eu ganhar os proximos minutos, eu continuo no controle.',
    trapOptions,
    recommendedGame: 'stroop',
    alternativeGames: ['find', 'memory'],
    mentorSuggestions: [
      `Estou no pico agora. Minha armadilha está em "${activeTrap.text}".`,
      'Fica comigo por 2 minutos e me dá um próximo passo simples.',
      `Me lembra da minha resposta: "${responseAnchor}"`,
    ],
  }
}
