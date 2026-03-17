import type { CheckInEntry } from './models'

export function toDayKey(dateLike: string | Date) {
  const date = typeof dateLike === 'string' ? new Date(dateLike) : new Date(dateLike)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString()
}

export function hasCheckInToday(checkIns: CheckInEntry[], now = new Date()) {
  const today = toDayKey(now)
  return checkIns.some((entry) => toDayKey(entry.createdAt) === today)
}

export function buildCheckInStrategy(input: {
  craving: number
  mentalState: string
  triggers: string[]
}) {
  const { craving, mentalState, triggers } = input

  if (craving >= 8) {
    return 'Craving muito alta. Salve este check-in e vá direto para o SOS com respiração guiada e interrupção imediata do ambiente gatilho.'
  }

  if (mentalState === 'ansioso') {
    return 'Seu padrão hoje pede desaceleração: respiração curta, afastar o celular por 15 minutos e reduzir exposição ao gatilho principal.'
  }

  if (triggers.includes('Celular a noite')) {
    return 'Ajuste o ambiente noturno: carregador longe da cama, tela fora de alcance e uma rotina de desligamento previsível.'
  }

  if (triggers.length > 0) {
    return `Hoje o foco é reduzir atrito com ${triggers[0].toLowerCase()}. Escolha uma ação pequena, executável nos próximos 10 minutos.`
  }

  return 'Hoje vale manter o básico: rotina simples, ambiente previsível e uma ação concreta para não depender só de motivação.'
}
