import axios from 'axios'

import { validateGitHubToken } from 'validate-github-token'

import * as hooks from '../../utils/hooks/index.js'

export async function validadeUserTokenDomain(gitHubName) {
  const config = hooks.getConfig(process.env.GIT_TOKEN)

  const response = await axios.get(
    `https://api.github.com/users/${gitHubName}`,
    config
  )

  if (!('plan' in response.data)) {
    throw new Error()
  }
}

export async function validadeGitHubTokenAndPermissions(gitHubToken) {
  await validateGitHubToken(gitHubToken, {
    scope: {
      included: ['repo'],
    },
  })
}
