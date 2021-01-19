## Parte 1

### Requisitos Funcionais

Desenvolver uma aplicação Web que disponibiliza uma Web API que segue os princípios REST, com respostas em formato Json e  que suporta as seguintes funcionalidades:

* Obter a lista de todas as ligas
* Obter as equipas de uma determinada liga
* Gerir grupos de equipas favoritas
  * Criar grupo atribuindo-lhe um nome e descrição
  * Editar grupo, alterando o seu nome e descrição
  * Listar todos os grupos
  * Obter os detalhes de um grupo, com o seu nome, descrição e equipas que o constituem.
  * Adicionar uma equipa a um grupo
  * Remover uma equipa de um grupo
  * Obter os jogos das equipas de um grupo entre duas datas, sendo essas datas parametrizáveis no pedido. Os jogos de todas as equipas do um grupo vêm ordenados por ordem cronológica.

### Requisitos Não Funcionais

A aplicação devem ser desenvolvida com a tecnologia Node.js. Para o atendimento de pedidos HTTP deve ser usado o módulo [http](https://nodejs.org/api/http.html). Pare realização de pedidos, pode ser usado o módulo http ou em alternativa o módulo [request](https://www.npmjs.com/package/request).

Os dados que são próprios da aplicação devem ser guardados no índice foca da base de dados ElasticSearch.

Qualquer um dos módulos base do Node.js pode ser usado. Além destes, nesta 1ª parte do trabalho, apenas podem ser usados os seguintes módulos:

* request – Realização de pedidos HTTP
* debug – Mensagens de debug
* mocha – Testes unitários
  
Qualquer outro módulo que pretenda usar, deve ser previamente debatido e autorizado pelo respetivo docente.

Todos os pedidos PUT e POST devem de enviar os seus dados no corpo do pedido (_body_) e não na _query string_. [Aqui](https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/#request-body) pode ver como lidar com os dados do corpo do pedido HTTP usando o módulo `http`.

A aplicação servidora deve ser constituída por <u>pelo menos</u> 5 módulos Node:

* <code>foca-server.js</code> - ficheiro que constitui o ponto de entrada na aplicação servidora
* <code>foca-web-api.js</code> -  implementação dos rotas HTTP que constituem a API REST da aplicação Web
* <code>foca-services.js</code> - implementação da lógica de cada uma das funcionalidades da aplicação
* <code>football-data.js</code> - acesso à API FootballData.
* <code>foca-db.js</code> - acesso à BD ElasticSearch.

As dependência entre estes módulos é a seguinte:

<pre>
foca-server.js -> foca-web-api.js -> foca-services.js -> football-data.js
                                                      -> foca-db.js
</pre>

A metodologia de desenvolvimento da aplicação servidora deve ser a seguinte e por esta ordem:

1. Desenhar e documentar as rotas da API (tipo de pedido HTTP + URL+exemplo de conteúdo da resposta) e documentar no wiki do repositório do grupo
2. Criar uma coleção no Postman (exº Foca) para testar as rotas da API
3. Implementar o módulo de entrada da aplicação servidora: <code>foca-server.js</code>. Para este módulo não é necessário criar testes unitários, uma vez que este não deve implementar qualquer lógica que não seja receber alguns argumentos da linha de comando (configuração), registar rotas e iniciar o servidor web. Este módulo pode ir sendo construído à medida que vão sendo implementadas cada uma das rotas em foca-web-api.js.
4. No módulo <code>foca-web-api.js</code> implementar as rotas da API, uma a uma.
   * Para cada rota implementada, utilizar os testes do Postman para verificar o correto funcionamento dessa rota.
   * Apenas passar à implementação da próxima rota quando a anterior estiver completamente implementada e testada.
   * Para cada rota criar um pedido na coleção do Postman que a valida.
   * Nesta fase da implementação do módulo <code>foca-web-api.js</code> **usar dados locais (*mock* do <code>foca-service.js</code>)**, ou seja, os testes deve ser realizados sem acesso à API do FootballData nem ao ElasticSearch.
  
5. Implementar os serviços da aplicação no módulo foca-services.js.
   * Seguir uma abordagem semelhante à utilizada em foca-web-api.js no desenvolvimento das funcionalidades deste módulo e respectivos testes unitários.
   * À semelhança do módulo foca-services.js os testes unitários devem ser executados sem acesso à API do FootballData nem ao ElasticSearch (**mocks de football-data.js e foca-db.js**).
6. Implementar os módulos de acesso a dados:
   * <code>football-data.js</code> - acesso à API FootballData.
   * <code>foca-db.js</code> - acesso à BD ElasticSearch.