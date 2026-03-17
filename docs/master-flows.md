# Fluxos mestres do produto

Este documento define as jornadas principais que o app deve preservar.

## 1. Novo usuario

Sequencia:

1. `pre-purchase`
2. quiz
3. loading
4. identidade
5. sintomas
6. diagnostico
7. carrosseis
8. prova social
9. plano
10. paywall
11. `account/auth` travado em cadastro
12. `onboarding`
13. `home`

Regra:

- esse fluxo nunca deve expor `login` depois da compra

## 2. Usuario existente

Sequencia:

1. `pre-purchase`
2. CTA `Ja tenho conta`
3. `account/auth` travado em login
4. restore
5. `home`

Regra:

- se a conta ja tiver sessao ativa em outro dispositivo, o takeover deve acontecer

## 3. Fluxo diario

Sequencia base:

1. `home`
2. `check-in`
3. estrategia do dia
4. `sos` se necessario
5. retorno para `home` ou `journal`

Regra:

- apenas um check-in por dia calendario

## 4. Fluxo de recaida

Sequencia:

1. `home` ou `settings`
2. `relapse`
3. nova meta
4. causa
5. reflexao opcional
6. retorno para `home`

Regra:

- resetar `startDate`
- preservar historico

## 5. Fluxo de protecao

Sequencia:

1. `home`
2. `blocker`
3. ativacao
4. bloqueio real
5. `blocked`
6. retorno para `sos`, `blocker` ou `home`

Regra:

- estado visual e nativo nao podem divergir

## 6. Fluxo de conta e backup

Sequencia:

1. cadastro ou login
2. vinculacao da conta
3. backup inicial ou restore
4. heartbeat de sessao
5. takeover se outro dispositivo assumir

Regra:

- conta e backup nao devem alterar a estrutura da jornada do usuario alem do necessario
