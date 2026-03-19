# Plano de Aplicacao

## Direcao Geral

A Home passa a ser a referencia central do produto. O restante das telas deve herdar sua base escura, o CTA azul, a tipografia forte e o gradiente ember como assinatura emocional de progresso.

## 1. Analytics / Dashboard

- Gradiente laranja:
  - usar no card de score de evolucao
  - usar em highlights de conquista e metas batidas
  - usar como estado premium do progresso semanal
- Componentes:
  - `Card.default`
  - `Card.featuredGradient`
  - `ProgressBar.default`
  - `ProgressBar.ember`
  - `SectionHeader`
  - `StatusIndicator`
- Hierarquia:
  - header
  - metricas resumidas
  - score hero
  - graficos
  - insights
- Oportunidade emocional:
  - transformar analytics em leitura de avanco, nao so diagnostico frio

## 2. Biblioteca

- Gradiente laranja:
  - hero de descoberta
  - badges de “recomendado agora”
  - cards de pratica curta ou conteudo inspiracional
- Componentes:
  - `SectionHeader`
  - `Card.default`
  - `Card.featuredGradient`
  - `Badge/Pill`
  - `Button.primary`
- Hierarquia:
  - hero introdutorio
  - categorias
  - cards de conteudo
  - acoes rapidas
- Oportunidade emocional:
  - reforcar que a biblioteca e um refugio ativo, nao um arquivo passivo

## 3. Jornal / Nova entrada

- Gradiente laranja:
  - header da folha de escrita
  - estado de entrada salva com sucesso
  - pequenas tags de reflexao/insight
- Componentes:
  - `SectionHeader`
  - `Button.primary`
  - `Button.ember`
  - `Card.default`
  - `Badge/Pill`
- Hierarquia:
  - data e contexto
  - composer
  - lista de entradas
- Oportunidade emocional:
  - dar sensacao de clareza, acolhimento e progresso interno

## 4. Bloqueador

- Gradiente laranja:
  - usar com parcimonia em “protecao reforcada” ou “meta de blindagem”
  - nunca como cor dominante do estado operacional
- Componentes:
  - `StatusIndicator`
  - `Button.primary`
  - `Button.secondary`
  - `Card.default`
  - `Card.negativeStatus`
  - `Badge/Pill`
- Hierarquia:
  - status de protecao
  - toggle principal
  - dominios base
  - dominios customizados
  - historico
- Oportunidade emocional:
  - transmitir firmeza e seguranca, com verde como principal sem perder a linguagem premium da Home

## 5. Settings

- Gradiente laranja:
  - hero de perfil/plano
  - badges de sync concluido ou recursos premium
- Componentes:
  - `SectionHeader`
  - `Card.default`
  - `Card.featuredGradient`
  - `Button.primary`
  - `Button.secondary`
  - `StatusIndicator`
- Hierarquia:
  - perfil
  - assinatura
  - backup
  - seguranca
  - acoes de sistema
- Oportunidade emocional:
  - transformar settings em “centro de controle pessoal”, menos tecnico e mais identitario

## 6. Panico

- Gradiente laranja:
  - usar apenas em mensagens de saida do pico ou “voce conseguiu atravessar”
  - nao competir com o vermelho central da emergencia
- Componentes:
  - `Button.danger`
  - `StatusIndicator`
  - `Card.negativeStatus`
  - `ProgressBar`
- Hierarquia:
  - botao central/acao imediata
  - respiracao
  - timer
  - mensagem de suporte
  - saidas secundarias
- Oportunidade emocional:
  - o vermelho comanda o agora; o ember entra depois como alivio e retomada

## Sequencia Recomendada

1. Consolidar tokens e variaveis semanticas globais.
2. Padronizar Button, Card, Badge/Pill, Bottom Nav, Status e Progress Bar.
3. Aproximar Analytics e Journal da Home.
4. Reestruturar Biblioteca e Settings com heroes e headers consistentes.
5. Refinar Bloqueador e Panico com semantica mais forte de status.
