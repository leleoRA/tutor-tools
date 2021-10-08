export default class CanNotPullRequest extends Error {
  constructor(repoName: string, username: string, status: string) {
    super(`Não foi possível gerar o pull request do repositório ${repoName} de ${username}.
      Status do erro: ${status}`)
  }
}
