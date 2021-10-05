export default class CanNotClone extends Error {
  constructor(repoName, username) {
    super(`Não foi possível clonar o repositório ${repoName} de ${username}.`)
  }
}
