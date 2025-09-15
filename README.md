# Sistema de Controle de Estoque
**Projeto Final - ADS | Faculdade Impacta**

**Aluno:** Mateus Turci de Oliveira

---

## Sobre o projeto

Este é o meu projeto final da faculdade, um sistema de controle de estoque completo. A ideia era criar uma ferramenta prática para gerenciar produtos, registrar vendas e controlar o que entra e sai, além de ter um sistema de login para cada usuário.

O sistema foi construído com Node.js no backend, usando um banco de dados SQLite, e o frontend é em React. Uma vantagem é que, depois de tudo instalado, ele roda 100% offline.

---

## Como rodar o sistema

Para usar, é só seguir estes dois passos: primeiro, inicie o servidor (backend) e, em seguida, a interface (frontend).

**Passo a passo (usando o terminal do VS Code):**

1.  Abra a pasta do projeto no VS Code e use o atalho `Ctrl + '` para abrir um terminal.
2.  **No primeiro terminal, vamos iniciar o backend:**
    ```bash
    cd backend
    node src/index.js
    ```
    Quando aparecer a mensagem "Servidor backend rodando na porta 3001", pode seguir para o próximo passo.

3.  Agora, abra um segundo terminal com `Ctrl + Shift + '`.
4.  **Nesse novo terminal, vamos para a pasta do frontend:**
    ```bash
    cd frontend
    npm start
    ```
    Isso deve abrir o seu navegador automaticamente no endereço `http://localhost:3000`.

> **Observação:** Se o terminal mostrar um erro como "'npm' não é reconhecido", significa que o Node.js não está instalado na sua máquina.

---

## O que o sistema faz

*   **Controle de Acesso:** Cadastro de usuários com senhas criptografadas, login e logout.
*   **Gestão de Produtos:** É possível cadastrar produtos informando nome, quantidade e valor.
*   **Registro de Vendas:** Ao fazer uma venda, o estoque do produto é atualizado na hora.
*   **Consultas:** Você pode ver o histórico de vendas ou excluir produtos e registros antigos.
*   **Segurança:** O acesso às páginas do sistema é protegido e exige que o usuário esteja logado.

---

## Banco de Dados

Eu escolhi usar **SQLite**, porque ele é simples e salva tudo em um único arquivo (`database.db` ) dentro da pasta `backend`. Esse arquivo é gerado sozinho na primeira vez que o servidor é iniciado.

As tabelas são:
*   `users`: Guarda os dados dos usuários.
*   `produtos`: Armazena os produtos com nome, quantidade e valor.
*   `vendas`: Registra o histórico de todas as vendas.

---

## Problemas comuns (e como resolver)

*   **Os produtos não aparecem na tela:** Geralmente, isso acontece por alguma falha no banco. A solução é parar o sistema, apagar o arquivo `database.db` e iniciar o backend novamente.
*   **Erro de "E-mail já cadastrado":** Simplesmente significa que aquele e-mail já foi usado em um cadastro anterior.
*   **Falha ao tentar vender:** Quase sempre é falta de estoque. Vale a pena conferir a quantidade do produto.
*   **Erro 404 na página de login:** Verifique se o backend está realmente rodando na porta 3001.
*   **O site travou:** Feche o processo no terminal do frontend (`Ctrl + C`) e execute `npm start` de novo.

---

## Tecnologias utilizadas

*   **Frontend:** React, para criar as telas de login, produtos e vendas.
*   **Backend:** Node.js com o framework Express.
*   **Banco de Dados:** SQLite, para uma solução local e sem dependências externas.
*   **Autenticação:** Usei a biblioteca `bcrypt` para garantir que as senhas fiquem seguras no banco de dados.
