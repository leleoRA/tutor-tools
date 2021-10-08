export default class CanNotFork extends Error {
  constructor(repoName: string, username: string, status: string) {
    super(`Não foi possível forkar o repositório ${repoName} de ${username}.
      Status do erro: ${status}`)
  }
}
