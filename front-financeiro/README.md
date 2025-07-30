README do Projeto: Gerenciador de Despesas, Empenhos e Pagamentos
Este projeto é um aplicativo web frontend desenvolvido com Next.js, TypeScript, React, Redux Toolkit e Tailwind CSS. Ele foi projetado para interagir com um backend (não incluído neste repositório) para gerenciar operações CRUD (Criar, Ler, Atualizar, Deletar) de Despesas, Empenhos e Pagamentos.

🚀 Introdução
Este aplicativo oferece uma interface intuitiva para:

Gerenciar despesas, incluindo detalhes como número de protocolo, credor, descrição, valor e tipo.

Gerenciar empenhos, associando-os a despesas existentes e registrando informações como número do empenho, data, valor e observações.

Gerenciar pagamentos, vinculando-os a empenhos e detalhando o número do pagamento, data, valor e observações.

A aplicação foi desenvolvida com foco em responsividade e uma experiência de usuário fluida, utilizando Tailwind CSS para estilização e Redux Toolkit para gerenciamento de estado.

📂 Estrutura do Projeto
A estrutura de pastas do projeto é organizada da seguinte forma:

🛠️ Tecnologias Utilizadas
Next.js: Framework React para aplicações web.

React: Biblioteca JavaScript para construção de interfaces de usuário.

TypeScript: Superconjunto tipado de JavaScript.

Redux Toolkit: Conjunto de ferramentas para desenvolvimento Redux eficiente.

React-Redux: Ligações oficiais do React para Redux.

Axios: Cliente HTTP baseado em Promises para fazer requisições a APIs.

Tailwind CSS: Framework CSS utilitário para estilização rápida e responsiva.

📋 Requisitos
Para executar este projeto, você precisará ter instalado:

Node.js (versão 18.x ou superior recomendada)

npm (gerenciador de pacotes do Node.js) ou Yarn

Além disso, é necessário um backend compatível rodando localmente (ou em um servidor acessível) para que o frontend possa interagir com os dados.

⚙️ Configuração do Backend (Importante)
Este frontend espera que seu backend esteja rodando em http://localhost:8081/api e forneça os seguintes endpoints RESTful:

Despesas
GET /api/despesa: Retorna uma lista de todas as despesas.

POST /api/despesa: Cria uma nova despesa.

PUT /api/despesa/{id}: Atualiza uma despesa existente pelo ID.

DELETE /api/despesa/{id}: Exclui uma despesa pelo ID.

Empenhos
GET /api/empenho: Retorna uma lista de todos os empenhos.

POST /api/empenho: Cria um novo empenho.

PUT /api/empenho/{id}: Atualiza um empenho existente pelo ID.

DELETE /api/empenho/{id}: Exclui um empenho pelo ID.

Regra de Negócio: Este endpoint deve impedir a exclusão de um empenho se ele tiver pagamentos associados e retornar um código de status HTTP apropriado (ex: 409 Conflict ou 400 Bad Request) com uma mensagem de erro clara.

Pagamentos
GET /api/pagamento: Retorna uma lista de todos os pagamentos.

GET /api/pagamento/empenho/{empenhoId}: Retorna uma lista de pagamentos associados a um empenhoId específico.

POST /api/pagamento: Cria um novo pagamento.

PUT /api/pagamento/{id}: Atualiza um pagamento existente pelo ID.

DELETE /api/pagamento/{id}: Exclui um pagamento pelo ID.

🚀 Instalação
Siga os passos abaixo para configurar e instalar as dependências do projeto:

Clone o repositório (ou baixe o código-fonte):

git clone https://github.com/Alicia-Alexia/financeiro-app.git
cd financeiro-app

Instale as dependências do projeto usando npm:

npm install

Ou, se preferir usar Yarn:

yarn install

🏃 Como Rodar o Projeto
Após a instalação das dependências e com o seu backend em execução, você pode iniciar o servidor de desenvolvimento do Next.js:

npm run dev

Ou com Yarn:

yarn dev

O aplicativo estará disponível em http://localhost:3000.

🌐 Navegação no Aplicativo
Página Inicial (Despesas): Acesse http://localhost:3000 para gerenciar as despesas.

Página de Empenhos: Clique no link "Ir para Empenhos" na página de despesas, ou acesse diretamente http://localhost:3000/empenho.

Página de Pagamentos: Clique no link "Ir para Pagamentos" nas páginas de despesas ou empenhos, ou acesse diretamente http://localhost:3000/pagamento.

✨ Considerações
As datas nos formulários são formatadas para YYYY-MM-DD para compatibilidade com inputs type="date". Ao enviar para o backend, a dataProtocolo é convertida para uma string ISO (timestamp), enquanto as outras datas são enviadas como YYYY-MM-DD. Certifique-se de que seu backend lida com esses formatos adequadamente.

A exclusão de um empenho com pagamentos associados exibirá um modal de aviso, impedindo a exclusão até que todos os pagamentos relacionados sejam removidos. Esta lógica depende da resposta do seu backend ao tentar excluir um empenho com dependências.
