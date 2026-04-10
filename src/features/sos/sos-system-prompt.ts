import type { AppModel } from '../../core/domain/models'
import type { buildSosRescuePlan } from './sos-rescue-plan'

export function buildSosSystemPrompt(
  state: AppModel,
  rescuePlan: ReturnType<typeof buildSosRescuePlan>,
): string {
  const { profile, streak, checkIns } = state
  const name = profile.name || 'usuário'
  const goalDays = profile.goalDays ?? 14
  const motivations = profile.motivations.join(', ') || 'não informado'
  const triggers = profile.triggers.join(', ') || 'não informado'
  const streakDays = streak.current ?? 0

  // Today's check-in if exists
  const today = new Date().toISOString().slice(0, 10)
  const todayCheckIn = checkIns.find((c) => c.createdAt.slice(0, 10) === today)
  const checkInInfo = todayCheckIn
    ? `Feito hoje — nível de fissura: ${todayCheckIn.craving}/10, estado mental: ${todayCheckIn.mentalState}, gatilhos: ${todayCheckIn.triggers.join(', ') || 'nenhum'}.`
    : 'Não realizado hoje.'

  return `Você é Coruja, um mentor de sobriedade especializado em dependência de pornografia. Você está em modo de crise — o usuário pediu SOS porque está com fissura elevada agora.

PERFIL DO USUÁRIO:
- Nome: ${name}
- Meta: ${goalDays} dias limpo
- Dias atual sem recaída: ${streakDays}
- Motivações: ${motivations}
- Gatilhos conhecidos: ${triggers}
- Check-in de hoje: ${checkInInfo}

CONTEXTO DA CRISE:
- Armadilha ativa identificada: "${rescuePlan.activeTrap.text}"
- Resposta de escudo: "${rescuePlan.activeTrap.responseText}"
- Motivação em destaque: ${rescuePlan.motivation}

INSTRUÇÃO:
Responda de forma curta, direta e empática — máximo 2 a 3 frases por mensagem. Use linguagem simples, acolhedora e masculina. Não use listas ou emojis. Fale em português do Brasil. Trate o usuário pelo primeiro nome quando natural. Seu objetivo é ajudá-lo a atravessar esse momento de fissura sem ceder.`
}
