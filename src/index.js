import "./setup.js";

import readlineSync from "readline-sync";
import shell from "shelljs";

import * as authenticateController from "./controllers/gitHubTokenAuthenticate.js";

import {
  getRepoInfs,
  fork,
  clone,
  deleteFiles,
  commitAndPush,
  clear,
  createPullRequest,
} from "./services/repositories.js";

import { getLinks } from "./data/links.js";
import { createTemplate } from './notion.js'
import NotFoundError from "./errors/NotFound.js";

const root = shell.pwd().stdout;
const projectRepositories = await getLinks();

async function main() {
  const operations = [
    "Feedback de Entrega",
    "Feedback de Código",
    "Finalizar Avaliação",
    "Criar template Notion"
  ];

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
        await authenticateController.authenticate();
        await codeReview();
      } catch (err) {
        console.log(err);
      }
      break;

    case 3:
      clearTempFiles();
      break;
    
    case 4:
      await createTemplate();
      break;
  }
}

main();

async function deliveryReview() {
  if (projectRepositories.length === 0) {
    throw new NotFoundError("repositórios");
  }

  shell.mkdir("./temp/delivery-review");

  await Promise.all(
    projectRepositories.map((repoURL) => {
      const { username, repoName } = getRepoInfs(repoURL);

      try {
        shell.cd(root);
        clone(username, repoName, true);
      } catch (err) {
        console.log(err);
        return false;
      }
    })
  );
}

async function codeReview() {

  if(projectRepositories.length === 0) {
    throw new NotFoundError("repositórios");
  }

  shell.mkdir("./temp/code-review");

  await Promise.all(
    projectRepositories.forEach(async (repoURL) => {
      const { username, repoName } = getRepoInfs(repoURL);

      try {
        const forkName = await fork(repoName, username);

        shell.cd(root);
        clone(username, forkName, false);
        deleteFiles(forkName);
        commitAndPush(forkName);
        createPullRequest(repoName, username);
      } catch (err) {
        console.log(err);
      }
    })
  );
}

async function clearTempFiles() {
  shell.cd(`${root}/temp`);
  clear();
}
