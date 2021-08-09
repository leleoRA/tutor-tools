import "./setup.js";

import readlineSync from "readline-sync";

import {
  getRepositories,
  getRepoInfs,
  fork,
  clone,
  deleteFiles,
  commitAndPush,
  clear,
  createPullRequest,
} from "./repositories.js";

import repositories from "./data/links.js";
async function main() {
  const operations = ["Revisão de Entrega", "Revisão de Código"];

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
  }
}

main();

async function deliveryReview() {}

async function codeReview() {
  const repositoriesList = repositories;

  const success = await Promise.all(
    repositoriesList.map(async (repoURL) => {
      const { username, repoName } = getRepoInfs(repoURL);

      try {
        const forkName = await fork(repoName, username);

        await clone(forkName, username);
        await deleteFiles(forkName);
        await commitAndPush(forkName);
        await createPullRequest(repoName, username);
      } catch (err) {
        console.log(err);
        return false;
      }

      return true;
    })
  );

  if (success) await clear();
}
