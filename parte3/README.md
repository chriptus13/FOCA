# Parte 3

A parte 3 tem como objetivo a disponibilização de uma interface para apresentação em _Web Browser_ e o suporte para autenticação, de modo a que cada utilizador possa ter dados privados.

## Requisitos (funcionais e não funcionais)

1. Criar uma interface Web para apresentação num _web browser_, para todas as funcionalidades disponibilizadas pela Web API. Na criação desta interface devem ser usadas as tecnologias: HTML, CSS, Bootstrap framework, webpack fetch e handlebars.

1. Adicione à aplicação FOCA a funcionalidade de registo e autenticação de utilizadores. Todas  as  funcionalidades  de gestão de grupos de equipas devem ficar acessíveis apenas a utilizadores autenticados. Os grupos são privados a cada utilizador e só podem ser manipulados pelo seu utilizador. Na implementação desta funcionalidade devem ser utilizados o módulo `Passport`.

1. Com esta parte do trabalho deve ser entregue um relatório no wiki do repositório do grupo, com a descrição da implementação do trabalho realizado na sua totalidade. Deste modo não devem constar os estados intermédios pelo qual a implementação passou em cada uma das fases. No relatório deve constar obrigatoriamente:
    * Descrição da estrutura da aplicação, em ambas as componentes (servidora e cliente). 
    * Documentação da API do servidor.
    * Instruções de **<u>todos</u>** os passos prévios que é necessário realizar para correr aplicação e os respetivos testes. Nesses passos devem estar incluídos as ações necessárias para introdução automática de dados de teste, por forma a que seja possível correr a aplicação com dados.