# Coruja

Base nova para recomeçar o app mobile em React + Capacitor, com foco em Android e iOS e sem repetir a arquitetura híbrida do projeto anterior.

## O que já está pronto

- React + Vite + TypeScript
- Capacitor configurado com `android/` e `ios/`
- React Router para fluxo único
- React Query preparado para serviços remotos
- Persistência local centralizada com `@capacitor/preferences`
- Estrutura pensada por domínio, não por páginas soltas

## Estrutura inicial

```text
src/
  app/                 bootstrap, providers, rotas e estado global
  core/                integração nativa, config e storage
  features/            telas e fluxos por domínio
  shared/              layout e componentes reaproveitáveis
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

## Decisões de arquitetura

- Um único runtime React.
- Uma única fonte de verdade persistida.
- Paywall, sync, blocker e compras tratados como módulos independentes.
- Features nativas isoladas em `src/core/platform`.
- Nada de HTMLs gigantes em `public/` controlando a navegação do produto.

## Próximos passos sugeridos

1. Migrar o check-in diário para `src/features/check-in`.
2. Criar contratos de serviço para auth, sync e assinaturas.
3. Portar o SOS/recaída em componentes React pequenos.
4. Integrar plugins nativos por feature, começando pelo bloqueador.
