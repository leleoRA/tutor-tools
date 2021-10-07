export default class CanNotCommitAndPush extends Error {
  constructor(repoName: string, username: string) {
    super(
      `Não foi possível commitar e atualizar o repositório ${repoName} de ${username}.`
    )
  }
}
