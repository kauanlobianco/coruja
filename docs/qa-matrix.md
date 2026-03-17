# Matriz de QA

Use esta matriz para revisar o produto por contexto, sem depender apenas de memoria.

## Entradas principais

- novo usuario
- usuario com conta existente
- usuario com takeover
- usuario sem backup remoto

## Estados que precisam ser testados

### Dados

- sem check-ins
- com poucos check-ins
- com historico suficiente para analytics
- com recaida recente
- com bloqueador ligado
- com bloqueador desligado

### Conta

- sem conta vinculada
- com conta vinculada
- com erro de sync
- com restore remoto
- com sessao revogada por outro dispositivo

### Navegacao

- telas dentro do HUD
- telas fora do HUD
- retorno para landing apos logout
- redirecionamento correto apos login

## Regra de aprovacao

Uma fase so deve ser considerada estavel quando:

1. fluxo principal fecha sem ambiguidade
2. estado vazio comunica o que falta
3. estado de erro comunica o que aconteceu
4. proximo passo do usuario fica claro
