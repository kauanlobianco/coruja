# Fase 1 executada: congelamento da arquitetura base

Este documento registra o que foi fechado nesta fase para orientar as proximas.

## Entregas desta fase

1. Camadas oficiais congeladas.
2. Dominios oficiais registrados.
3. Contrato do estado central formalizado.
4. Modulos do produto atualizados para refletir o que ja existe e o que ainda falta.

## Artefatos criados ou atualizados

- `docs/new-architecture.md`
- `docs/state-contract.md`
- `src/core/config/domains.ts`
- `src/core/config/modules.ts`

## Decisoes tomadas

### 1. O `AppModel` continua sendo a fonte unica de verdade do produto

Tudo que afeta jornada, persistencia e restore continua orbitando esse modelo.

### 2. O app foi oficialmente dividido por dominios

Os dominios agora deixam de ser apenas pastas e passam a ser contrato de produto.

### 3. Foi congelada a regra de dependencia entre camadas

Isso evita recair na mistura do legado entre HTML, estado solto e regra escondida em UI.

### 4. O relogio demo foi reconhecido como infraestrutura de teste

Ele nao e um detalhe de tela. E uma camada de consistencia para QA e regressao.

## Como usar isso nas proximas fases

Toda nova mudanca deve responder:

1. Em qual dominio ela vive?
2. Ela altera `AppModel` ou e apenas UI local?
3. Ela depende de `core`, de outra feature ou de `shared`?
4. Ela respeita o router e o shell ja congelados?

## Gate de aceite da Fase 1

Esta fase pode ser considerada concluida quando:

- o time consegue localizar qualquer funcionalidade dentro de um dominio
- o contrato do estado esta claro
- nenhuma nova feature e iniciada sem respeitar as dependencias definidas

## Proximo passo natural

A partir daqui, a fase seguinte ideal e:

- endurecer os fluxos mestres e a navegacao em cima dessa arquitetura congelada
