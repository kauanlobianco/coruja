# Nova arquitetura congelada

Este documento passa a ser a referencia estrutural do `coruja` para as proximas fases.

## Camadas oficiais

### `src/app`

Responsavel por:

- bootstrap
- providers
- router
- composicao do estado global

Nao deve conter:

- regra de negocio de feature
- logica nativa especifica
- parse de dados de dominio

### `src/core`

Responsavel por:

- contratos centrais de dominio
- persistencia local
- integracao remota
- adaptadores de plataforma
- configuracoes estruturais do produto

Nao deve conter:

- fluxo visual
- decisao de navegacao de feature

### `src/features`

Responsavel por:

- telas por dominio
- servicos da feature
- storage local da feature quando existir sessao propria
- adapters da feature para `core`

Regra principal:

- uma feature pode consumir contratos publicos de outra, mas nao deve depender da implementacao interna dela

### `src/shared`

Responsavel por:

- layout
- componentes visuais reaproveitaveis
- estrutura de shell

Nao deve conter:

- regra de negocio
- persistencia

## Dominios congelados

Os dominios oficiais do produto agora sao:

- `pre-purchase`
- `account`
- `onboarding`
- `home`
- `check-in`
- `sos`
- `journal`
- `relapse`
- `analytics`
- `blocker`
- `settings`
- `library`

Referencia em codigo:

- `src/core/config/domains.ts`

## Fronteiras de rota

### Fluxo de entrada

- `/pre-purchase`
- `/paywall`
- `/account/required`
- `/account/auth`
- `/onboarding`

### Shell principal do app

- `/app`
- `/analytics`
- `/sos`
- `/library`
- `/settings`
- `/check-in`
- `/journal`
- `/relapse`
- `/blocker`

### Fluxo de sistema

- `/blocked`

## Principios que ficam congelados

1. Existe um unico runtime React.
2. Existe um unico modelo central persistido do app.
3. Feature nativa conversa com React por interface clara.
4. Navegacao de produto fica no router, nao em HTML externo.
5. Monetizacao, auth, backup e blocker sao modulos separados.
6. Regras criticas devem ser portaveis para teste fora da UI.

## Regras de dependencia

### Dependencias permitidas

- `app -> core`
- `app -> features`
- `features -> core`
- `features -> shared`
- `shared -> nada de dominio`

### Dependencias proibidas

- `core -> features`
- `shared -> app`
- feature acessando implementacao interna de outra feature

## O que a Fase 1 fecha

- mapa oficial de dominios
- contrato do estado central
- divisao clara entre persistido, remoto e UI local
- regra de dependencia entre camadas

## O que ainda fica para fases seguintes

- endurecimento total das integracoes
- refino do shell final
- fidelidade de copy e visual
- camada de design, animacoes e identidade
