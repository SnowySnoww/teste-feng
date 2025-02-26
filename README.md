# Documentação do Projeto - Teste Feng

## Visão Geral
Este projeto consiste em uma aplicação web com um backend desenvolvido em **NestJS** e um frontend desenvolvido em **React**. A aplicação permite que administradores e usuários acessem pedidos de clientes, com funcionalidades de filtragem e exibição detalhada de pedidos.

## Tecnologias Utilizadas
- **Backend:** NestJS
- **Frontend:** React
- **Banco de Dados:** PostgreSQL
- **Cache:** Redis
- **Gerenciamento de Dependências:** npm
- **Containerização:** Docker (opcional)

## Configuração do Ambiente
Antes de iniciar a aplicação, certifique-se de ter os seguintes requisitos instalados:

- **Node.js** (versão mais recente recomendada)
- **Docker** (caso opte por rodar PostgreSQL e Redis via container)

### 1. Subindo PostgreSQL e Redis
Você pode rodar o PostgreSQL e o Redis localmente ou utilizar **Docker**. Para Docker, use os seguintes comandos:

```sh
docker run --name festival-redis -d -p 6379:6379 redis

docker run --name festival-postgres -e POSTGRES_DB=festival_db -e POSTGRES_USER=festival_user -e POSTGRES_PASSWORD=festival_pass -d -p 5432:5432 postgres
```

Caso opte por rodar localmente, utilize as seguintes credenciais para configurar o banco de dados:

- **POSTGRES_DB:** festival_db
- **POSTGRES_USER:** festival_user
- **POSTGRES_PASSWORD:** festival_pass

### 2. Configurando o Backend (NestJS)
Navegue até a pasta `desafio` e instale as dependências do backend:

```sh
cd desafio
npm install
```

Execute o comando abaixo para rodar as migrations iniciais do banco de dados:

```sh
npm run setup
```

Depois, execute o comando para popular o banco com dados iniciais:

```sh
npm run seed
```

Agora, inicie o servidor backend:

```sh
npm run start:dev
```

### 3. Configurando o Frontend (React)
Navegue até a pasta `desafio-frontend` e instale as dependências do frontend:

```sh
cd ../desafio-frontend
npm install
```

Execute o comando para iniciar o frontend:

```sh
npm run dev
```

A aplicação estará rodando e pronta para uso!

## Uso do Sistema

### Credenciais do Admin
Para acessar o sistema como administrador, utilize as credenciais:

- **Email:** admin@festival.com
- **Senha:** admin123

### Funcionalidades
- O **admin** pode visualizar todos os pedidos de qualquer usuário.
- Os **usuários comuns** podem acessar o sistema e ver apenas seus próprios pedidos.
- Existe um **filtro por datas e nomes de clientes**.
- É possível visualizar detalhes de cada pedido, incluindo:
  - Quantidades
  - Nomes
  - Descrições
  - Valores


