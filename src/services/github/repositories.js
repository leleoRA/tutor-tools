import axios from "axios";
import shell from "shelljs";

import * as hooks from "../../utils/hooks/index.js";

import CanNotClone from "../../errors/CanNotClone.js";
import CanNotCommitAndPush from "../../errors/CanNotCommitAndPush.js";
import CanNotFork from "../../errors/CanNotFork.js";
import CanNotPullRequest from "../../errors/CanNotPullRequest.js";

export function getRepoInfs(repoURL) {
  const urlInfs = repoURL.split("/");

  return {
    username: urlInfs[3],
    repoName: urlInfs[4],
  };
}

export function fork(username, repoName) {
  console.log(
    `Iniciando fork do repositório "${repoName}" do usuário "${username}"...`
  );

  const body = {};
  const config = hooks.getConfig(process.env.GIT_TOKEN);

  const forkName = axios
    .post(
      `https://api.github.com/repos/${username}/${repoName}/forks`,
      body,
      config
    )
    .then(({ data }) => {
      return data.name;
    })
    .catch(({ response }) => {
      throw new CanNotFork(repoName, username, response.status);
    });

  return forkName;
}

export function clone(username, repoName, isDeliveryReview) {
  console.log(
    `Criando diretório temporário para o repositório "${repoName}"...`
  );

  const folderName = repoName + "-" + username;
  const formattedFolderName = folderName.replace("_", "-");

  shell.cd(`temp/${isDeliveryReview ? "delivery-review" : "code-review"}`);
  shell.mkdir(formattedFolderName);
  shell.cd(formattedFolderName);

  console.log(`Iniciando clone do repositório "${repoName}"...`);

  shell.exec(
    `git clone https://github.com/${
      isDeliveryReview ? username : process.env.GIT_NAME
    }/${repoName}`,
    { silent: true }
  );

  const directoryName = shell.ls()[0];

  if (directoryName !== repoName) {
    throw new CanNotClone(repoName, username);
  }
}

export function deleteFiles(repoName) {
  console.log(`Iniciando remoção dos arquivos da aplicação...`);

  const deleteIgnore = ["node_modules", "package-lock.json", "README.md"];

  shell.ls(repoName).forEach((item) => {
    if (!deleteIgnore.includes(item)) shell.rm("-rf", repoName + "/" + item);
  });
}

export function commitAndPush(username, repoName) {
  console.log("Criando commit de revisão de código...");

  shell.cd(repoName);

  shell.exec("git add .");
  const commitResponse = shell.exec(
    'git commit -m "Preparando revisão de código"',
    { silent: true }
  );

  const pushResponse = shell.exec("git push");

  const failCommit = commitResponse.code !== 0;
  const failPush = pushResponse.code !== 0;
  if (failCommit || failPush) {
    throw new CanNotCommitAndPush(repoName, username);
  }
}

export async function createPullRequest(username, repoName) {
  console.log(`Criando pull request em "${repoName}"...`);

  const mainBranch = await getRepoMainBranch(username, repoName);

  const body = {
    title: "Preparando revisão do código",
    head: `${process.env.GIT_NAME}:${mainBranch}`,
    base: mainBranch,
  };

  const config = hooks.getConfig(process.env.GIT_TOKEN);

  return axios
    .post(
      `https://api.github.com/repos/${username}/${repoName}/pulls`,
      body,
      config
    )
    .catch(({ response }) => {
      throw new CanNotPullRequest(repoName, username, response.status);
    });
}

async function getRepoMainBranch(username, repoName) {
  console.log(`Buscando pela branch principal em "${repoName}"...`);

  return request().then(({ data }) => {
    for (let branch of data) {
      if (branch.name === "main" || branch.name === "master") {
        return branch.name;
      }
    }
  });

  async function request() {
    const config = hooks.getConfig(process.env.GIT_TOKEN);

    return axios.get(
      `https://api.github.com/repos/${username}/${repoName}/branches`,
      config
    );
  }
}