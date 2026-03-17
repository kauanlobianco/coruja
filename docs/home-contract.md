# Contrato estrutural da Home

Este documento congela a funcao da `Home` dentro do app principal.

## Papel da Home

A `Home` e o centro operacional do produto.

Ela nao e:

- tela de debug
- resumo tecnico do estado
- painel administrativo

Ela e a tela que decide o proximo passo do usuario.

## Ordem estrutural congelada

1. streak
2. CTA principal do dia
3. atalhos consistentes para leitura e manutencao
4. card de check-in
5. card de journal
6. card de bloqueador
7. motivos

## O que a Home deve responder

Ao abrir a tela, o usuario precisa entender rapidamente:

1. como esta sua jornada agora
2. qual e a acao principal de hoje
3. se sua protecao esta ativa
4. onde registrar contexto
5. por que continuar

## CTA principal

Prioridade atual:

1. check-in pendente
2. SOS se fissura alta
3. ativar bloqueador se protecao desligada
4. journal como consolidacao

## Atalhos que ficam abaixo do CTA

- analytics
- biblioteca
- settings

Esses atalhos existem para dar previsibilidade e reduzir navegacao escondida.

## Cards operacionais

### Check-in

Deve mostrar:

- status do dia
- ultimo registro
- resumo do contexto recente

### Journal

Deve mostrar:

- quantidade de entradas
- ultima entrada
- acesso direto para escrever ou revisar

### Bloqueador

Deve mostrar:

- ativo ou inativo
- dominios protegidos
- tentativas bloqueadas
- acesso direto ao modulo

## Motivos

A secao de motivos fecha a home.

Ela deve funcionar como ancora emocional, nao como detalhe tecnico.

## O que ainda nao faz parte da Home

Nao colocar aqui como foco principal:

- detalhes profundos de backup
- formularios completos
- listas grandes de historico
- settings detalhado

Esses itens pertencem a outras telas.
