# **Tutor-tools**

Olá! Seja bem-vinde ao Tutor-tools! Ferramenta desenvolvida por nós, tutores da Driven Education, que tem como objetivo automatizar processos manuais realizados nas tarefas de avaliação.


### **Features**

1. Geração de Pull Request nos repositórios dos alunos listados para realização do feedback de código

2. Clone de todos os repositórios dos alunos para realização de feedback de entrega

3. Comunicação no Notion a partir da planilha de avaliação

4. Remoção de repositórios forkados na **feature 1**

5. Remoção de repositórios locais clonados na **feature 2**


### **Como usar**

**Pré-requisitos**

Para começar a usar o tutor tools, é necessário que baixe o projeto. Você pode baixa-ló com o seguinte comando:
```
git clone https://github.com/gugabs/tutor-tools.git
```
Em seguida, entre no projeto baixado e instale as dependencias rodando
```
npm install
```

Após isso, você deve gerar algumas chaves de autenticação para a conexão com as api's utilizadas na aplicação. São elas:
- **GitHub**: *vá até o seu github e gere um token com acesso para forks, pull requests e clones*
- **Notion**: *consulte a documentação neste [link](https://developers.notion.com/docs/getting-started) para gerar o token pessoal e o id do banco de dados da página que você deseja editar na comunicação.*
- **Google**: *consulte a documentação neste [link](https://developers.google.com/sheets/api) para gerar os dados em formato JSON que deve entrar no arquivo ``client_secret_google.ts`` na raiz do projeto e também gerar a permissão do email do cliente na planinha de avaliações.*

Tendo esses dados, crie um arquivo .env baseado no .envExample. Além disso, o arquivo .env também deve conter o seu nome na variável de ambiente TUTOR_NAME.

Feito isto, está tudo pronto para começarmos a usar o tutor tools!
Para isso é só rodar o seguinte comando e começar os processos para sua avaliação!

```
npm start
```

__Bom trabalho!__


