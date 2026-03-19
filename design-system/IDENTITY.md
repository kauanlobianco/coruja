# Coruja Ember DS

## Analise da Home

A Home define a direcao visual do produto com um contraste muito claro entre base escura fria e pontos de calor emocional. O tom dominante e escuro, futurista, acolhedor e focado em recuperacao com energia.

### Padroes extraidos

- Cores principais:
  - Base: `#0D0F1A`, `#1B1F3C`, `#232848`, `#121521`
  - Texto: `#E9E6E2`, `#7B879D`
  - CTA azul: `#2AA5C0`, `#258BB6`, `#277BC4`, `#3055CF`
  - Laranja/ambar: `#EC9E32`, `#E35B2E`, `#F97316`, `#FBBF24`
  - Sucesso: `#409672`
  - Erro: `#B14343`
  - Roxo de apoio: `#4353CB`
- Gradientes:
  - Hero mesh principal com laranja/ambar expandido sobre base escura.
  - CTA azul/ciano para acao principal.
  - Gradiente vermelho para SOS/Panico.
- Tipografia:
  - Fonte principal: `Satoshi`
  - Hierarquia forte com `800` e `900` nos titulos.
  - Display do streak em `56px`, topo de tela em `22px`, cards em `15-19px`.
- Espacamentos recorrentes:
  - `8`, `12`, `16`, `18`, `20`, `24`
  - Padding de cards entre `16-24px`
  - Gaps mais frequentes em `12`, `16`, `18`
- Raios:
  - Botao base `12px`
  - Card padrao `16px`
  - Card de ferramenta `20px`
  - Hero `28px`
  - Pills e badges `999px`
- Sombras:
  - Sombras profundas e suaves, sempre combinadas com highlight interno sutil.
  - Uso frequente de `inset 0 1px 0 rgba(255,255,255,0.04-0.14)` para efeito premium.
- Iconografia:
  - `lucide-react`
  - Traco limpo, moderno, leve, coerente com o tom minimalista/futurista.
- Interacao:
  - Hover/press discreto com `translateY(-1px)` ou `scale(0.97-0.985)`
  - Primario em azul, secundario em outline, perigo em vermelho
  - Estados ativos com glow, ponto, borda colorida ou preenchimento tonal
- Estrutura dos cards:
  - Blocos compactos, com informacao priorizada no topo
  - Rotulos pequenos em uppercase
  - Uso de icone em container arredondado e metricas com forte contraste

## Color Board

### Primary Gradient

Gradiente central do sistema:

- `#EC9E32`
- `#E35B2E`
- `#F97316`
- `#FBBF24`

Uso recomendado:

- Hero principal e destaques de progresso
- Backgrounds de conquista e “momento positivo”
- Progress bar premium
- Badges de meta atingida
- Estados de celebracao e energia

### Background Layers

- `bg/base`: `#0D0F1A`
- `bg/baseMuted`: `#0B0D16`
- `bg/card`: `#1B1F3C`
- `bg/cardElevated`: `#232848`
- `bg/cardStrong`: `#121521`
- `bg/analytics`: `#1A2040`

### Text Palette

- `text/primary`: `#E9E6E2`
- `text/secondary`: `#7B879D`
- `text/tertiary`: `rgba(233, 230, 226, 0.72)`
- `text/inverted`: `#FFFFFF`
- `text/emphasisDark`: `#0E1120`

### Accent Colors

- CTA azul: `#268EBA`
- Ciano de apoio: `#2BB5C4`
- Indigo estrutural: `#384A94`
- Roxo de analytics: `#4353CB`
- Vermelho de alerta: `#B14343`
- Rosa de erro suave: `#FF8F8F`
- Dourado motivacional: `#FBBF24`

### Semantic Colors

- Success: `#409672`
- Warning: `#EC9E32`
- Error: `#B14343`
- Info: `#268EBA`
- Neutral: `#7B879D`

## Tipografia

| Nivel | Tamanho | Peso | Line-height | Letter-spacing |
| --- | --- | --- | --- | --- |
| Display | 56 | 900 | 1.0 | -0.04em |
| H1 | 22 | 800 | 1.1 | -0.03em |
| H2 | 19 | 800 | 1.18 | -0.03em |
| H3 | 15 | 700 | 1.3 | -0.02em |
| Body | 14 | 400 | 1.55 | 0 |
| Body Strong | 14 | 600 | 1.5 | 0 |
| Caption | 12 | 500 | 1.4 | 0.01em |
| Label | 11 | 700 | 1.35 | 0.02em |
| Overline | 10 | 700 | 1.2 | 0.08em |

## Spacing, Radius e Shadows

### Spacing

- Escala base: `4, 8, 12, 16, 20, 24, 28, 32, 40, 48`
- Inset de tela: `16`
- Topbar: `20`
- Card compact: `16`
- Card padrao: `20-24`

### Radius

- Button: `12`
- Card: `16`
- Featured card: `20`
- Hero: `28`
- Bottom nav: `24`
- Icon container: `14-16`
- Pill/avatar/progress: `999`

### Shadows

- Surface base: `0 16px 38px rgba(0,0,0,0.24)` + inset highlight
- Surface premium: `0 24px 54px rgba(0,0,0,0.26)` + glow frio
- CTA: `0 14px 28px rgba(27,37,102,0.34)` / `rgba(236,151,49,0.26)`
- Alerta: `0 12px 26px rgba(106,31,31,0.34)`

## Componentes Base

### Card

- Variantes:
  - `default`
  - `featuredGradient`
  - `negativeStatus`
- Tokens:
  - background: `bg/card`, `bg/cardElevated`, `brand.primaryGradient`
  - radius: `card`, `cardFeatured`
  - typography: `h3`, `body`, `caption`

### Button

- Variantes:
  - `primary` (CTA azul)
  - `secondary` (outline azul)
  - `ghost` (texto/acento)
  - `danger`
  - `ember` (quando a interface pedir calor/conquista)
- Estados:
  - default
  - hover
  - active
  - disabled

### Badge / Pill

- Variantes:
  - `section`
  - `motivation`
  - `status`
  - `achievement`
- Tokens:
  - radius: `pill`
  - typography: `overline` ou `label`
  - cores por semantica

### Bottom Navigation Bar

- Base translcida com blur e borda superior clara
- Tab ativa em azul/indigo
- CTA central de Panico em vermelho com gradiente proprio

### Icon Container

- Fundo translcido ou tonal
- Radius `14-16`
- Glow e inset highlight sutil

### Status Indicator

- `active`: verde
- `inactive`: vermelho/rose
- `pending`: ambar
- `info`: azul

### Progress Bar

- Base: trilho translcido
- Fill default: gradiente azul
- Fill conquista: gradiente ember

### Section Header

- Overline uppercase + titulo forte
- Pode receber meta secundaria pequena alinhada a direita

## Principios Visuais

- Escuro com calor: a base e noturna, mas a energia vem de laranja/ambar vivo.
- Firmeza acolhedora: nada frio demais, nada gamer demais; o visual apoia decisao e cuidado.
- Profundidade sem ruído: usar sombra, blur e gradiente para camada, nao para excesso.
- Acao clara: azul para seguir, vermelho para emergencia, ember para conquista.
- Emocao funcional: o design pode ser bonito, mas cada brilho precisa reforcar estado ou prioridade.

## Uso do Gradiente Laranja

Use o gradiente ember quando o app quiser transmitir:

- conquista
- energia
- foco
- movimento
- reforco positivo

Evite usar o gradiente ember como fundo padrao de toda tela. Ele funciona melhor como “momento”, nao como textura constante.

## O que evitar

- Roxo puro como identidade central
- Cards claros ou cinzas chapados
- Muitas cores competindo no mesmo bloco
- Botao principal em mais de uma cor dentro da mesma tela
- Uso do vermelho fora de risco, SOS ou erro
