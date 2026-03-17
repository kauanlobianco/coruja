# Coruja

Base nova do app mobile em React + Capacitor, com foco em Android e iOS, sem repetir a arquitetura hibrida do projeto anterior.

## O que ja esta pronto

- React + Vite + TypeScript
- Capacitor configurado com `android/` e `ios/`
- Router React para fluxo unico
- persistencia local centralizada com `@capacitor/preferences`
- auth, backup e takeover com Supabase
- base de produto portada por dominios

## Estrutura do projeto

```text
src/
  app/                 bootstrap, providers, rotas e estado global
  core/                dominio, config, platform, remote e storage
  features/            telas e fluxos por dominio
  shared/              layout e componentes reaproveitaveis
```

## Comandos

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run cap:sync`
- `npm run cap:android`
- `npm run cap:ios`

## Supabase

Para configurar auth, backup e takeover entre dispositivos:

1. copie `.env.example` para `.env.local`
2. preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
3. siga [supabase-setup.md](C:/vibecode/coruja/docs/supabase-setup.md)

## QA manual

Para validar os fluxos criticos do app sem depender de memoria:

- siga [regression-checklist.md](C:/vibecode/coruja/docs/regression-checklist.md)

## Arquitetura congelada

Documentos que passam a orientar as proximas fases:

- [new-architecture.md](C:/vibecode/coruja/docs/new-architecture.md)
- [state-contract.md](C:/vibecode/coruja/docs/state-contract.md)
- [architecture-freeze-phase-1.md](C:/vibecode/coruja/docs/architecture-freeze-phase-1.md)
- [master-flows.md](C:/vibecode/coruja/docs/master-flows.md)
- [navigation-contract.md](C:/vibecode/coruja/docs/navigation-contract.md)
- [home-contract.md](C:/vibecode/coruja/docs/home-contract.md)
- [architecture-freeze-phase-3.md](C:/vibecode/coruja/docs/architecture-freeze-phase-3.md)
- [architecture-freeze-phase-5.md](C:/vibecode/coruja/docs/architecture-freeze-phase-5.md)
- [migration-roadmap.md](C:/vibecode/coruja/docs/migration-roadmap.md)

## Referencias em codigo

- dominios: `src/core/config/domains.ts`
- modulos: `src/core/config/modules.ts`
- modelo central: `src/core/domain/models.ts`
- estado global: `src/app/state/app-state.tsx`

## Decisoes permanentes

- um unico runtime React
- uma unica fonte de verdade persistida
- navegação de produto no router
- plugins nativos isolados por feature
- nada de HTML gigante controlando o fluxo principal
