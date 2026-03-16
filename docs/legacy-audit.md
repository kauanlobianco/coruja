# Auditoria do legado

## O que existia no projeto antigo

- React/Vite como casca de entrada.
- `public/pre-compra.html` como funil de aquisição.
- `public/pos-compra.html` como app principal real.
- Estado dividido entre `localStorage`, `Preferences`, Supabase e bridges.
- RevenueCat ligado ao fluxo de navegação.
- Plugins nativos Android misturados com lógica de produto.

## Principais problemas estruturais

1. O produto não era um único app: eram várias superfícies convivendo.
2. A navegação dependia de redirects e `window.location`, não de um router central.
3. O estado de onboarding existia em múltiplos lugares.
4. O pós-compra virou um arquivo HTML enorme com responsabilidades demais.
5. Sync, backup, sessão e compra estavam acoplados ao runtime inteiro.

## Decisão para a nova base

- Recomeçar com um único app React.
- Tratar Capacitor apenas como shell nativo e ponte de plugins.
- Persistir um único snapshot local.
- Subir features por domínio: onboarding, check-in, SOS, paywall, sync, blocker.
- Migrar comportamento em etapas, sem importar a estrutura híbrida antiga.

## Mapeamento sugerido

- `pre-compra.html` -> `src/features/paywall`
- `Onboarding.tsx` -> `src/features/onboarding`
- `pos-compra.html/dashboard` -> `src/features/home`
- `syncService.ts` -> futuro `src/features/sync/services`
- plugins VPN -> futuro `src/features/blocker/native`
