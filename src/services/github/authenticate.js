import axios from "axios";

import { validateGitHubToken } from "validate-github-token";

import * as api from "../../utils/api/index.js";

export async function validadeUserTokenDomain(gitHubName, gitHubToken) {
  const response = await axios.get(
    `https://api.github.com/users/${gitHubName}`,
    api.getConfig(gitHubToken)
  );

  if (!("plan" in response.data)) {
    throw new Error();
  }
}

export async function validadeGitHubTokenAndPermissions(gitHubToken) {
  await validateGitHubToken(gitHubToken, {
    scope: {
      included: ["repo"],
    },
  });
}
