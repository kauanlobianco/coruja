# Coruja — Design System Definitivo

> Guia de referência visual baseado no código real do app (março/2026).
> A fonte de verdade dos tokens é `src/styles/tokens.css`.
> A fonte de verdade das classes globais é `src/styles/foundation.css`.
> Consulte esta página antes de qualquer trabalho de UI.

---

## 1. Identidade Visual

**O que é o Coruja:** Companion de sobriedade e recuperação para homens. Tom sério, íntimo, forte — não é app de meditação genérico nem estética neon/hype.

**Personalidade visual:** Dark e imersivo, com profundidade e calor contido. Cada tela deve parecer um espaço seguro, não um produto tech frio.

| Atributo | Valor |
|---|---|
| Estilo | Dark OLED + Glassmorphism + Soft Depth |
| Fundo base | Azul profundo quase preto (`#0a0c16`) |
| Primário interativo | Cyan frio e confiante (`#3299c2`) |
| CTA / brand | Ember gradient (âmbar → laranja → ouro) |
| Secundário / streak | Âmbar quente (`#ec9e32`) |
| Fonte | Satoshi (Fontshare) — sem serifa, moderna, neutra |
| Ícones | Lucide React exclusivamente — sem emojis, sem outras libs |
| Modo | Dark only — não há modo claro |

---

## 2. Sistema de Tokens

O projeto tem **três camadas de nomenclatura** de tokens, todas definidas em `src/styles/foundation.css` e `src/styles/tokens.css`. Use a camada mais semântica disponível:

| Camada | Prefixo | Exemplo | Onde definida |
|---|---|---|---|
| Primitivos | `--color-*`, `--space-*`, `--radius-*` | `--color-accent-cyan` | `tokens.css` |
| Semânticos | `--ds-*` | `--ds-color-info-500` | `foundation.css` |
| Atalhos | nenhum | `--text`, `--bg`, `--primary` | `foundation.css` |

> **Regra:** Nunca use hex hardcoded. Prefira tokens semânticos (`--ds-*`) para novos componentes.

---

## 3. Paleta de Cores

### Backgrounds

| Token | Valor | Uso |
|---|---|---|
| `--color-bg-page` | `#0a0c16` | Fundo de página e shell base |
| `--color-bg-page-muted` | `hsl(232 34% 10%)` | App-frame e hero card base |
| `--color-bg-card` | `hsl(232 34% 23% / 0.94)` | `.info-card`, `.form-card`, cards padrão |
| `--color-bg-card-strong` | `hsl(232 36% 18% / 0.96)` | Gradiente inferior de cards, tool cards |
| `--color-bg-card-elevated` | `hsl(232 32% 21%)` | Inputs e superfícies elevadas |
| `--color-bg-surface-subtle` | `rgba(255, 255, 255, 0.04)` | `.chip`, `.status-pill`, tints sutis |
| `--color-bg-overlay` | `rgba(0, 0, 0, 0.70)` | Overlay de modal, backdrops |

**Aliases DS:** `--ds-color-bg-base` → `#0d0f1a`, `--ds-color-bg-card` → `#1b1f3c`, `--ds-color-bg-card-elevated` → `#232848`, `--ds-color-bg-card-strong` → `#121521`

> Nota: Os aliases `--ds-color-bg-*` têm valores ligeiramente distintos dos primitivos — são os valores usados em foundation.css para composição de gradientes.

### Acento Cyan — Primário Interativo

| Token | Valor | Uso |
|---|---|---|
| `--color-accent-cyan` | `#3299c2` | Botões, badges ativos, bordas ativas, nav dots |
| `--color-accent-cyan-light` | `#67bfd2` | Highlights, accents de ícones |
| `--gradient-accent-cyan` | `linear-gradient(135deg, #38a0c7 0%, #4b9fbe 34%, #6489aa 68%, #7a7399 100%)` | Botão secundário, gradiente de progresso leve |

**Aliases DS:** `--ds-color-info-500` → `--color-accent-cyan`, `--ds-color-info-400` → `--color-accent-cyan-light`

### Acento Amber/Ember — Streak, Brand CTA

| Token | Valor | Uso |
|---|---|---|
| `--color-accent-amber` | `#ec9e32` | Chama do streak, warnings, eyebrow background, relapse link |
| `--color-accent-ember` | `#e35b2e` | Terminus do ember gradient |
| `--color-accent-ember-light` | `#f97316` | Mid-stop do ember brand gradient |
| `--color-accent-gold` | `#fbbf24` | Tail do ember gradient, estrelas de rating |
| `--gradient-accent-ember` | `linear-gradient(135deg, #ec9e32 0%, #e35b2e 38%, #f97316 68%, #fbbf24 100%)` | `.button-orange`, progress fill |

**`--ds-gradient-ember-brand`** (CTA principal — `.button-primary`):
```css
radial-gradient(circle at 10% 10%, rgba(79, 172, 254, 0.28) 0%, transparent 40%),
radial-gradient(circle at 90% 5%, rgba(0, 242, 254, 0.18) 0%, transparent 45%),
radial-gradient(circle at 40% 55%, rgba(227, 91, 46, 0.92) 0%, transparent 65%),
radial-gradient(circle at 75% 80%, rgba(249, 115, 22, 0.9) 0%, transparent 55%),
radial-gradient(circle at 0% 100%, rgba(251, 191, 36, 0.8) 0%, transparent 50%),
#0d0e14;
```

### Roxo / Navy — Analytics

| Token | Valor | Uso |
|---|---|---|
| `--color-accent-navy` | `#384a94` | Bordas de cards, alias `--primary` |
| `--color-accent-purple` | `#4353cb` | Analytics accent, `.purple` alias, progress bars |

**Aliases DS:** `--ds-color-primary-500` → navy, `--ds-color-primary-600` → purple

### Cores de Estado

| Token | Valor | Uso |
|---|---|---|
| `--color-success` | `#409672` | Check-in completo, estado positivo |
| `--color-warning` | `#ec9e32` | Alias de amber — warnings |
| `--color-danger` | `#b14343` | Relapse, craving crítico, ações destrutivas |
| `--color-danger-light` | `#ff8f8f` | Texto de danger em backgrounds escuros |

### Texto

| Token | Valor | Uso |
|---|---|---|
| `--color-text-primary` | `#ffffff` | Texto principal, títulos, botões |
| `--color-text-secondary` | `rgba(233, 230, 226, 0.72)` | Labels, captions, texto de suporte |
| `--color-text-muted` | `rgba(255, 255, 255, 0.55)` | Texto terciário, placeholders ativos |
| `--color-text-inverted` | `#0e1120` | Texto escuro sobre amber CTA |

**Alias atalho:** `--text` → `--ds-color-text-primary` (`#e9e6e2`), `--text-muted` → text-secondary, `--muted` → text-secondary

### Bordas

| Token | Valor | Uso |
|---|---|---|
| `--color-border-subtle` | `rgba(255, 255, 255, 0.04)` | Borda hairline — mais comum |
| `--color-border-soft` | `rgba(255, 255, 255, 0.06)` | Borda levemente visível |
| `--color-border-card` | `rgba(255, 255, 255, 0.08)` | Borda padrão de card / input |
| `--color-border-strong` | `rgba(255, 255, 255, 0.12)` | Borda visível — hero, profile card |
| `--color-border-amber` | `rgba(236, 158, 50, 0.22)` | Bordas com tint amber (warnings) |
| `--color-border-divider` | `rgba(255, 255, 255, 0.05)` | Divisores entre itens de lista |

> Nunca use bordas sólidas escuras. Sempre rgba branco sobre fundo escuro.

### Cores de Módulo (Tool Cards na Home)

Cada módulo da home tem um gradiente de fundo sutil:

| Módulo | Tint | Efeito |
|---|---|---|
| Check-in | Cyan (`#38a0c7`) | Leve brilho azul no canto superior |
| Analytics | Purple (`#4353cb`) | Tint roxo difuso |
| SOS | Neutro escuro | Sem tint específico |
| Blocker | Neutro escuro | Borda muda para danger quando off |
| Journal | Neutro escuro | Sem tint específico |
| Relapse | Cyan-blue | Leve tint azulado |

---

## 4. Escala Tipográfica

**Fonte:** Satoshi — importada via Fontshare
```css
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@700,800,900,400,500&display=swap');
font-family: 'Satoshi', system-ui, sans-serif;
```

### Tamanhos e Usos

| Nível | Token | Tamanho | Weight | Uso |
|---|---|---|---|---|
| Display | `--font-size-display` | 56px | 900 | Número do streak (hero) |
| H1 | `--ds-type-h1-size` | 22px | 800 | Topbar title, onboarding title |
| H2 / Subtitle | `--font-size-subtitle` | 19px | 600–700 | Título de card grande, tool card |
| Title | `--font-size-title` | 17px | 600–700 | Título forte de card |
| Label | `--font-size-label` | 15px | 600 | h2 em cards de check-in / commitment |
| UI / Button | `--font-size-ui` | 16px | 700–800 | Texto de botão, CTA |
| Body | `--font-size-body` | 14px | 400 | Corpo de texto geral |
| Small | `--font-size-small` | 13px | 500 | Motivo pills, datas de journal, labels de settings |
| Micro / Caption | `--font-size-micro` | 12px | 400–500 | Estados de check-in, labels de progresso, captions |
| Caption DS | `--font-size-caption` | 11px | 400–500 | Tool card status, histórico de streak |
| Overline | `--font-size-overline` | 10px | 600 | Labels de seção em uppercase, nav labels |

### Hierarquia de Cor do Texto

```
Primário   → var(--color-text-primary)   → #ffffff         (títulos, valores)
Secundário → var(--color-text-secondary) → rgba 72% branco (labels, captions)
Muted      → var(--color-text-muted)     → rgba 55% branco (terciário, nav icons)
```

### Letter-spacing

| Contexto | Valor |
|---|---|
| Títulos display (streak, logo) | `-0.04em` |
| Topbar H1 | `-0.03em` |
| Overline / eyebrow | `+0.08em` |
| Heading padrão | `0.01em` (padrão global `h1-h6`) |

### Line Heights

| Token | Valor | Uso |
|---|---|---|
| `--line-height-tight` | `1` | Número de streak (display) |
| `--line-height-heading` | `1.18` | H2/H3 em tool cards |
| `--line-height-body` | `1.55` | Parágrafos, descrições |
| `--ds-type-h1-line-height` | `1.1` | Topbar title |
| `--ds-type-caption-line-height` | `1.4` | Captions |
| Body padrão `body` | `1.7` | Reset global |

### Font Weights disponíveis

| Token | Valor |
|---|---|
| `--font-weight-medium` | 500 |
| `--font-weight-semibold` | 600 |
| `--font-weight-bold` | 700 |
| `--font-weight-extrabold` | 800 |
| `--font-weight-black` | 900 |

---

## 5. Escala de Espaçamento

| Token | Valor | Uso típico |
|---|---|---|
| `--space-1` | 4px | Gap mínimo, chip padding vertical |
| `--space-2` | 8px | Gap entre ícone e label, gap de pills |
| `--space-3` | 12px | Padding de eyebrow/chip, gap interno pequeno |
| `--space-4` | 16px | Padding de card compacto, gap de lista |
| `--space-5` | 20px | Padding lateral de seções, padding de botão |
| `--space-6` | 24px | Padding de card padrão |
| `--space-8` | 32px | Gap entre seções grandes |
| `--ds-space-10` | 40px | Espaçamento extra (definido em foundation.css) |

### Gaps Especiais

| Token | Valor | Uso |
|---|---|---|
| `--gap-flow` | 18px | Gap vertical entre itens do `home-flow` |
| `--gap-cards` | 16px | Gap entre tool cards |
| `--gap-grid` | 14px | Gap entre itens em grids de lista |

### Regras de Espaçamento

- Padding interno de cards: `16px` (compacto) a `24px` (padrão)
- Padding hero card: `26–28px`
- Gap entre seções: `32px`
- Nunca compactar listas abaixo de `10px` de gap
- Bottom padding do `app-content` na Home: `110px` (clearance do bottom nav)

---

## 6. Border Radius

| Token | Valor | Uso |
|---|---|---|
| `--radius-button` | 12px | Botões inline, back button (14px para back button) |
| `--radius-card` | 16px | `.info-card`, `.form-card`, cards padrão |
| `--radius-card-featured` | 20px | Tool cards grandes (journal, home modules) |
| `--radius-hero` | 28px | Hero card (streak), `.hero-panel` |
| `--radius-nav` | 24px | Bottom nav pill |
| `--radius-shell` | 30px | App shell container |
| `--radius-frame` | 34px | App frame inner border |
| `--radius-pill` | 999px | `.button-primary`, chips, motivo pills, progress |
| `--radius-icon` | 14px | Icon shells pequenos |
| `--radius-icon-lg` | 16px | Icon shells grandes (46px) |

> **Regra de ouro:** Quanto maior e mais destacado o elemento, maior o radius.

---

## 7. Glassmorphism

Aplicar em cards que ficam sobre backgrounds com gradiente ou textura:

```css
/* Card padrão */
backdrop-filter: blur(18px);          /* --blur-glass */
background: var(--color-bg-card);
border: 1px solid var(--color-border-card);

/* Tool card */
backdrop-filter: blur(14px);          /* --blur-card */

/* Icon shell */
backdrop-filter: blur(10px);          /* --blur-icon-shell */

/* Bottom nav */
backdrop-filter: blur(22px) saturate(1.06);   /* --blur-nav */

/* Modal overlay */
backdrop-filter: blur(4px);           /* --blur-overlay */
```

| Token | Valor | Onde |
|---|---|---|
| `--blur-glass` | 18px | `.home-checkin-card`, floating sheets, motivo-pill |
| `--blur-card` | 14px | `.tool-card-journal`, `.settings-premium-banner` |
| `--blur-icon-shell` | 10px | Icon shells de tool cards |
| `--blur-nav` | 22px | Bottom nav |
| `--blur-overlay` | 4px | Overlay de modal |

---

## 8. Hierarquia de Profundidade (Shadows)

Do mais plano ao mais elevado:

| Nível | Onde usar | Token de shadow |
|---|---|---|
| 1 — Página | Fundo puro | — |
| 2 — Card sutil | Check-in card, commitment card | `--shadow-card-soft` |
| 3 — Card padrão | `.info-card`, listas de itens | `--shadow-card` |
| 4 — Card elevado | Tool cards, analytics hero | `--shadow-card-deep` |
| 5 — Float | App shell, modais, bottom sheet | `--shadow-float` |

### Definições das Shadows

```css
--shadow-card-soft:
  0 10px 22px rgba(8, 10, 24, 0.12),
  inset 0 1px 0 rgba(255, 255, 255, 0.04);

--shadow-card:
  0 16px 38px rgba(0, 0, 0, 0.24),
  inset 0 1px 0 rgba(255, 255, 255, 0.04);

--shadow-card-deep:
  0 26px 48px rgba(6, 10, 28, 0.34),
  0 10px 24px rgba(21, 40, 118, 0.14),
  inset 0 1px 0 rgba(255, 255, 255, 0.05);

--shadow-float:
  0 24px 54px rgba(0, 0, 0, 0.26),
  0 8px 22px rgba(26, 44, 134, 0.16);
```

### Shadows de Botões

```css
--shadow-button-primary:  /* cyan-tinted */
  0 14px 28px color-mix(in srgb, var(--color-accent-cyan) 34%, rgba(12, 20, 44, 0.66)),
  inset 0 1px 0 rgba(255, 255, 255, 0.14);

--shadow-button-amber:    /* ember-tinted */
  0 14px 28px rgba(236, 151, 49, 0.26),
  inset 0 1px 0 rgba(255, 255, 255, 0.18);

--shadow-button-danger:   /* dark red-tinted */
  0 12px 26px rgba(106, 31, 31, 0.34),
  inset 0 1px 0 rgba(255, 255, 255, 0.12);
```

> **Padrão inset:** Todo shadow de card/botão inclui `inset 0 1px 0 rgba(255,255,255, X)` para criar ilusão de borda superior clara.

---

## 9. Animações

### Entrada de Elementos — Framer Motion (padrão)

```javascript
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.08 }}
```

- **y offset:** 16px (de baixo para cima)
- **Duration:** 400ms
- **Ease:** easeOut
- **Stagger:** 0.08s por card/seção (`index * 0.08`)

### Bottom Sheets — Spring Physics

```javascript
initial={{ y: '100%' }}
animate={{ y: 0 }}
exit={{ y: '100%' }}
transition={{ type: 'spring', stiffness: 320, damping: 36 }}
```

### CSS Transitions

```css
--transition-fast:   150ms ease;     /* cards, botões, estados interativos */
--transition-screen: 250ms cubic-bezier(0.22, 1, 0.36, 1);  /* transição de tela */
```

> **DS alias:** `--ds-transition-fast` = 200ms ease (levemente diferente — usar `--transition-fast` nas classes legadas)

### Micro-interações de Botão

```css
/* Hover */
transform: translateY(-1px);

/* Active */
transform: scale(0.985);    /* .button-primary */
transform: scale(0.98);     /* .app-back-button */
```

### Regras de Animação

- Nunca animar `width` / `height` — usar `transform` e `opacity`
- Máximo 1–2 elementos com animação além do stagger de entrada
- Micro-interações: 150–300ms; transições de tela: até 400ms
- Respeitar `prefers-reduced-motion` (Framer Motion lida automaticamente)

---

## 10. Componentes Globais

Definidos em `src/styles/foundation.css`. **Use antes de criar CSS novo.**

### Cards

```css
.info-card        /* Card padrão: gradient bg, border-subtle, shadow-card, radius-card (16px), padding 22px */
.highlight-card   /* Herda info-card + overlay de radial gradients (roxo/azul) */
.hero-panel       /* Hero: radius-hero (28px), padding 28px, gap 18px */
.form-card        /* Container de formulário: igual info-card */
```

**Implementação do `.info-card`:**
```css
background: linear-gradient(180deg, hsl(232 34% 23% / 0.94) 0%, hsl(232 36% 18% / 0.96) 100%);
border: 1px solid var(--ds-border-subtle);   /* rgba branco 4% */
box-shadow: var(--ds-shadow-surface);
```

### Botões

| Classe | Uso | Altura | Radius | Fundo |
|---|---|---|---|---|
| `.button-primary` | CTA principal — uma por tela | 58px | `--radius-pill` (999px) | `--ds-gradient-ember-brand` |
| `.button-ember-brand` | CTA brand alternativa | 56px | 18px | `--ds-gradient-ember-brand` |
| `.button-secondary` | CTA secundária / positiva | 48px | `--radius-button` (12px) | Cyan 10% + border cyan |
| `.button-orange` | Ação amber/orange | 48px | `--radius-button` | `--ds-gradient-ember` |
| `.button-danger` | Ação destrutiva | 48px | `--radius-button` | Transparente + border danger |

> Texto de `.button-primary` usa `color: var(--ds-color-text-inverted)` — escuro, não branco.

### Tipografia de UI

```css
.section-label    /* Uppercase, 0.76rem, amber background, letter-spacing 0.08em, radius-pill */
.eyebrow          /* Igual section-label — uso para eyebrow antes de títulos */
.status-pill      /* Badge de status: mesmo padrão de eyebrow */
.text-link        /* Link inline transparente, cor amber, sem underline */
```

### Layout

```css
.app-topbar       /* Topbar: padding safe-area + 16px, 20px lateral */
.app-content      /* Área scrollável: overflow-y auto, padding 0 16px 16px */
.app-content-home /* Home: padding-bottom 110px para clearance do nav */
.panel-stack      /* Container de seções: padding 22px, radius-card */
.content-grid     /* Grid 1 coluna */
.toolbar          /* Grid auto-fit min 180px */
.hero-actions     /* Grid de ações hero, auto-fit */
```

### Navegação

```css
.bottom-nav        /* Nav fixo: backdrop blur 22px, radius-nav 24px, z-index 1000 */
.nav-item          /* Item: 44px min-height, grid, color text-muted */
.nav-icon          /* Ícone inativo: text-muted, scale 0.94 */
.nav-icon-active   /* Ícone ativo: color info-500 (cyan) */
.nav-dot           /* Ponto indicador: 4px, cyan */
.nav-sos-button    /* Botão SOS: sem background, ícone com drop-shadow ember+danger */
```

### App Shell

```css
.app-back-button   /* 42×42px, radius 14px, glass, border rgba 8%, blur 16px */
.phone-shell       /* max-width 390px, max-height 900px */
.app-frame         /* Background com radial gradients + dot texture overlay */
```

### Miscelânea

```css
.chip              /* Pill interativo: radius var(--radius), hover translateY(-1px) */
.progress-track    /* Barra de progresso: container */
.progress-fill     /* Barra de progresso: fill com gradient */
.shimmer           /* Efeito de brilho — aplicar em CTAs primárias de destaque */
```

---

## 11. Estados de Componentes

### Hover

```css
transform: translateY(-1px);  /* botões, chips, cards clicáveis */
border-color: rgba(255, 255, 255, 0.12);  /* back button hover */
```

### Active / Press

```css
transform: scale(0.985);  /* .button-primary */
transform: scale(0.98);   /* .app-back-button */
```

### Disabled

```css
opacity: 0.48;           /* .button-ember-brand disabled */
cursor: not-allowed;
pointer-events: none;    /* para wrappers */
box-shadow: none;
```

### Selected (Pills / Chips)

```css
/* Borda mais forte + fundo com tint cyan */
border-color: var(--color-accent-cyan);
background: rgba(50, 153, 194, 0.15);   /* cyan 15% */
color: var(--color-text-primary);
```

### Empty State

Usar classe `.empty-state` com estrutura:
```html
<div class="empty-state">
  <LucideIcon />          <!-- ícone representativo, color text-muted -->
  <h3>Título</h3>         <!-- font-size-label ou font-size-body, text-secondary -->
  <p>Subtítulo</p>        <!-- font-size-micro, text-muted -->
  <button>Ação</button>   <!-- opcional, .button-secondary -->
</div>
```

### Focus Visible

**Gap identificado:** Não há estilo `focus-visible` padronizado nos tokens. Para acessibilidade, recomenda-se:
```css
:focus-visible {
  outline: 2px solid var(--color-accent-cyan);
  outline-offset: 2px;
}
```

---

## 12. Layout Mobile e Safe Areas

### Viewport

```css
/* Usar sempre dvh (dynamic viewport height), nunca 100vh fixo */
min-height: 100dvh;

/* Overflow */
overflow-x: hidden;   /* no frame e no body */
scrollbar-width: none;  /* firefox */
-ms-overflow-style: none;  /* IE */

/* Webkit */
.app-content::-webkit-scrollbar { display: none; }
```

### Safe Areas

```css
/* Body: safe areas do dispositivo */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Topbar: safe area + espaço de design */
.app-topbar {
  padding: calc(env(safe-area-inset-top) + 16px) 20px 0;
}

/* Bottom nav: clearance do gesto de home */
.bottom-nav {
  padding-bottom: calc(6px + env(safe-area-inset-bottom));
}

/* Onboarding: safe area no topo */
.ob-screen {
  padding-top: calc(env(safe-area-inset-top) + 16px);
}
```

### Dimensões do App

| Elemento | Valor |
|---|---|
| Phone shell max-width | 390px |
| Phone shell max-height | 900px |
| App frame width | `min(100%, 1120px)` (modo desktop/preview) |
| App shell height | `100dvh` |
| Bottom nav clearance | 110px no `app-content-home` |

---

## 13. Background Especial do App Frame

O `app-frame` dentro do `app-shell` tem um background composto por gradientes radiais + dot texture:

```css
background:
  radial-gradient(circle at 16% 10%, rgba(67, 196, 214, 0.16) 0%, transparent 24%),   /* cyan top-left */
  radial-gradient(circle at 88% 18%, rgba(54, 158, 201, 0.12) 0%, transparent 22%),   /* blue top-right */
  radial-gradient(circle at 68% 88%, rgba(88, 102, 206, 0.2) 0%, transparent 34%),    /* purple bottom-right */
  radial-gradient(circle at 18% 100%, rgba(227, 91, 46, 0.06) 0%, transparent 22%),   /* ember bottom-left */
  linear-gradient(180deg, ...color-mix layers...);                                      /* base gradient */

/* Dot texture overlay (::before) */
background-image: radial-gradient(circle, rgba(255, 255, 255, 0.14) 0.6px, transparent 0.6px);
background-size: 18px 18px;
mask-image: radial-gradient(ellipse 80% 70% at 50% 100%, black 30%, transparent 80%);
opacity: 0.16;
```

---

## 14. Referências por Página

| Página | Rota | Estado | O que observar |
|---|---|---|---|
| **HomePage** | `/app` | ✅ Referência final | Hero mesh gradient, motivos CSS scroll, tool cards, bottom nav |
| **CheckInPage** | `/check-in` | ✅ Quase final | Commitment button ripple, week strip, mood blur transitions |
| **JournalPage** | `/journal` | ✅ Quase final | Bottom sheet spring, journal cards com badge + line |
| **BlockerPage** | `/blocker` | ✅ Quase final | VPN toggle spring, domain list, layout limpo |
| **PrePurchasePage** | `/pre-purchase` | ⚠️ Funcional | Quiz steps, sintomas multi-select, mesh background |
| **AnalyticsPage** | `/analytics` | ⚠️ Ajuste fino | Gráficos ok; verificar empty states e tipografia |
| **SosPage** | `/sos` | ⚠️ Parcial | Respiração funcional; layout visual incompleto |
| **RelapsePage** | `/relapse` | ⚠️ Parcial | Fluxo ok; hierarquia de botões fraca |
| **SettingsPage** | `/settings` | ⚠️ Parcial | Conteúdo ok; depth de cards inconsistente |
| **OnboardingPage** | `/onboarding` | ⚠️ Parcial | Steps parciais; alinhar com pre-purchase pattern |
| **PaywallPage** | `/paywall` | ❌ Fraco | Design system não aplicado |
| **AccountAuthPage** | `/account/auth` | ❌ Fraco | Design system não aplicado |
| **AccountRequiredPage** | `/account/required` | ❌ Fraco | Design system não aplicado |
| **LibraryPage** | `/library` | ❌ Placeholder | Under construction |

---

## 15. Proibições Absolutas

- **Hex hardcoded em CSS/JSX** — sempre tokens CSS de `tokens.css` ou `foundation.css`
- **Emojis como ícones** — sempre Lucide React
- **`new Date()` em componentes** — sempre `demoNow` de `useAppState()`
- **Background claro/branco** — app é dark-only
- **Mais de uma CTA primária por tela** — secundárias visualmente subordinadas
- **Criar variável CSS sem checar `tokens.css` primeiro**
- **Modificar `src/styles/foundation.css` sem instrução explícita** — afeta todas as telas
- **Modificar `src/app/state/app-state.tsx` em tarefas visuais**

---

## 16. Onde Encontrar as Coisas

| O que precisa | Onde fica |
|---|---|
| Tokens primitivos (cor, tipografia, espaçamento) | `src/styles/tokens.css` |
| Aliases DS + classes globais reutilizáveis | `src/styles/foundation.css` |
| Estilos Home + Analytics + Journal + Settings | `src/styles/home.css` |
| Estilos do Onboarding | `src/styles/onboarding.css` |
| Estilos do Pre-Purchase | `src/styles/pre-purchase.css` |
| Referência de roteamento | `src/core/config/routes.ts` |
| Estado global | `src/app/state/app-state.tsx` (só leitura em tarefas visuais) |
| Modelos de dados | `src/core/domain/models.ts` |
| Layout e shell | `src/shared/layout/AppShell.tsx` |
