# Fase 5 executada: hardening das features criticas

Esta fase endurece os pontos mais sensiveis do app para reduzir risco operacional.

## Entregas desta fase

1. Backup remoto com fila, evitando perder a ultima mudanca quando varias mutacoes acontecem em sequencia.
2. Retry automatico de sync ao voltar online ou ao retornar para o app.
3. Restore remoto com diferenca clara entre "sem backup" e "erro remoto".
4. Login mais seguro, sem redirecionar o usuario para um fluxo errado quando a restauracao falha.
5. Bloqueador Android reconciliado com mais firmeza ao desligar a VPN.
6. Calculo de streak mais estavel por dia de calendario.

## Artefatos principais

- `src/app/state/app-state.tsx`
- `src/features/account/services/backup-service.ts`
- `src/features/account/AccountAuthPage.tsx`
- `src/core/domain/streak.ts`

## O que fica congelado

- nenhuma mutacao critica deve depender de uma unica tentativa de upload
- restore remoto nao pode mascarar erro de rede como ausencia de backup
- takeover, backup e restore precisam falhar de forma explicita
- desligar bloqueador precisa tentar reconciliar o estado nativo, nao religar o estado React
- streak deve seguir dias de calendario, nao arredondamento de milissegundos

## Proximo passo natural

Depois desta fase, o caminho mais forte e seguir endurecendo experiencia e estados-limite:

- settings e conta com mensagens mais claras
- casos vazios e erros das features principais
- bateria de regressao dos fluxos criticos
