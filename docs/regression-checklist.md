# Checklist de regressao

Use este checklist sempre que mexermos em:

- auth
- backup
- takeover entre dispositivos
- onboarding
- check-in
- SOS
- recaida
- bloqueador Android
- estados vazios
- estados de erro
- demo clock

O objetivo aqui nao e testar design. E validar se a logica central do app continua integra.

Referencias de fase 2:

- `docs/master-flows.md`
- `docs/navigation-contract.md`

## 1. Novo usuario

1. abrir o app limpo
2. confirmar que cai em `pre-purchase`
3. passar pelo funil completo
4. confirmar que depois do paywall vai para `cadastro obrigatorio`
5. criar conta
6. confirmar que vai para `onboarding`
7. concluir onboarding
8. confirmar que entra em `/app`

Esperado:

- nao pode pular para login nesse fluxo
- onboarding so deve abrir com conta vinculada
- `streak` inicial deve nascer sem erro

## 2. Login pela landing

1. limpar estado local
2. voltar para a landing
3. clicar em `Ja tenho conta`
4. confirmar que a tela abre travada em `login`
5. fazer login com conta existente

Esperado:

- restore do backup deve acontecer
- app deve abrir direto em `/app`
- dados de perfil, streak e historico devem voltar

## 3. Takeover entre dispositivos

1. deixar a conta aberta no dispositivo A
2. abrir a mesma conta no dispositivo B
3. esperar alguns segundos no dispositivo A

Esperado:

- dispositivo B assume a conta
- dispositivo A sai sozinho
- landing mostra a mensagem de que a conta foi aberta em outro dispositivo

## 4. Reset de senha

1. abrir login
2. clicar em `Esqueci minha senha`
3. usar um e-mail valido

Esperado:

- app deve mostrar mensagem clara de envio
- fluxo nao pode quebrar a tela de login

## 5. Check-in diario

1. fazer um check-in
2. voltar para `/app`
3. conferir historico recente
4. tentar fazer outro check-in no mesmo dia

Esperado:

- primeiro check-in salva
- dashboard reflete os dados
- segundo check-in do mesmo dia e bloqueado

## 6. SOS

1. abrir SOS manualmente
2. voltar ao app
3. abrir SOS de novo

Esperado:

- contador sobe uma vez por abertura real
- nao pode duplicar por montagem dupla

## 7. Recaida

1. registrar recaida
2. informar causa
3. opcionalmente escrever reflexao
4. voltar ao app

Esperado:

- `streak atual` deve resetar
- `ultima recaida` deve atualizar
- se houve reflexao, ela deve entrar no jornal

## 8. Bloqueador Android

1. abrir `/blocker`
2. solicitar permissao VPN
3. ativar o bloqueador
4. testar um dominio da lista

Esperado:

- VPN ativa
- dominio bloqueado
- notificacao aparece
- tocar na notificacao abre `/blocked`
- `/blocked` mostra dominio, streak e motivos

## 9. Reconciliacao do bloqueador

1. com o bloqueador ligado, adicionar ou remover dominio
2. testar o dominio alterado sem desligar a protecao
3. fechar e reabrir o app

Esperado:

- a VPN deve refletir a nova lista
- estado visual e estado nativo nao podem divergir
- ao reabrir o app, o status do bloqueador deve continuar coerente

## 10. Sync manual

1. abrir `Settings` ou `Home`
2. forcar sync
3. observar se aparece erro

Esperado:

- sem conta, deve avisar que nao ha conta vinculada
- com conta, deve atualizar `Ultimo sync`

## 11. Logout e limpeza local

1. sair da conta
2. confirmar que o app volta para a entrada correta
3. limpar estado local

Esperado:

- sessao local deve sair limpa
- backup remoto nao deve ser apagado
- novo boot deve voltar para o funil inicial

## 12. Estados vazios e de erro

1. abrir analytics sem historico suficiente
2. abrir biblioteca
3. abrir settings sem conta ou sem backup confirmado

Esperado:

- cada tela deve explicar o estado atual
- deve existir proximo passo claro
- nao pode parecer bug ou tela quebrada

## 13. Demo clock

1. avancar dias no painel demo
2. conferir home, check-in e analytics
3. voltar para hoje real

Esperado:

- streak deve acompanhar o deslocamento
- regra de check-in diario deve respeitar a data simulada
- analytics deve refletir o periodo calculado com a data demo

## Regra de ouro

Se qualquer fluxo falhar, anotar sempre:

- rota em que falhou
- se era web ou Android
- se havia conta vinculada
- se havia bloqueador ligado
- se o erro aconteceu depois de restore ou takeover
