# Coruja — UI Improvements (Março 2026)

> Lista priorizada de melhorias visuais baseada no estado real do código.
> Para cada item: componente/tela afetado + problema + solução concreta.
> Atualizado após leitura dos arquivos reais em 24/03/2026.

---

## Estado Real das Telas "Pendentes"

Correção da análise inicial após leitura do código:

| Tela | Estado real | O que falta |
|---|---|---|
| `CustomPlanStep` (paywall modal) | ❌ 100% inline styles, paleta errada | Aplicar design system do zero |
| `PaywallPage` (`/paywall`) | ℹ️ Dev tool / toggle de teste | Não é tela de produto — baixa prioridade |
| `AccountAuthPage` | 🔶 Classes criadas, visual iniciado | Finalizar visual, alinha tokens |
| `AccountRequiredPage` | ✅ Já usa `.info-card`, `.button-orange` | Só copy e card de "status técnico" |
| `LibraryPage` | 🔲 Placeholder | Empty state quando pronto |

---

## CRÍTICO — Resolver antes de qualquer outra melhoria

---

### C1 — CustomPlanStep: 100% inline styles, paleta errada, emojis

**Componente:** `src/features/pre-purchase/steps/CustomPlanStep.tsx`
**Tela:** Último step do pre-purchase + bottom sheet paywall (o modal da screenshot)

**Problema:**
Este é o componente mais crítico fora do design system. Todos os estilos são inline — nenhum token CSS, nenhuma classe global. Além disso:

- **Paleta completamente diferente do app:** usa roxo/índigo (`#7c3aed`, `#4f46e5`, `#6366f1`, `#a855f7`) que não existem nos tokens — o app usa cyan como primário interativo e ember como CTA
- **CTA button roxo** em vez de `--ds-gradient-ember-brand` (âmbar/laranja)
- **Emojis como ícones:** `⚡`, `🙌`, `✓`, `🗓️`, `🧠`, `🎯`, etc. — violação direta das regras do design system (Lucide React exclusivamente)
- **Cores hardcoded na timeline:** cada dia tem `color` e `border` como strings rgba diretamente nos dados (`timelineItems` array)
- **Estrutura de bottom sheet:** não usa Framer Motion spring — só `position: fixed` condicional sem animação de entrada/saída

**O que precisa mudar:**

**Bottom sheet (paywall modal):**
- Migrar para Framer Motion: `initial={{ y: '100%' }}`, `animate={{ y: 0 }}`, spring `stiffness: 320, damping: 36`
- Background: `var(--color-bg-card-strong)` ao invés de `#13102a`
- Handle: estilo padrão do app (já existe em `journal-composer-handle`)
- Badge de desconto: substituir ⚡ por `<Zap size={12} />` (Lucide), usar `--color-accent-amber`
- Plan cards: usar `.info-card` como base + border `--color-accent-cyan` quando selecionado, radio com `--color-accent-cyan`
- Radio button: substituir div inline por componente CSS com `--color-accent-cyan`
- CTA "Começar minha jornada": `.button-primary` (ember brand gradient, 58px, radius pill)

**Página de plan preview (CustomPlan scroll):**
- Timeline items: substituir emojis por ícones Lucide (`Calendar`, `Brain`, `Target`, `Settings`, `Dumbbell`, `Globe`, `Clock`, `TrendingUp`)
- Cores da timeline: tokens `--color-accent-purple`, `--color-accent-cyan`, `--color-success` ao invés de rgba hardcoded
- Linha vertical da timeline: `var(--gradient-accent-cyan)` ao invés de gradient indigo/blue hardcoded
- Texto "Coruja" eyebrow: `.eyebrow` ou `.section-label`
- Títulos: usar `--font-size-subtitle` (19px) e `--font-size-body` (14px)
- CTA principal: `.button-primary` ember brand, sem emoji 🙌
- Badge de garantia: `<CheckCircle2>` Lucide + texto com `--color-success`

**Impacto:** Inconsistência visual crítica no ponto de conversão mais importante do funil

---

### C2 — AccountAuthPage: visual iniciado mas não finalizado

**Componente:** `src/features/account/AccountAuthPage.tsx`
**Tela:** `/account/auth` (signup only / login only / ambos, via URL params)

**Problema:**
A lógica está completa (signup, login, reset senha, backup restore). Classes `account-auth-*` foram criadas mas o CSS não foi finalizado para os dois modos forçados (`signupOnly=1` e `loginOnly=1`) — estes chegam de rotas diferentes no funil e precisam de visual consistente.

**O que verificar e ajustar:**
- Card principal: deve usar `.info-card` com `backdrop-filter: blur(var(--blur-glass))` + `--shadow-card-deep`
- Inputs (`account-auth-input`): background `var(--color-bg-card-elevated)`, border `var(--color-border-card)`, sem border sólido escuro
- Mode switch tabs (login/signup): estilo pill com tab ativo usando `--color-accent-cyan` e background sutil
- Submit button: `.button-primary` (ember brand) — verificar se está correto
- Error/success toasts: usar classes globais `.toast .toast-error` / `.toast .toast-success`
- Orbs de fundo (`account-auth-orb`): usar radial gradients com `--color-accent-cyan` e `--color-accent-ember` para ambiance
- Social buttons (em breve): manter desabilitados mas com `opacity: 0.4` e `cursor: not-allowed`
- Verificar: modo `signupOnly` esconde o tab switcher e mostra só o form de cadastro
- Verificar: modo `loginOnly` esconde o tab switcher e mostra só o form de login

**Impacto:** Tela de criação de conta no funil pós-compra

---

### C3 — Cores de mood/craving hardcoded em JSX no CheckInPage

**Componente:** `src/features/check-in/CheckInPage.tsx`

**Problema:**
As cores dos estados emocionais (mood) e dos segmentos de craving são strings hex inline no JSX:
```tsx
{ color: '#C44B4B' }   // craving crítico
{ color: '#E07428' }   // craving alto
{ color: '#EC9731' }   // craving médio
{ color: '#5EBD8A' }   // craving baixo
{ color: '#3DAA7D' }   // sem craving
boxShadow: `0 0 16px ${color}66`
```
Impossível atualizar a paleta sem buscar no JSX.

**Solução:**
Adicionar em `tokens.css`:
```css
/* Escala de craving (mapa 0–10) */
--color-craving-critical: #C44B4B;
--color-craving-high:     #E07428;
--color-craving-medium:   #EC9731;
--color-craving-low:      #5EBD8A;
--color-craving-none:     #3DAA7D;
```
No componente, passar via CSS custom property:
```tsx
style={{ '--segment-color': 'var(--color-craving-critical)' } as React.CSSProperties}
```
E referenciar via `var(--segment-color)` no CSS do segmento.

**Impacto:** Manutenibilidade da paleta de estados emocionais

---

### C4 — Estilos do Journal em index.css

**Componente:** `src/index.css` — seção `.journal-*`

**Problema:**
Todos os estilos do Journal (`journal-card`, `journal-fab`, `journal-composer`, etc.) estão em `src/index.css` em vez de `src/styles/journal.css`. Viola o padrão arquitetural.

**Solução:**
Extrair para `src/styles/journal.css` e importar em `src/index.css`. Zero mudança visual.

**Impacto:** Organização de código

---

## IMPORTANTE — Melhorias que elevam a qualidade percebida

---

### I1 — AccountRequiredPage: card de "status técnico" exposto

**Componente:** `src/features/account/AccountRequiredPage.tsx`

**Problema:**
A página já usa `.info-card .highlight-card`, `.section-label`, `.button-orange .shimmer` — estrutura correta. Mas tem um card visível para o usuário com "Status técnico" / "Supabase ainda não configurado" que é conteúdo de desenvolvedor exposto em produção.

**Solução:**
- Remover o segundo `<section>` (card de status técnico) da view do usuário
- Opcional: manter como debug info apenas em ambiente de dev via `import.meta.env.DEV`
- Revisar o copy principal — "Conta obrigatoria antes do onboarding" é linguagem técnica, deve ser copy de produto

**Impacto:** Polimento, profissionalismo

---

### I2 — SosPage layout visual incompleto

**Componente:** `src/features/sos/SosPage.tsx`

**Problema:**
Exercício de respiração funcional, mas layout não segue padrão do app. Sem animações staggered de entrada, tipografia sem hierarquia, botões sem estilo correto.

**Solução:**
- Entrada da tela: Framer Motion `scale: 0.96 → 1, opacity: 0 → 1, duration: 0.3`
- Breathing card: `--shadow-card-deep` + `backdrop-filter: blur(14px)`
- Timer countdown: `--font-size-display` (56px) ou pelo menos `--font-size-subtitle`
- Botão primário: `.button-primary` ember brand
- Botões secundários: `.button-secondary` (cyan outline) e `.button-danger`
- Section labels: `.section-label`

---

### I3 — RelapsePage hierarquia visual fraca

**Componente:** `src/features/relapse/RelapsePage.tsx`

**Problema:**
Fluxo funcional mas hierarquia visual inconsistente. Goal cards sem glassmorphism. Progress bar nativo sem estilo. Botão de confirmação pode estar sem o peso visual correto.

**Solução:**
- Goal cards: base `.info-card` + variante ativa com `border-color: var(--color-accent-cyan)` e `background: rgba(50,153,194,0.12)`
- Progress bar: substituir `<progress>` por `.progress-track` + `.progress-fill` com `--gradient-accent-ember`
- Botão confirmar: `.button-primary` com min-height 58px
- Context cards (streak anterior, resiliência): `--shadow-card-soft`
- Welcome icon: Lucide com cor adequada ao estado emocional

---

### I4 — SettingsPage depth inconsistente

**Componente:** `src/features/settings/SettingsPage.tsx`

**Problema:**
Profile card e option rows sem a profundidade glassmorphism esperada.

**Solução:**
- Profile card: `backdrop-filter: blur(var(--blur-card))` + `--shadow-card-deep`
- Option rows separadores: `border-top: 1px solid var(--color-border-divider)`
- Section titles: `--color-text-secondary` + `--font-size-small`
- Premium banner: garantir `--blur-card` (14px) ativo

---

### I5 — OnboardingPage incompleta

**Componente:** `src/features/onboarding/OnboardingPage.tsx`

**Problema:**
Steps parcialmente implementados. Não segue o padrão visual dos steps do pre-purchase (que é a referência para flows de onboarding).

**Solução:**
- Estrutura: `ob-screen` com `::before` gradiente blur (já definido em `onboarding.css`)
- Steps: AnimatePresence `mode: 'wait'`, duration 0.42s, ease `[0.22, 1, 0.36, 1]`
- Progress: `.ob-progress-track` + `.ob-progress-fill`
- Step label: `.ob-step-label` (pill cyan, uppercase, 10px)
- Selection pills: `.ob-selection-pill` com glassmorphism

---

### I6 — Empty states ausentes em Analytics

**Componente:** `src/features/analytics/sections/` — MoodMap, TriggerDonut, CravingChart

**Problema:**
Sem check-ins suficientes, seções aparecem vazias sem orientação ao usuário.

**Solução:**
```jsx
// Quando !hasEnoughData
<div className="empty-state">
  <BarChart3 size={32} color="var(--color-text-muted)" />
  <h3>Sem dados ainda</h3>
  <p>Complete check-ins diários para ver seu progresso</p>
</div>
```

---

## REFINAMENTO — Polimento fino

---

### R1 — Focus-visible global ausente

**Solução:** Adicionar em `foundation.css`:
```css
:focus-visible {
  outline: 2px solid var(--color-accent-cyan);
  outline-offset: 2px;
  border-radius: 2px;
}
```

---

### R2 — Gap inconsistente no home-modules-grid

**Arquivo:** `src/styles/home.css`
**Problema:** `.home-modules-grid` usa `gap: 16px` fixo, deveria ser `var(--gap-grid)` (14px).
**Solução:** `gap: var(--gap-grid);`

---

### R3 — Journal card border-left sem token

**Arquivo:** `src/styles/journal.css` (após extração do index.css)
**Problema:** `.journal-card-line--freeform` e `--relapse` têm cores hardcoded.
**Solução:** Tokens `--color-journal-freeform: var(--color-accent-cyan)` e `--color-journal-relapse: var(--color-danger)`

---

### R4 — Peso tipográfico inconsistente em tool cards

**Regra a definir:** Títulos de tool card → `--font-weight-semibold` (600). Hero cards → `--font-weight-bold` (700)+.

---

### R5 — AnimatePresence durações inconsistentes em CheckIn

**Arquivo:** `src/features/check-in/CheckInPage.tsx`
**Problema:** Transições cross-fade entre 200ms e 300ms — padronizar para `duration: 0.15` (alinhado com `--transition-fast`).

---

## Sequência de Execução Sugerida

Ordem por impacto visual + esforço estimado:

| # | Item | Componente | Impacto | Esforço |
|---|---|---|---|---|
| 1 | C1 — CustomPlanStep bottom sheet | `CustomPlanStep.tsx` + CSS | Alto | Médio |
| 2 | C1 — CustomPlanStep página de plan | `CustomPlanStep.tsx` (timeline) | Alto | Médio |
| 3 | C2 — AccountAuthPage finalizar | `AccountAuthPage.tsx` + CSS | Alto | Médio |
| 4 | I2 — SosPage visual | `SosPage.tsx` + CSS | Alto | Médio |
| 5 | I3 — RelapsePage | `RelapsePage.tsx` + CSS | Alto | Baixo |
| 6 | I4 — SettingsPage depth | `SettingsPage.tsx` + CSS | Médio | Baixo |
| 7 | I1 — AccountRequiredPage copy | `AccountRequiredPage.tsx` | Baixo | Mínimo |
| 8 | C3 — Tokens mood/craving | `tokens.css` + `CheckInPage.tsx` | Médio | Baixo |
| 9 | C4 — Journal para journal.css | `index.css` → `journal.css` | Baixo | Mínimo |
| 10 | I5 — Empty states Analytics | `sections/*.tsx` | Médio | Baixo |
| 11 | I6 — Loading states | `foundation.css` | Médio | Baixo |
| 12 | I5 — OnboardingPage | `OnboardingPage.tsx` + CSS | Alto | Alto |
| 13 | R1–R5 — Refinamentos | Vários | Baixo | Mínimo |

---

## Resumo Executivo (Recalibrado)

### Os 3 problemas mais críticos

1. **CustomPlanStep completamente fora do design system** (C1) — paleta roxo/índigo incompatível, 100% inline styles, emojis como ícones — é a tela de conversão final do funil
2. **AccountAuthPage visual não finalizado** (C2) — tela de criação de conta pós-compra com identidade inconsistente
3. **Cores de mood/craving hardcoded** (C3) — manutenibilidade da paleta de estados emocionais no check-in

### As 3 maiores oportunidades de melhoria visual

1. **CustomPlanStep repaginado** — converter paleta para ember+cyan, bottom sheet com spring animation, remover emojis → maior impacto percebido por ser o ponto de conversão
2. **SosPage finalizada** — tela de emergência com o visual mais incompleto do app principal
3. **RelapsePage com hierarquia** — momento emocional crítico merece atenção especial à profundidade visual

### Páginas mais fora do padrão (corrigido)

| Ranking | Componente / Tela | Severity |
|---|---|---|
| 1º | `CustomPlanStep` (paywall modal + plan page) | ❌ 100% inline styles, paleta errada, emojis |
| 2º | `AccountAuthPage` (`/account/auth`) | 🔶 Iniciado mas não finalizado |
| 3º | `SosPage` (`/sos`) | ⚠️ Layout incompleto — tela de crise |
| 4º | `RelapsePage` (`/relapse`) | ⚠️ Hierarquia visual fraca — momento emocional |
| 5º | `OnboardingPage` (`/onboarding`) | ⚠️ Steps parcialmente implementados |
