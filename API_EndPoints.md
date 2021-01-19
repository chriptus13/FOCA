# API EndPoints

## Auth API EndPoints

* [Sign in](#sign-in)
* [Sign up](#sign-up)
* [Sign out](#sign-out)
* [Obter a sessão](#obter-a-sessão)

## FOCA API EndPoints

* [Obter a lista de todas as ligas](#obter-a-lista-de-todas-as-ligas)
* [Obter as equipas de uma determinada liga](#obter-as-equipas-de-uma-determinada-liga)
* [Criar um grupo atribuindo-lhe um nome e uma descrição](#criar-um-grupo-atribuindo-lhe-um-nome-e-uma-descrição)
* [Editar um grupo, alterando o seu nome e descrição](https://github.com/isel-leic-pi/LI52D-G05/wiki/API-EndPoints#editar-um-grupo-alterando-o-seu-nome-e-descrição)
* [Remover um grupo](#remover-um-grupo)
* [Obter um grupo](#obter-um-grupo)
* [Obter todos os grupos](#obter-todos-os-grupos)
* [Adicionar uma equipa a um grupo](#adicionar-uma-equipa-a-um-grupo)
* [Remover uma equipa de um grupo](#remover-uma-equipa-de-um-grupo)
* [Obter os jogos das equipas de um grupo entre duas datas](#obter-os-jogos-das-equipas-de-um-grupo-entre-duas-datas)

___

## Sign in

### 🠞 Pedido

* **Método:** POST
* **Path:** `/api/auth/signin`
* **Content-Type:** Application/Json
* **Body:** Objecto `User`

  ``` javascript
  User: {
    username: String,   // -> Username do utilizador
    password: String    // -> Hash da password do utilizador
  }
  ```

  * Exemplo:

  ``` javascript
  {
    username: "username",
    description: "5E884898DA28047151D0E56F8DC6292773603D0D6AABBDD62A11EF721D1542D8"
  }
  ```

### 🠞 Resposta

* StatusCode 200

  * **Content-Type:** Application/Json
  * **Body:** Objecto `UserId`

    ``` javascript
    UserId: {
      _id: String   // -> ID do utilizador autenticado
    }
    ```

    * Exemplo:

    ``` javascript
    {
      id: "kUquBGgBY_1VmkTshdo1",
    }
    ```

* StatusCode 401

  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ```javascript
    {
      message: "Wrong credentials.",
      statusCode: 401
    }
    ```

* StatusCode 404

  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ```javascript
    {
      message: "Username not found.",
      statusCode: 404
    }
    ```

[Auth API](#Auth-API-EndPoints)

___

## Sign up

### 🠞 Pedido

* **Método:** POST
* **Path:** `/api/auth/signup`
* **Content-Type:** Application/Json
* **Body:** Objecto `User`

  ``` javascript
  User: {
    fullname: String,   // -> Nome do utilizador
    username: String,   // -> Username do utilizador
    password: String    // -> Hash da password do utilizador
  }
  ```

  * Exemplo:

  ``` javascript
  {
    fullname: "Utilizador 1",
    username: "username",
    description: "5E884898DA28047151D0E56F8DC6292773603D0D6AABBDD62A11EF721D1542D8"
  }
  ```

### 🠞 Resposta

* StatusCode 201

  * **Content-Type:** Application/Json
  * **Body:** Objecto `UserId`

    ``` javascript
    UserId: {
      _id: String   // -> ID do utilizador autenticado
    }
    ```

    * Exemplo:

    ``` javascript
    {
      id: "kUquBGgBY_1VmkTshdo1",
    }
    ```

* StatusCode 400

  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ```javascript
    {
      message: "Invalid or missing parameters.",
      statusCode: 400
    }
    ```

* StatusCode 409

  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ```javascript
    {
      message: "Username already taken.",
      statusCode: 409
    }
    ```

* StatusCode 503

  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ```javascript
    {
      message: "Auth DB inaccessible.",
      statusCode: 503
    }
    ```

[Auth API](#Auth-API-EndPoints)

___

## Sign out

### 🠞 Pedido

* **Método:** DELETE
* **Path:** `/api/auth/signout`

### 🠞 Resposta

* StatusCode 200

[Auth API](#Auth-API-EndPoints)

___

## Obter a sessão

### 🠞 Pedido

* **Método:** GET
* **Path:** `/api/auth/session`

### 🠞 Resposta

* StatusCode 200

  * **Content-Type:** Application/Json
  * **Body:** Objecto `Session`

    ``` javascript
    Session: {
      auth: Boolean,    // -> Flag que indica se o utilizador está autenticado
      username: String  // -> Username do utilizador caso "auth" a true
    }
    ```

    * Exemplo:

    ``` javascript
    {
      auth: false
    }
    ```

    ``` javascript
    {
      auth: true,
      username: "username"
    }
    ```

[Auth API](#Auth-API-EndPoints)

___

## Obter a lista de todas as ligas

### 🠞 Pedido

* **Método:** GET
* **Path:** `/api/leagues`

### 🠞 Resposta

* StatusCode 200

  * **Content-Type:** Application/Json
  * **Body:** Array de objectos `League`

    ``` javascript
    League: {
      id: Int,      // -> ID da liga
      area: String, // -> Área da liga
      name: String  // -> Nome da liga
    }
    ```

    * Exemplo:

    ``` javascript
    [{
        id: 2017,
        area: "Portugal",
        name: "Primeira Liga"
    }, ...
    ]
    ```

* StatusCode 503

  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ```javascript
    {
      message: "Football API inaccessible.",
      statusCode: 503
    }
    ```

[FOCA API](#FOCA-API-EndPoints)

___

## Obter as equipas de uma determinada liga

### 🠞 Pedido

* **Método:** GET
* **Path:** `/api/leagues/<lId>/teams`
* **Parâmetros:**
  * `<lId>` - ID da liga na Football API

### 🠞 Resposta

* StatusCode 200

  * **Content-Type:** Application/Json
  * **Body:** Array de objectos `Team`

    ``` javascript
      Team: {
        id: Int,            // -> ID da team
        name: String,       // -> Nome da team
        shortName: String,  // -> Nome curto da team
        tla: String,        // -> Abreviatura do nome da team
        venue: String       // -> Estádio da team
      }
      ```
  
    * Exemplo:

    ``` javascript
    [{
      id: 498,
      name: "Sporting Clube de Portugal",
      shortName: "Sporting CP",
      tla: "SPO",
      venue: "Estádio José Alvalade"
    }, ...
    ]
    ```

* StatusCode 404

  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ```javascript
    {
      message: "League not found.",
      statusCode: 404
    }
    ```

* StatusCode 503

  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ```javascript
    {
      message: "Football API inaccessible.",
      statusCode: 503
    }
    ```

[FOCA API](#FOCA-API-EndPoints)

___

## Criar um grupo atribuindo-lhe um nome e uma descrição

### 🠞 Pedido

* **Método:** POST
* **Path:** `/api/groups`
* **Content-Type:** Application/Json
* **Body:** Objecto `Group`

  ``` javascript
  Group: {
    name: String,       // -> Nome do grupo
    description: String // -> Descrição do grupo
  }
  ```

  * Exemplo:

  ``` javascript
  {
    name: "Portugal",
    description: "Portuguese teams"
  }
  ```

### 🠞 Resposta

* StatusCode 201
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Group`

    ``` javascript
    Group: {
      _id: String,  // -> ID do grupo criado
      _path: String // -> Path para o grupo criado
    }
    ```

    * Exemplo:

    ``` javascript
    {
      _id: "Zd5AsmYB2P4eOmkQ7MkH",
      _path: "/api/groups/Zd5AsmYB2P4eOmkQ7MkH"
    }
    ```

* StatusCode 400
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "Invalid or missing parameters.",
      statusCodeError: 400
    }
    ```

* StatusCode 401
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "User not authenticated.",
      statusCodeError: 401
    }
    ```

* StatusCode 503
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:
  
    ``` javascript
    {
      message: "FOCA DB inaccessible.",
      statusCode: 503
    }
    ```

[FOCA API](#FOCA-API-EndPoints)

___

## Editar um grupo, alterando o seu nome e descrição

### 🠞 Pedido

* **Método:** PUT
* **Path:** `/api/groups/<gId>`
* **Content-Type:** Application/Json
* **Body:** Objecto `Group`

  ``` javascript
  Group: {
    name: String,       // -> Nome do grupo
    description: String // -> Descrição do grupo
  }
  ```

  * Exemplo:

  ``` javascript
  {
    name: "Portugal",
    description: "Portuguese teams"
  }
  ```

### 🠞 Resposta

* StatusCode 200
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Group`

    ``` javascript
    Group: {
      _id: String,  // -> ID do grupo
      _path: String // -> Path para o grupo
    }
    ```

    * Exemplo:

    ``` javascript
    {
      _id: "Zd5AsmYB2P4eOmkQ7MkH",
      _path: "/api/groups/Zd5AsmYB2P4eOmkQ7MkH"
    }
    ```

* StatusCode 400
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "Invalid or missing parameters.",
      statusCode: 400
    }
    ```

* StatusCode 401
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "User not authenticated.",
      statusCodeError: 401
    }
    ```

* StatusCode 404
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "Group not found.",
      statusCodeError: 404
    }
    ```

* StatusCode 503
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:
  
    ``` javascript
    {
      message: "FOCA DB inaccessible.",
      statusCode: 503
    }
    ```

[FOCA API](#FOCA-API-EndPoints)

___

## Remover um grupo

### 🠞 Pedido

* **Método:** DELETE
* **Path:** `/api/groups/<gId>`

### 🠞 Resposta

* StatusCode 200
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Group`

    ``` javascript
    Group: {
      name: String,         // -> Nome do grupo
      description: String,  // -> Descrição do grupo
      teams: Array<Team>    // -> Equipas que pertencem ao grupo
    }

    Team: {
      id: Int,            // -> ID da team
      name: String,       // -> Nome da team
      shortName: String,  // -> Nome curto da team
      tla: String,        // -> Abreviatura do nome da team
      venue: String       // -> Estádio da team
    }
    ```

    * Exemplo:

    ``` javascript
    {
      name: "Portugal",
      description: "Equipas de Portugal",
      teams: [{
        id: 498,
        name: "Sporting Clube de Portugal",
        shortName: "Sporting CP",
        tla: "SPO",
        venue: "Estádio José Alvalade"
      }, ...
      ]
    }
    ```

* StatusCode 401
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "User not authenticated.",
      statusCodeError: 401
    }
    ```

* StatusCode 404
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "Group not found.",
      statusCode: 404
    }
    ```

* StatusCode 503
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:
  
    ``` javascript
    {
      message: "FOCA DB inaccessible.",
      statusCode: 503
    }
    ```

[FOCA API](#FOCA-API-EndPoints)

___

## Obter um grupo

### 🠞 Pedido

* **Método:** GET
* **Path:** `/api/groups/<gId>`
* **Parâmetros:**
  * `<gId>` - ID do grupo

### 🠞 Resposta

* StatusCode 200
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Group`

    ``` javascript
    Group: {
      name: String,         // -> Nome do grupo
      description: String,  // -> Descrição do grupo
      teams: Array<Team>    // -> Equipas que pertencem ao grupo
    }

    Team: {
      id: Int,            // -> ID da team
      name: String,       // -> Nome da team
      shortName: String,  // -> Nome curto da team
      tla: String,        // -> Abreviatura do nome da team
      venue: String       // -> Estádio da team
    }
    ```

    * Exemplo:

    ``` javascript
    {
      name: "Portugal",
      description: "Equipas de Portugal",
      teams: [{
        id: 498,
        name: "Sporting Clube de Portugal",
        shortName: "Sporting CP",
        tla: "SPO",
        venue: "Estádio José Alvalade"
      }, ...
      ]
    }
    ```

* StatusCode 401
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "User not authenticated.",
      statusCodeError: 401
    }
    ```

* StatusCode 404
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "Group not found.",
      statusCode: 404
    }
    ```

* StatusCode 503
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:
  
    ``` javascript
    {
      message: "FOCA DB inaccessible.",
      statusCode: 503
    }
    ```

[FOCA API](#FOCA-API-EndPoints)

___

## Obter todos os grupos

### 🠞 Pedido

* **Método:** GET
* **Path:** `/api/groups`

### 🠞 Resposta

* StatusCode 200
  * **Content-Type:** Application/Json
  * **Body:** Array de objectos `Group` ou um Array vazio `[]`

    ``` javascript
    Group: {
      name: String,         // -> Nome do grupo
      description: String,  // -> Descrição do grupo
      teams: Array<Team>    // -> Equipas que pertencem ao grupo
    }

    Team: {
      id: Int,            // -> ID da team
      name: String,       // -> Nome da team
      shortName: String,  // -> Nome curto da team
      tla: String,        // -> Abreviatura do nome da team
      venue: String       // -> Estádio da team
    }
    ```

    * Exemplo:

    ``` javascript
    [
      {
        name: "Portugal",
        description: "Equipas de Portugal",
        teams: [{
          id: 498,
          name: "Sporting Clube de Portugal",
          shortName: "Sporting CP",
          tla: "SPO",
          venue: "Estádio José Alvalade"
        }, ...
        ]
      }, ...
    ]
    ```

* StatusCode 401
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "User not authenticated.",
      statusCodeError: 401
    }
    ```

* StatusCode 503
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:
  
    ``` javascript
    {
      message: "FOCA DB inaccessible.",
      statusCode: 503
    }
    ```

[FOCA API](#FOCA-API-EndPoints)

___

## Adicionar uma equipa a um grupo

### 🠞 Pedido

* **Método:** PUT
* **Path:** `/api/groups/<gId>/teams/<tId>`
* **Parâmetros:**
  * `<gId>` - ID do grupo
  * `<tId>` - ID da equipa a inserir

### 🠞 Resposta

* StatusCode 200
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Team`

    ``` javascript
    Team: {
      id: Int,            // -> ID da team
      name: String,       // -> Nome da team
      shortName: String,  // -> Nome curto da team
      tla: String,        // -> Abreviatura do nome da team
      venue: String       // -> Estádio da team
    }
    ```

    * Exemplo:

    ``` javascript
    {
      id: 498,
      name: "Sporting Clube de Portugal",
      shortName: "Sporting CP",
      tla: "SPO",
      venue: "Estádio José Alvalade"
    }
    ```

* StatusCode 401
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "User not authenticated.",
      statusCodeError: 401
    }
    ```

* StatusCode 404
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "Group or Team not found.",
      statusCode: 404
    }
    ```

* StatusCode 503
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:
  
    ``` javascript
    {
      message: "FOCA DB or Football API inaccessible.",
      statusCode: 503
    }
    ```

[FOCA API](#FOCA-API-EndPoints)

___

## Remover uma equipa de um grupo

### 🠞 Pedido

* **Método:** DELETE
* **Path:** `/api/groups/<gId>/teams/<tId>`
* **Parâmetros:**
  * `<gId>` - ID do grupo
  * `<tId>` - ID da equipa a apagar

### 🠞 Resposta

* StatusCode 200
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Team`

    ``` javascript
    Team: {
      id: Int,            // -> ID da team
      name: String,       // -> Nome da team
      shortName: String,  // -> Nome curto da team
      tla: String,        // -> Abreviatura do nome da team
      venue: String       // -> Estádio da team
    }
    ```

    * Exemplo:

    ``` javascript
    {
      id: 498,
      name: "Sporting Clube de Portugal",
      shortName: "Sporting CP",
      tla: "SPO",
      venue: "Estádio José Alvalade"
    }
    ```

* StatusCode 401
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "User not authenticated.",
      statusCodeError: 401
    }
    ```

* StatusCode 404
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "Group or Team not found.",
      statusCode: 404
    }
    ```

* StatusCode 503
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:
  
    ``` javascript
    {
      message: "FOCA DB inaccessible.",
      statusCode: 503
    }
    ```

[FOCA API](#FOCA-API-EndPoints)

___

## Obter os jogos das equipas de um grupo entre duas datas

### 🠞 Pedido

* **Método:** GET
* **Path:** `/api/groups/<gID>/matches`
* **Query-String:** `?from=<dateFrom>&to=<dateTo>`
* **Parâmetros:**
  * `<gId>` - ID do grupo
  * `<dateFrom>` - Data inicial (YYYY-MM-DD)
  * `<dateTo>` - Data final (YYYY-MM-DD)

### 🠞 Resposta

* StatusCode 200
  * **Content-Type:** Application/Json
  * **Body:** Array de objectos `Match` ou um Array vazio `[]`

    ``` javascript
    Match: {
      id: Int,        // -> ID do jogo
      homeTeam: Team, // -> Equipa da casa
      awayTeam: Team, // -> Equipa visitante
      date: Date      // -> Data do jogo (YYYY-MM-DD)
    }

    Team: {
      id: Int,            // -> ID da team
      name: String,       // -> Nome da team
    }
    ```

    * Exemplo:

    ``` javascript
    [{
      id: 241346,
      homeTeam: {
        id: 498,
        name: "Sporting Clube de Portugal"
      },
      awayTeam: {
        id: 1903,
        name: "Sport Lisboa e Benfica"
      },
      date: "2018-11-03T18:00:00.000Z"
    }, ...
    ]
    ```

* StatusCode 401
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "User not authenticated.",
      statusCodeError: 401
    }
    ```

* StatusCode 404
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:

    ``` javascript
    {
      message: "Group not found.",
      statusCode: 404
    }
    ```

* StatusCode 503
  * **Content-Type:** Application/Json
  * **Body:** Objecto `Error`

    ``` javascript
    Error: {
      message: String,  // -> Mensagem de erro
      statusCode: Int   // -> Código de erro
    }
    ```

    * Actual:
  
    ``` javascript
    {
      message: "FOCA DB or Football API inaccessible.",
      statusCode: 503
    }
    ```

[FOCA API](#FOCA-API-EndPoints)
