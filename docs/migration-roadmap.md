# Roadmap de migracao do legado para o Coruja

## Objetivo desta etapa

Migrar o app antigo para um unico runtime React + Capacitor sem perder as regras de negocio mais sensiveis:

- streak
- check-in diario
- jornal
- recaida
- SOS
- bloqueador nativo
- analytics
- backup de conta
- sessao/dispositivo

O foco agora nao e replicar design. E capturar logica, estado, invariantes e integracoes sem reimportar o HTML gigante.

## Fontes de verdade usadas para este plano

- `PRODUCT_FLOW.md`
- `STATE_MAP.md`
- `ARCHITECTURE.md`
- `REGRESSION_CHECKLIST.md`
- `src/lib/runtimeState.ts`
- `src/lib/deviceAccess.ts`
- `src/lib/syncService.ts`
- `public/pre-compra.html`
- `public/pos-compra.html`

## Principio central

Cada feature sera portada como dominio independente, mas todas passam a depender de um unico modelo central de app.

Base nova:

- um router React
- um estado persistido
- servicos remotos explicitos
- contratos claros entre feature e plugin nativo
- nenhuma regra importante escondida em iframe, `window.location` ou HTML monolitico

## Invariantes que nao podem quebrar

### Boot e onboarding

- install nova deve cair no pre-compra
- usuario onboardado deve cair no app principal
- nome do pre-compra deve preencher onboarding
- onboarding deve gerar baseline de usuario e inicio do streak

### Streak

- streak continua derivado de `dataInicio`
- recaida reseta `dataInicio`
- dashboard nunca deve confiar em numero salvo sem recalculo

### Check-in

- apenas um check-in por dia calendario
- check-in pode abrir o SOS depois de salvar
- analytics depende de check-ins consistentes

### Jornal e recaida

- recaida salva antes da reflexao
- reflexao continua opcional
- recaida pode gerar entrada de jornal do tipo `recaida`

### Bloqueador

- dominio bloqueado precisa registrar tentativa
- Android depende de permissao VPN e plugin nativo
- estado do bloqueador nao pode divergir entre UI e plugin

### Backup e conta

- backup remoto precisa suportar restore e merge
- conta so pode ficar ativa em um dispositivo por vez
- logout precisa limpar sessao sem perder identidade do dispositivo

## Ordem de migracao sugerida

### Fase 1: Fundacao de dominio

Objetivo:

- estabilizar o modelo central do app
- separar entidades persistidas por dominio

Entregas:

- `src/core/domain/models.ts`
- adapters de persistencia local
- calculos puros para streak, check-in diario e recaida

Risco:

- baixo, mas define toda a espinha dorsal das proximas fases

### Fase 2: Onboarding + perfil + motivos

Objetivo:

- substituir completamente o onboarding legado
- consolidar nome, meta, motivos e gatilhos em um unico snapshot

Entregas:

- fluxo React definitivo de onboarding
- inicio de `profile.startDate`
- remocao de dependencia de `Preferences` como fonte paralela

Risco:

- medio, porque onboarding conversa com boot, pre-compra e sync

### Fase 3: Home + streak + dashboard base

Objetivo:

- tirar o `dashboard` do HTML legado
- transformar streak em modulo central do app

Entregas:

- tela principal React
- card de streak
- CTA de check-in
- resumo de recaida recente
- resumo de backup e bloqueador

Risco:

- medio, porque o dashboard no legado aciona quase tudo

### Fase 4: Check-in + SOS

Objetivo:

- portar a rotina diaria mais importante do produto

Entregas:

- formulario de check-in
- regra de um por dia
- geracao de estrategia
- opcao de seguir para SOS apos salvar
- SOS com motivos, respiracao e sessao

Risco:

- medio-alto, porque check-in e SOS afetam analytics e experiencia diaria

### Fase 5: Jornal + recaida

Objetivo:

- portar o loop emocional e o reset de progresso sem drift

Entregas:

- lista de journal
- nova entrada
- visualizacao de entrada
- fluxo multi-etapa de recaida
- reset de `startDate`
- criacao opcional de journal de recaida

Risco:

- alto, porque mexe no streak e na integridade historica do usuario

### Fase 6: Analytics

Objetivo:

- separar calculo de metricas da UI

Entregas:

- seletores puros para score, tendencia, gatilho dominante e consistencia
- tela analytics React
- empty state com gate minimo de 3 dias unicos de check-in

Risco:

- medio, desde que seja derivado de dados ja migrados

### Fase 7: Conta + backup + sync

Objetivo:

- portar a parte mais sensivel de persistencia remota

Entregas:

- modulo de auth
- account link local
- upload e restore explicitos
- estrategia de merge
- substituicao gradual do comportamento via iframe

Risco:

- muito alto
- esta fase precisa de testes manuais e talvez ambiente Supabase dedicado

### Fase 8: Sessao por dispositivo

Objetivo:

- manter a restricao de um dispositivo por conta, mas sem acoplar isso ao dominio de gatilhos

Entregas:

- servico dedicado de lease
- armazenamento remoto separado de `triggers`
- heartbeat explicito
- tratamento de conflito

Risco:

- muito alto
- e uma refatoracao estrutural, nao apenas de UI

### Fase 9: Bloqueador

Objetivo:

- portar a feature mais critica de Android com a arquitetura correta

Entregas:

- dominio `blocker`
- configuracao React
- contrato TS para plugin nativo
- adaptador Android para VPN permission + start/stop + status
- registro de tentativas bloqueadas

Risco:

- muito alto
- aqui nao basta migrar UI; precisa respeitar o comportamento nativo

## Decisao sobre o bloqueador Android

O bloqueador nao deve ser migrado como "mais uma tela".

Ele precisa de:

- interface TypeScript de alto nivel
- implementacao web fallback
- implementacao Android real
- estado persistido versionado
- estrategia de falha segura quando permissao ou VPN falharem

Proposta de estrutura:

```text
src/features/blocker/
  model/
  services/
  native/
  screens/
android/app/src/main/java/.../blocker/
```

## Decisao sobre backup e conta

Backup de conta e lock de dispositivo devem ser tratados como plataforma de dados, nao como detalhe de tela.

Proposta:

- `features/account`
- `features/backup`
- `features/session-lease`

Separacao importante:

- dados de recuperacao do usuario
- sessao autenticada
- lease de dispositivo
- snapshot de backup remoto

No legado, isso esta muito acoplado em `profiles`, `triggers`, `reboot_account` e iframes.

## Matriz de prioridade real

### Alta prioridade agora

- modelo central de dominio
- onboarding definitivo
- dashboard base
- streak
- check-in
- SOS
- recaida
- jornal

### Alta prioridade tecnica, mas depois da base de produto

- backup
- auth
- lease de dispositivo
- bloqueador Android

### Derivado depois que os dados base existirem

- analytics

## Sequencia recomendada para os proximos ciclos

1. Consolidar o modelo central e adaptar `app-state` para ele.
2. Portar onboarding definitivo.
3. Criar home/dashboard com streak real.
4. Portar check-in e SOS.
5. Portar jornal e recaida.
6. Portar analytics sobre os dados React ja migrados.
7. Entrar em backup e conta.
8. Fechar com bloqueador Android e sessao por dispositivo.

## O que evitar

- copiar `pos-compra.html` como JSX gigante
- manter fontes de verdade duplicadas
- acoplar compra, sync e boot no mesmo fluxo
- portar o iframe de backup como se fosse parte obrigatoria da nova arquitetura
- misturar regra de gatilho do usuario com lock de dispositivo

## Resultado esperado

No fim da migracao, o Coruja deve ter:

- um unico runtime React
- uma unica arvore de rotas
- um unico modelo persistido
- features portadas por dominio
- plugins nativos isolados
- regras criticas testaveis fora da UI
