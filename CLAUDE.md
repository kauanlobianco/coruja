# CLAUDE.md — Coruja

## 1. What this app is

Coruja is a mobile sobriety and recovery companion for men struggling with pornography addiction. The core loop is: complete a pre-purchase quiz → create an account → do a daily check-in → track streak → use SOS when craving spikes → review progress in Analytics. All user data lives on-device (Capacitor Preferences) and syncs to Supabase as an encrypted backup tied to a single exclusive device session.

---

## 2. Tech stack

| Layer | Technology |
|---|---|
| UI framework | React 19 |
| Mobile runtime | Capacitor 8 (Android primary, iOS scaffolded) |
| Build tool | Vite 8 |
| Router | React Router 7 |
| State management | Single global context — `AppStateContext` in `src/app/state/app-state.tsx` |
| Server state (unused heavily) | TanStack Query 5 (present in deps, not widely used yet) |
| Data layer | Supabase JS v2 (`src/core/remote/supabase.ts`) |
| Local persistence | `@capacitor/preferences` via `src/core/storage/app-preferences.ts` |
| Animation | Framer Motion 12 |
| Icons | Lucide React |
| Styling | Vanilla CSS — `src/index.css` (globals) + `src/styles/` (feature sheets) |
| Schema validation | Zod 4 |
| Android blocker | Two custom Capacitor plugins: `VpnPermission`, `VpnControl` (registered via `registerPlugin`) |

---

## 3. Folder structure

```
src/
  app/
    App.tsx                  # Mounts AppProviders + AppRoutes
    AppProviders.tsx         # Wraps app in React Query + AppStateContext
    routes.tsx               # All routes + route guards (RequireAppAccess, etc.)
    state/
      app-state.tsx          # THE global state provider (799 lines) — all mutations live here
      context.ts             # createContext call only
      use-app-state.ts       # useContext wrapper hook

  core/
    config/
      routes.ts              # appRoutes const + appShellNavItems
      modules.ts             # productModules registry (informational, not used for routing)
      domains.ts             # (blocked domains config — read by blocker-native)
    domain/
      models.ts              # All TypeScript interfaces + defaultAppModel
      streak.ts              # normalizeAppModel, streak calculations
      check-in.ts            # hasCheckInToday
      relapse.ts             # createRelapseTransition
      analytics.ts           # buildAnalyticsReport (pure function, no side effects)
    platform/
      capacitor.ts           # bootstrapNativeShell, isNativePlatform, platform
    remote/
      supabase.ts            # getSupabaseClient(), hasSupabaseEnv()
    storage/
      app-preferences.ts     # loadPersistedAppState / savePersistedAppState (Zod-validated)

  features/
    account/
      AccountAuthPage.tsx    # Signup + login, triggers backup upload/restore
      AccountRequiredPage.tsx# Gate shown when account isn't linked yet
      services/              # auth-service.ts, backup-service.ts, device-session-service.ts
    analytics/
      AnalyticsPage.tsx      # Orchestrator (~180 lines)
      utils.ts               # Date helpers, SVG path helpers, getMentalStateMeta
      sections/              # StreakSnapshot, MoodMap, TriggerDonut, CravingChart,
                             #   EvolutionScore, RelapseList, InsightsList
    blocker/
      BlockerPage.tsx        # VPN toggle, domain list management
      BlockedPage.tsx        # Full-screen interstitial shown when a site is blocked
      blocker-native.ts      # Thin wrappers over VpnPermission / VpnControl plugins
      blocked-domains.ts     # DEFAULT_BLOCKED_DOMAINS list
    check-in/
      CheckInPage.tsx        # Daily check-in form (craving slider, mental state, triggers)
    home/
      HomePage.tsx           # Main dashboard — streak hero, check-in status, tools grid
    intro/
      IntroPage.tsx          # Splash shown during state hydration; calls bootstrapNativeShell
    journal/
      JournalPage.tsx        # Freeform entries + relapse reflections; draggable bottom sheet
    library/
      LibraryPage.tsx        # Under construction placeholder
    onboarding/
      OnboardingPage.tsx     # Name, goal, motivations, triggers — runs after first signup
    paywall/
      PaywallPage.tsx        # Standalone paywall (separate from pre-purchase funnel)
    pre-purchase/
      PrePurchasePage.tsx    # Orchestrator (~230 lines)
      data.ts                # Quiz questions, symptom options, testimonials, markerRules, etc.
      types.ts               # FunnelStep, QuizQuestion, PrePurchaseState, MarkerRule, etc.
      storage.ts             # loadPrePurchaseState / savePrePurchaseState (sessionStorage)
      steps/                 # LandingStep, QuizStep, LoadingStep, IdentityStep, SymptomsStep,
                             #   DiagnosisStep, PainCarouselStep, SolutionCarouselStep,
                             #   SocialProofStep, PlanPreviewStep, CustomPlanStep, PaywallStep
    relapse/
      RelapsePage.tsx        # Streak reset, new goal picker, optional journal reflection
    settings/
      SettingsPage.tsx       # Account info, backup status, blocker link, logout, demo tools
    sos/
      SosPage.tsx            # Breathing exercise + 5-minute countdown for craving spikes

  shared/
    layout/
      AppShell.tsx           # Wraps every app screen; provides topbar, bottom nav, phone frame
    components/
      ModuleCard.tsx         # Small card used in library/onboarding contexts

  styles/
    foundation.css           # Global design tokens, base component classes
    home.css                 # Home + analytics + journal + settings styles
    onboarding.css           # Onboarding flow styles
    pre-purchase.css         # Pre-purchase funnel styles

  index.css                  # Imports all style sheets; global resets
  main.tsx                   # Vite entry point
```

---

## 4. Screens and their purpose

| Route | Component | Purpose | Maturity |
|---|---|---|---|
| `/` | `RootRedirect` | Reads state and redirects to correct flow entry | Stable |
| `/pre-purchase` | `PrePurchasePage` | 12-step quiz funnel → account creation gate | Functional but **expect heavy changes**; visual not final |
| `/paywall` | `PaywallPage` | Standalone paywall (secondary path) | Partial |
| `/account/required` | `AccountRequiredPage` | Gate when user has completed onboarding but has no account linked | Working, close to final |
| `/account/auth` | `AccountAuthPage` | Email signup / login + Supabase backup restore | Working, close to final |
| `/onboarding` | `OnboardingPage` | Name, goal, motivations, triggers — one-time post-signup flow | Partially done |
| `/app` | `HomePage` | Streak hero, check-in status card, motivations scroll, tools grid | **Visual reference** — closest to final |
| `/check-in` | `CheckInPage` | Craving slider, mental state, triggers, notes — one per day | Close to final |
| `/analytics` | `AnalyticsPage` | Emotional map, craving chart, trigger donut, relapse list | Close to final |
| `/sos` | `SosPage` | Breathing exercise (4-step, 5s each) + 5-min countdown | Partially done — visual not final |
| `/journal` | `JournalPage` | Freeform entries + relapse reflections; draggable bottom sheet | Partially done |
| `/relapse` | `RelapsePage` | Streak reset, new goal, optional journal reflection | Partially done |
| `/settings` | `SettingsPage` | Account card, backup, blocker link, logout, demo clock modal | Partially done |
| `/blocker` | `BlockerPage` | Android-only VPN blocker — enable/disable, manage domain list | **Android only**; partially done |
| `/blocked` | `BlockedPage` | Full-screen interstitial injected when a domain is blocked | Android only |
| `/library` | `LibraryPage` | Under construction — no functional content | Under construction |

**Route guards** in `src/app/routes.tsx`:
- `RequireEntryFlow` — blocks authenticated users from re-entering pre-purchase
- `RequireOnboarding` — lets accounts without completed onboarding through
- `RequireAppAccess` — requires both `state.account` and `state.hasCompletedOnboarding`
- `RequireAccountAuthEntry` — redirects if already logged in

---

## 5. Code patterns in use

### Component structure
- Pages are named `FeaturePage.tsx` (PascalCase). Feature folders are `kebab-case`.
- Large pages are split into an **orchestrator** (state + effects + action handlers) plus **step/section files** in a `steps/` or `sections/` sub-directory. The orchestrator `import`s all steps and renders them conditionall.
- Pure UI components receive all needed data via props — no context reads inside step/section files.

### State management
- All global mutations go through `useAppState()` from `src/app/state/use-app-state.ts`.
- The context value (`AppStateContextValue`) is defined in `app-state.tsx` and exposes named async functions (`saveCheckIn`, `registerRelapse`, `markSyncNow`, etc.) — never mutate state directly.
- `demoNow` (a `Date`) is the canonical "now" for all time-dependent UI; never use `new Date()` directly inside components — use `demoNow` from `useAppState()`.
- `state.account` is `null` until the user logs in. `state.hasCompletedOnboarding` gates access to the main app.

### CSS
- **No Tailwind, no CSS-in-JS.** Styles live in `src/styles/*.css` and `src/index.css`.
- Class names follow a feature-prefix BEM-like pattern: `analytics-mood-week`, `home-streak-icon-shell`, `prepurchase-landing-brand`.
- Global reusable classes (`.button`, `.info-card`, `.toast`, `.progress-track`, `.empty-state`, `.field`, `.chip`, `.section-label`, `.eyebrow`) are defined in `src/styles/foundation.css`.
- Feature-specific styles live in `home.css`, `onboarding.css`, `pre-purchase.css`.

### Supabase calls
- Never call `createClient` directly. Use `getSupabaseClient()` from `src/core/remote/supabase.ts` — returns `null` if env vars are missing.
- Check `hasSupabaseEnv()` before making remote calls. All remote calls are in `src/features/account/services/`.

### Capacitor plugin calls
- Native calls are wrapped in guard functions that return safe defaults when `!Capacitor.isNativePlatform()`. See `src/features/blocker/blocker-native.ts` as the canonical pattern.
- Bootstrap native shell (StatusBar, SplashScreen) only in `IntroPage` via `bootstrapNativeShell()` from `src/core/platform/capacitor.ts`.
- Use `isNativePlatform` to conditionally render native-only UI elements (e.g., in `SettingsPage`).

### Routing
- Route guard components are defined inline in `src/app/routes.tsx`. Do not add business logic to guards — they only check `state.account` and `state.hasCompletedOnboarding`.
- Navigate programmatically with `useNavigate()`. Always use `appRoutes.*` constants from `src/core/config/routes.ts` — no hardcoded path strings.

### Domain logic
- Pure computation (streak, analytics, relapse transition) goes in `src/core/domain/`. These functions are side-effect free and take only data as arguments.
- Zod schema validation on load is in `app-preferences.ts`. If the stored shape changes, update `appStateSchema` and add a migration branch.

---

## 6. Visual reference

`HomePage` (`src/features/home/HomePage.tsx` + `src/styles/home.css`) is the closest representation of the target aesthetic.

Key visual patterns from Home:
- **Dark background** (`#0a0a0f` approx) with layered semi-transparent cards (`.info-card`, `.highlight-card`).
- **Cyan gradient** accent (`#2BB5C4` → `#1ECFC4`) used for primary actions, active states, and interactive highlights.
- **Orange/amber** (`#EC9E32`, `#E07B39`) for streak icons (flame), secondary accents, and warm highlights.
- **Cards** use subtle borders (`rgba(255,255,255,0.08)`), gentle backdrop blur, and `border-radius: 16–20px`.
- **Progress bars** (`.progress-track` / `.progress-fill`) are thin (6–8px), rounded, with gradient fill.
- **Typography**: white primary text, `rgba(255,255,255,0.55)` for secondary labels, `rgba(255,255,255,0.35)` for tertiary. No specific Google Font is loaded yet — system font stack.
- **Animations**: Framer Motion `opacity: 0 → 1, y: 16 → 0` with `duration: 0.4, ease: easeOut` staggered by `delay: index * 0.08`. Used for all card entrances.
- **Bottom nav**: fixed bar with 5 items; SOS is center-elevated with a distinct pill button style (`.nav-sos-button`).
- **Shimmer effect**: `.shimmer` class (defined in CSS) applied to primary action buttons.
- **Motivations scroll**: horizontal auto-scrolling row of pills (`.motivo-pill`) driven purely by CSS animation.

---

## 7. What not to touch without explicit instruction

- **`src/app/state/app-state.tsx`** — The entire global state machine. Mutations here affect all screens. Changes risk silent data corruption or sync bugs.
- **`src/app/routes.tsx`** — Route guards encode the entire user flow. A wrong condition silently redirects users to the wrong screen.
- **`src/core/storage/app-preferences.ts`** — Zod schema upgrade must be paired with a migration. Breaking the schema = user data loss on device.
- **`src/core/domain/streak.ts`** — `normalizeAppModel` is called on every load and every mutation to recompute streak. Incorrect logic here corrupts the streak counter.
- **`src/styles/foundation.css`** — Global styles affect every screen. Changes to utility classes (`.button`, `.info-card`, `.toast`, etc.) cause silent visual regressions project-wide.
- **`src/features/blocker/blocker-native.ts`** — Native plugin bindings. Breaking plugin interfaces crashes the Android VPN feature.
- **`src/features/account/services/`** — Auth + backup + device session logic. Device lease enforcement prevents multi-device conflicts; mishandling it causes data conflicts.

---

## 8. Useful reminders for AI assistants

- **Check before creating.** Scan `src/shared/components/`, `src/shared/layout/`, and the relevant feature folder before creating a new component. `AppShell`, `ModuleCard`, `QuizOption` already exist.
- **Visual changes ≠ logic changes.** When asked to change only appearance (color, spacing, layout), do not touch TypeScript logic, state mutations, or routing. When asked to change only behavior, do not touch CSS.
- **Never use `new Date()` in components.** Always use `demoNow` from `useAppState()` so the demo clock tool works.
- **Respect the orchestrator pattern.** Large pages are split into an orchestrator + step/section files. New steps belong in `steps/` or `sections/`, never inlined into the orchestrator's JSX beyond a single call site.
- **CSS is global.** A class rename in a `.css` file can silently break every screen that uses it. Prefer adding a new scoped class rather than modifying a shared one.
- **Ask before refactoring unlisted files.** If a task mentions only one file, do not refactor sibling files unless explicitly asked — even if they look related.
- **Capacitor native calls must be guarded.** Any new `registerPlugin` usage must return a safe default for `!isNativePlatform` (see `blocker-native.ts`).
- **`state.account` can be null.** Always null-check before reading `state.account.userId` or `state.account.email`.
- **TanStack Query is installed but barely used.** Do not add new TanStack Query usage unless it clearly replaces an existing `useEffect`+`useState` data fetch.
