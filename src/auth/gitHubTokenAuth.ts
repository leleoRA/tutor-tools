import * as service from '../services/github/authenticate'

import NotFoundError from '../errors/NotFound'
import UnauthorizedError from '../errors/Unauthorized'

export async function authenticate() {
  const gitHubToken = process.env.GIT_TOKEN
  const gitHubName = process.env.GIT_NAME

  try {
    await service.validadeGitHubTokenAndPermissions(gitHubToken)
    await service.validadeUserTokenDomain(gitHubName)
  } catch (err) {
    if (err.response?.status === 404) {
      throw new NotFoundError('usuário no github')
    }

    throw new UnauthorizedError(err.message)
  }
}
