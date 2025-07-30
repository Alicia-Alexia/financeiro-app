# 💰 Sistema de Controle Financeiro - SOP

Este sistema permite o gerenciamento de **Despesas**, **Empenhos** e **Pagamentos** de forma estruturada, garantindo a rastreabilidade e controle dos processos financeiros da instituição.

## 🔧 Tecnologias Utilizadas

- **Back-end**: Java + Spring Boot
- **Front-end**: Next.js + Tailwind CSS + Redux Toolkit
- **Banco de Dados**: PostgreSQL
- **ORM**: JPA / Hibernate

## 🧱 Entidades Principais

### 🧾 Despesa
- `id`: Identificador
- `numeroProtocolo`: Protocolo único
- `tipoDespesa`, `dataProtocolo`, `dataVencimento`, `credor`, `descricao`, `valorDespesa`

### 📄 Empenho
- `id`: Identificador
- `numeroEmpenho`: Único
- `dataEmpenho`, `valorEmpenho`
- Relacionamento com **Despesa**

### 💳 Pagamento
- `id`: Identificador
- `numeroPagamento`: Único
- `dataPagamento`, `valorPagamento`
- Relacionamento com **Empenho**

## 🗃️ Relacionamentos

- Uma **Despesa** pode ter **múltiplos Empenhos**.
- Um **Empenho** pode ter **múltiplos Pagamentos**.
- A exclusão de uma **Despesa** exclui seus **Empenhos** e **Pagamentos** associados (via `ON DELETE CASCADE`).

## 🧪 Como rodar o projeto

```bash
# 1. Clone o repositório
git clone https://github.com/Alicia-Alexia/financeiro-app.git
cd Financeiro

# 2. Rode o back-end (Spring Boot)
./mvnw spring-boot:run

# 3. Rode o front-end (Next.js)
cd financeiro-app
npm install
npm run dev

⚠️ Pontos de Melhoria
Este projeto ainda está em fase de evolução. Algumas melhorias previstas incluem:

 Testes unitários e de integração

 Deploy automatizado (CI/CD)

 Tratamento de exceções mais robusto

 Interface de administração aprimorada
