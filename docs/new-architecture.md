# Nova arquitetura proposta

## Camadas

### `app/`

- bootstrap
- providers
- router
- estado global inicial

### `core/`

- integração com Capacitor
- persistência
- contratos técnicos comuns

### `features/`

- uma pasta por domínio de negócio
- telas, hooks e serviços próximos entre si

### `shared/`

- layout, UI reutilizável e utilitários visuais

## Princípios

1. Uma feature não deve depender da implementação interna de outra.
2. Fluxos de produto ficam no router React.
3. Persistência local e sync remoto usam modelos explícitos.
4. Plugin nativo só conversa com a feature por uma interface clara.
5. Monetização não decide sozinha a navegação do app.
