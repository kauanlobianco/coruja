import type { GameId } from '../games/GamesHub'
import type { SosConfiguration, UserProfile } from '../../core/domain/models'

interface SosRescueTrapOption {
  id: string
  text: string
  responseText: string
}

interface SosRescuePlan {
  entryLine: string
  motivation: string
  consequence: string
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

  return {
    entryLine: 'Respira. Vamos reduzir a forca desse pico juntos.',
    motivation,
    consequence,
    fallbackResponse:
      'Essa vontade vai passar. Se eu ganhar os proximos minutos, eu continuo no controle.',
    trapOptions,
    recommendedGame: 'stroop',
    alternativeGames: ['find', 'memory'],
    mentorSuggestions: [
      'To no pico agora. Fica comigo por 2 minutos.',
      'Me da um proximo passo simples agora.',
      'Nao quero ceder. Me ajuda a atravessar isso.',
    ],
  }
}
