export default class CanNotPullRequest extends Error {
    constructor(repoName, username, status) {
      super(`Não foi possível gerar o pull request do repositório ${repoName} de ${username}.
      Status do erro: ${status}`
        );
    }
  }