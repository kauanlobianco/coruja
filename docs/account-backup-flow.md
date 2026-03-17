# Fluxo de conta, backup e sync

## Fluxo antigo entendido

### Novo usuario

1. entra no pre-compra
2. faz compra
3. entra no app principal
4. so em `settings` escolhe criar conta para backup
5. depois disso os dados passam a ir para a nuvem

### Usuario com conta em outro dispositivo

1. toca em entrar pela landing, antes do quiz
2. autentica
3. sync restaura backup
4. entra direto no app principal com dados restaurados

### Seguranca atual

- uma conta nao pode ficar ativa em dois dispositivos ao mesmo tempo
- o app antigo usa um lease remoto para isso

## Mudanca desejada

### Novo usuario

1. entra no pre-compra
2. faz compra
3. obrigatoriamente cria conta
4. so depois faz onboarding
5. onboarding e app nascem com backup em nuvem desde o primeiro momento

### Usuario antigo

1. entra pela landing
2. toca em entrar
3. autentica
4. backup remoto restaura
5. vai direto ao app principal

## Divisao recomendada por etapas

### Etapa 1

- tornar conta obrigatoria antes do onboarding
- manter login na landing para restore
- manter cadastro apenas depois da compra
- criar servicos de auth e backup remoto

### Etapa 2

- ligar upload automatico do snapshot apos onboarding e mutacoes criticas
- consolidar restore remoto no modelo central

### Etapa 3

- portar seguranca por dispositivo
- sair do modelo de bloqueio duro e usar takeover seguro
- quando um novo device loga, ele assume a conta e derruba a sessao anterior
- heartbeat periodico valida se o device atual ainda e o dono da sessao
- substituir a logica antiga de lease por uma versao dedicada no Coruja

## Observacao importante

A parte de seguranca por dispositivo foi separada de auth e backup para ficar auditavel. O modelo atual do Coruja e:

1. login ou cadastro autenticam no Supabase
2. o app cria uma sessao exclusiva local com `deviceId + sessionToken`
3. essa sessao passa a ser a sessao ativa da conta na tabela `profiles`
4. o device antigo detecta a troca no heartbeat e faz logout automatico

## Colunas remotas esperadas em `profiles`

- `active_device_id text null`
- `active_session_token text null`
- `active_device_label text null`
- `last_seen_at timestamptz null`

Sem essas colunas, o takeover de dispositivo nao consegue funcionar.
