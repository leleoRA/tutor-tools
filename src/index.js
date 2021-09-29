import "./setup.js";

import readlineSync from "readline-sync";
import shell from "shelljs";

import repositories from "./data/links.js";

import {
  getRepoInfs,
  fork,
  clone,
  deleteFiles,
  commitAndPush,
  clear,
  createPullRequest,
} from "./repositories.js";

const root = shell.pwd().stdout;

async function main() {
  const operations = [
    "Revisão de Entrega",
    "Revisão de Código",
    "Finalizar Avaliação",
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
      await codeReview();
      break;

    case 3:
      clearTempFiles();
      break;
  }
}

main();

async function deliveryReview() {
  const projectRepositories = repositories;

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
  const projectRepositories = repositories;

  shell.mkdir("./temp/code-review");

  await Promise.all(
    projectRepositories.map(async (repoURL) => {
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
        return false;
      }

      return true;
    })
  );
}

function clearTempFiles() {
  shell.cd(`${root}/temp`);
  clear();
}
