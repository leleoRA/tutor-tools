export default class CanNotFork extends Error {
    constructor(repoName, username, status) {
      super(`Não foi possível forkar o repositório ${repoName} de ${username}. 
      Status do erro: ${status}`
        );
    }
  }