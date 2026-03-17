# Contrato do estado central

Este documento define o que pertence ao `AppModel` e como cada parte deve ser tratada.

Referencia em codigo:

- `src/core/domain/models.ts`
- `src/app/state/app-state.tsx`
- `src/core/storage/app-preferences.ts`

## Objetivo

Impedir que o app volte a ter:

- multiplas fontes de verdade
- persistencia duplicada
- regra importante escondida em tela
- mistura entre estado de produto e estado de UI

## Fonte de verdade principal

O estado persistido do produto e o `AppModel`.

Ele guarda:

- perfil
- streak
- check-ins
- journal
- recaidas
- blocker
- analytics
- conta vinculada
- metadata de backup
- snapshot de SOS

## Blocos oficiais do `AppModel`

### `hasCompletedOnboarding`

Define se o usuario ja saiu da fase de setup.

### `hasProAccess`

Define o estado de monetizacao liberada.

### `profile`

Guarda:

- nome
- meta em dias
- motivos
- gatilhos
- `startDate`
- `avatarId`

### `streak`

Guarda:

- streak atual
- melhor streak
- ultima recaida

Importante:

- `current` nao e confiado cegamente como numero salvo
- ele deve sempre continuar sujeito ao recalculo por data

### `checkIns`

Cada item deve guardar:

- `createdAt`
- fissura
- estado mental
- gatilhos
- notas
- estrategia
- se escalou para SOS

### `journalEntries`

Entradas livres e entradas de recaida.

### `relapses`

Cada recaida precisa preservar:

- streak anterior
- meta anterior
- nova meta
- causa
- vinculo opcional com journal

### `blocker`

Guarda:

- ligado ou desligado
- dominios bloqueados
- tentativas bloqueadas

### `analytics`

Guarda apenas configuracao e metadata leve:

- periodo selecionado
- ultimo recompute

O relatorio em si continua derivado.

### `account`

Guarda a identidade vinculada ao backup:

- `userId`
- `email`
- `lastBackupAt`
- `lastRestoreAt`
- `lastLeaseRefreshAt`

### `backup`

Guarda somente metadata operacional:

- status
- ultimo erro
- se ja existe backup remoto conhecido

### `sos`

Guarda:

- ultima abertura
- total de sessoes

## O que pode ser persistido localmente

Persistir:

- todo o `AppModel`
- offset do relogio demo
- sessao temporaria do `pre-purchase`

Nao persistir como fonte paralela:

- numero de streak avulso fora do modelo
- preferencias soltas de feature que duplicam dados do modelo
- flags de navegacao que conflitam com o router

## O que fica remoto

No Supabase e no sistema de conta:

- auth
- snapshot remoto do `AppModel`
- lease de dispositivo
- metadata remota de sessao

## O que nao deve entrar no `AppModel`

Estes itens devem continuar fora do modelo central:

- indice atual de carousel
- pergunta atual aberta na UI
- modal aberto ou fechado
- estado de loading local da tela
- filtros e drafts transitorios

## Invariantes do contrato

1. `profile.startDate` continua sendo a base do streak.
2. `relapse` reseta `profile.startDate`.
3. `checkIns` continuam respeitando um por dia.
4. `journalEntries` podem receber reflexao de recaida.
5. `blocker` nao pode divergir silenciosamente do runtime nativo.
6. `account` e `backup` nao controlam sozinhos a UI; eles informam o router e as telas.

## Relogio demo

O relogio demo e uma camada estrutural de teste.

Ele precisa influenciar:

- streak
- check-in diario
- analytics por periodo
- timestamps de entradas criadas em modo demo

Ele nao substitui:

- leases reais de sessao
- horario real de processos remotos do backend

## Resultado esperado

Se este contrato for respeitado:

- as features param de competir por estado
- o design pode entrar depois sem mexer em regra
- backup e restore continuam previsiveis
- o app fica pronto para testes mais pesados sem deriva estrutural
