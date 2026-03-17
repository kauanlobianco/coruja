# Contrato de navegacao

Este documento define como o app separa entrada, shell principal e telas de sistema.

## Escopos oficiais

### `entry`

Rotas:

- `pre-purchase`
- `paywall`
- `account/required`
- `account/auth`
- `onboarding`

Comportamento:

- sem HUD inferior
- sem painel demo lateral
- foco no fluxo em andamento

### `app-shell`

Rotas:

- `home`
- `analytics`
- `sos`
- `library`
- `settings`
- `check-in`
- `journal`
- `relapse`
- `blocker`

Comportamento:

- HUD inferior fixa
- painel demo liberado
- experiencia principal do produto

### `system`

Rotas:

- `blocked`

Comportamento:

- sem HUD inferior
- sem desviar o usuario da situacao critica

## Regras de redirecionamento

### Estado sem conta e sem onboarding

- destino correto: `pre-purchase`

### Estado sem conta e onboarding marcado

- destino correto: `account/required`

### Estado com conta e sem onboarding

- destino correto: `onboarding`

### Estado com conta e onboarding concluido

- destino correto: `home`

## Regras do router

1. rota raiz sempre resolve pelo estado do usuario
2. rotas de entrada nao devem ficar acessiveis para usuario ja dentro do app
3. rotas do shell principal exigem conta vinculada e onboarding concluido
4. telas de sistema nao devem carregar a navegacao principal

## Posicoes estruturais que ficam congeladas

### HUD inferior

Ordem fixa:

1. Home
2. Analytics
3. Panico
4. Biblioteca
5. Settings

### Home

Ordem estrutural:

1. streak
2. CTA principal do dia
3. card de check-in
4. card de journal
5. card de bloqueador
6. motivos

### Entrada

Fluxo sempre linear, sem HUD do app principal.
