# GestaoUsuarioEnderecoLiven

## Descrição do Projeto 📝

**GestaoUsuarioEnderecoLiven** é uma API HTTP desenvolvida com **Express.js** e **Typescript** que fornece funcionalidades de cadastro, autenticação e controle de usuários e seus respectivos endereços. A API permite que os usuários gerenciem seus dados pessoais e seus endereços por meio de operações CRUD, além de garantir segurança com autenticação JWT para proteger os endpoints.

## Enunciado 📋

Desenvolver uma API que permita:

- Cadastro e controle de usuários
- Gerenciamento de endereços vinculados aos usuários
- Autenticação JWT para proteger as rotas

## Tecnologias Utilizadas 💻

- **Express.js** (framework backend)
- **Typescript** (superset de JavaScript)
- **TypeORM** (ORM para modelagem de dados)
- **JWT** (Json Web Tokens para autenticação)
- **Docker** (para ambiente containerizado)
- **Swagger** (para documentação da API)
- **Jest** (para testes automatizados)

---

## Especificações Técnicas ⚙️

### **Base de dados** 💾

A API utiliza um relacionamento do tipo `1:N` entre usuários e endereços, ou seja, cada usuário pode possuir múltiplos endereços, mas cada endereço pertence a apenas um usuário.

- **Tipo de banco de dados**: Pode-se utilizar qualquer banco de dados (e.g., PostgreSQL, MySQL, MongoDB), configurado através de **TypeORM**.
- A estrutura básica do banco inclui:
  - **Usuário**: nome, email, senha (hash) e outros dados pessoais.
  - **Endereço**: rua, cidade, estado, país e associação ao ID do usuário.

---

### Autenticação 🔐

A API possui autenticação com **JWT** (Json Web Token), permitindo que apenas usuários autenticados tenham acesso aos recursos protegidos.

- **Endpoints públicos**:
  - Criação de usuário
  - Login
- **Endpoints protegidos**:
  - CRUD de usuários e endereços (detalhes abaixo)
  - Validação de JWT para garantir que apenas o proprietário dos dados possa acessá-los.

---

### CRUD de Usuários 👥

- **Criar conta**: Usuários podem criar uma conta com seus dados pessoais.
- **Visualizar dados**: Usuários podem acessar seus dados, incluindo a lista de endereços.
- **Editar dados**: Usuários podem atualizar suas informações.
- **Deletar conta**: Usuários podem excluir suas contas do sistema.

---

### CRUD de Endereços 📫

- **Criar endereço**: Usuários podem adicionar novos endereços à sua conta.
- **Visualizar endereços**: Usuários podem listar seus endereços, com suporte a querystrings para filtragem por país, cidade, etc.
- **Editar endereço**: Usuários podem atualizar os dados dos seus endereços.
- **Remover endereço**: Usuários podem excluir um endereço específico.

---

## Como Rodar o Projeto 🚀

### Pré-requisitos:

- Node.js >= 14.x
- Docker e Docker Compose (opcional)

### Rodando Localmente:

1. Clone o repositório:

    ```bash
    git clone https://github.com/BrenoJoseCoelho/GestaoUsuarioEnderecoLiven.git
    ```
2. Navegue até o diretório do projeto:

    ```bash
    cd gestaousuarioenderecoliven
    ```

3. Instale as dependências:

    ```bash
    npm install
    ```

4. Configure as variáveis de ambiente criando um arquivo `.env` baseado no `.env.example`.

### Usando Docker:

5. Execute o comando para subir os containers:

    ```bash
    docker-compose up --build
    ```
---

6. Inicie a aplicação localmente:

    ```bash
    npm run start
    ```

7. Acesse a aplicação em: [http://localhost:8000/api-docs](http://localhost:8000/api-docs)

## Testes Automatizados ✅

Os testes automatizados foram implementados usando Jest, garantindo que o comportamento da API esteja de acordo com as especificações:

- Testes para todos os endpoints de CRUD de usuários e endereços.
- Testes para a autenticação JWT.
- 
** No console após executar os testes aparece um problema do TypeORM, mas se subir no terminal vai conseguir ver que os testes todos passaram**
  
Para executar os testes:

```bash
npm run test
```

## Variáveis de Ambiente 🔧

No arquivo `.env`, configure as variáveis necessárias:

```env
PORT=8000
JWT_SECRET=your_jwt_secret_key

