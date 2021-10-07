export default class CanNotClone extends Error {
  constructor(repoName: string, username: string) {
    super(`Não foi possível clonar o repositório ${repoName} de ${username}.`)
  }
}
