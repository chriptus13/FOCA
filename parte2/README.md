## Parte 2

A parte 2 não inclui qualquer requisito funcional adicional. O objetivo desta parte é refazer o código implementado (_refactor_) de modo a incorporar as tecnologias e técnicas entretanto abordadas em PI, nomeadamente o módulo `express`, o suporte para _Promises_ e as construções `async`/`await` da linguagem JavaScript.

### Requisitos (funcionais e não funcionais)

1. Altere a implementação dos módulos `foca-server` e `foca-web-api` usando o módulo `express` para definição das rotas de atendimento de pedidos HTTP da aplicação FOCA. Garanta que todos os testes unitários da colecção Postman da aplicação FOCA são executados com sucesso.

2. Altere a implementação dos módulos `foca-db`, `football-data`, `foca-service` e `foca-web-api`, substituindo a utilização de _callbacks_ por um idioma assíncrono baseado em `Promise` e/ou em `async/await`. Os respectivos _mocks_ e testes unitários devem ser adaptados em conformidade com a nova API. Garanta que o correcto funcionamento de todos os módulos é validado por testes unitários.