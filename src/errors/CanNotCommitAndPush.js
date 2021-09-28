export default class CanNotCommitAndPush extends Error {
    constructor(repoName, username) {
      super(`Não foi possível commitar e atualizar o repositório ${repoName} de ${username}.`
        );
    }
  }