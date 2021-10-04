import * as service from '../services/github/authenticate.js'

import NotFoundError from '../errors/NotFound.js'
import UnauthorizedError from '../errors/Unauthorized.js'

export async function authenticate() {
  const gitHubToken = process.env.GIT_TOKEN
  const gitHubName = process.env.GIT_NAME

  try {
    await service.validadeGitHubTokenAndPermissions(gitHubToken)
    await service.validadeUserTokenDomain(gitHubName, gitHubToken)
  } catch (err) {
    if (err.response?.status === 404) {
      throw new NotFoundError('usuário no github')
    }

    throw new UnauthorizedError(err.message)
  }
}
