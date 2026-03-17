# Setup do Supabase

Este projeto ja esta pronto para usar Supabase com:

- autenticacao por email e senha
- backup do estado do app em `public.profiles.backup_state`
- restore do backup no login
- sessao unica por conta com takeover entre dispositivos

## O que voce vai fazer

1. criar um projeto no Supabase
2. copiar a `URL` e a `anon key`
3. colar essas chaves no arquivo `.env.local`
4. rodar um SQL pronto
5. desligar a confirmacao de email durante os testes
6. testar cadastro, login e takeover

## 1. Criar o projeto

No painel do Supabase:

1. clique em `New project`
2. escolha nome, senha do banco e regiao
3. espere o projeto ficar pronto

## 2. Pegar as chaves do projeto

No painel do projeto:

1. abra `Project Settings`
2. abra `Data API` ou `API`
3. copie:
   - `Project URL`
   - `anon public key`

## 3. Criar o arquivo `.env.local`

Na raiz do projeto `C:\vibecode\coruja`, crie um arquivo chamado `.env.local` com este conteudo:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY
```

Depois reinicie o `npm run dev`.

## 4. Rodar o SQL

No painel do Supabase:

1. abra `SQL Editor`
2. clique em `New query`
3. abra o arquivo [setup.sql](C:/vibecode/coruja/supabase/setup.sql)
4. copie tudo
5. cole no editor
6. clique em `Run`

Esse SQL cria e protege a tabela `public.profiles`, que o app usa para:

- guardar email
- salvar o backup do app
- marcar se onboarding terminou
- controlar qual dispositivo esta com a conta ativa
- guardar o heartbeat da sessao

## 5. Ajuste importante para o cadastro funcionar agora

Para o fluxo atual do app funcionar sem travar no meio:

1. abra `Authentication`
2. abra `Providers`
3. em `Email`
4. desative `Confirm email`

Motivo simples: hoje o app espera que o `signUp` ja devolva a sessao pronta para seguir ao onboarding. Se essa confirmacao ficar ligada, o usuario pode precisar validar o email antes de continuar.

Se depois voce quiser reativar a confirmacao de email, eu adapto o fluxo do app para isso.

## 6. Teste basico

### Cadastro obrigatorio depois da compra

1. rode `npm run dev`
2. entre no funil
3. avance ate o paywall
4. siga para cadastro
5. crie uma conta
6. confirme que voce vai para o onboarding
7. termine o onboarding
8. abra `Settings` e veja se existe `Ultimo sync`

### Login pela landing

1. limpe o estado local em `Settings`
2. volte para a landing
3. clique em `Ja tenho conta`
4. faca login
5. confirme que o backup foi restaurado e voce caiu no app

### Teste de takeover

1. deixe a conta aberta no dispositivo A
2. abra o app no dispositivo B
3. faca login com a mesma conta
4. espere alguns segundos no dispositivo A
5. ele deve sair sozinho e mostrar mensagem de que a conta foi aberta em outro dispositivo

## Se der erro

### `Supabase nao configurado`

Verifique o `.env.local` e reinicie o Vite.

### `Conta criada, mas a sessao ainda nao esta pronta`

Isso geralmente significa que a confirmacao de email ainda esta ligada.

### `permission denied for table profiles`

O SQL nao foi rodado inteiro ou a politica RLS nao foi criada.

### login funciona, mas restore nao

Veja se a tabela `public.profiles` recebeu uma linha com:

- `id`
- `email`
- `backup_state`
- `last_backup_at`

## Fontes oficiais

- Supabase JS `signInWithPassword`: https://supabase.com/docs/reference/javascript/auth-signinwithpassword
- Password-based Auth: https://supabase.com/docs/guides/auth/passwords
- User Management / tabela `profiles`: https://supabase.com/docs/guides/auth/managing-user-data
- Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
