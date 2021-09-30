import "./setup.js";

import readlineSync from "readline-sync";
import { validateGitHubToken } from "validate-github-token";
import axios from "axios";

import {
  getRepoInfs,
  fork,
  clone,
  deleteFiles,
  commitAndPush,
  clear,
  createPullRequest,
} from "./repositories.js";

import repositories from "./data/links.js";
import { createTemplate } from './notion.js'
import NotFoundError from "./errors/NotFound.js";
import UnauthorizedError from "./errors/Unauthorized.js";

async function main() {
  const operations = ["Revisão de Entrega", "Revisão de Código", "Teste Notion"];

  const index = readlineSync.keyInSelect(
    operations,
    "Qual operação deseja realizar?"
  );

  switch (index + 1) {
    case 1:
      await deliveryReview();
      break;

    case 2:
      try {
        await gitHubTokenAuthenticate();
        await codeReview();
      } catch (err) {
        console.log(err);
      }
      
      break;
    
    case 3:
      await createTemplate();
      break;
  }
}

main();

async function deliveryReview() {}

async function codeReview() {
  const repositoriesList = repositories;
  if(repositoriesList.length === 0) {
    throw new NotFoundError("repositórios");
  }

  await Promise.all(
    repositoriesList.map(async (repoURL) => {
      const { username, repoName } = getRepoInfs(repoURL);

      try {
        const forkName = await fork(repoName, username);

        await clone(forkName, username);
        await deleteFiles(forkName);
        await commitAndPush(forkName, username);
        await createPullRequest(repoName, username);
      } catch (err) {
        console.log(err);
        return false;
      }

      return true;
    })
  );

  clear();
}

async function gitHubTokenAuthenticate() {
  const gitHubToken = process.env.GIT_TOKEN;
  const gitHubName = process.env.GIT_NAME;

  const config = {
    headers: {
      Authorization: `token ${gitHubToken}`,
    },
  };
  try {
    const validated = await validateGitHubToken(
      gitHubToken,
      {   
        scope: {
          included: ['repo']
        }
      } 
    );

    const response = await axios
      .get(
        `https://api.github.com/users/${gitHubName}`,
        config
      );

    if(!("plan" in response.data)) {
      throw new Error();
    }
  
  } catch(err) {
    if(err.response?.status === 404) {
      throw new NotFoundError("usuário no github")
    }
    
    throw new UnauthorizedError(err.message);
  } 
}