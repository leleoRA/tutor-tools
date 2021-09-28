import fs from "fs";
import axios from "axios";
import shell from "shelljs";
import CanNotFork from "./errors/CanNotFork.js";
import CanNotClone from "./errors/CanNotClone.js";
import CanNotCommitAndPush from "./errors/CanNotCommitAndPush.js";
import CanNotPullRequest from "./errors/CanNotPullRequest.js";

export function getRepositories() {
  const fileData = fs.readFileSync("src/data/repositories.txt", "utf-8");
  const repositoriesList = fileData.split("\n");
  return repositoriesList.slice(0, repositoriesList.length);
}

export function getRepoInfs(repoURL) {
  const urlInfs = repoURL.split("/");

  return {
    username: urlInfs[3],
    repoName: urlInfs[4],
  };
}

export function fork(repoName, username) {
  console.log(
    `Iniciando fork do repositório "${repoName}" do usuário "${username}"...`
  );

  const body = {};

  const config = {
    headers: {
      Authorization: `token ${process.env.GIT_TOKEN}`,
    },
  };

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

export function clone(forkName, username) {
  console.log("Criando diretórios temporários...");

  const folderName = forkName + "-" + username;
  const formattedFolderName= folderName.replace("_","-");
  shell.cd("temp");
  shell.mkdir(formattedFolderName);
  shell.cd(formattedFolderName);

  console.log(`Iniciando clone do repositório "${forkName}"...`);

  shell.exec(
    `git clone https://github.com/${process.env.GIT_NAME}/${forkName}`
  );  

  const directoryName = shell.ls()[0];

  if(directoryName !== forkName) {
    throw new CanNotClone(forkName, username);
  }
  
}

export function deleteFiles(forkName) {
  console.log(`Iniciando remoção dos arquivos da aplicação...`);

  const deleteIgnore = ["node_modules", "package-lock.json", "README.md"];

  shell.ls(forkName).forEach((item) => {
    if (!deleteIgnore.includes(item)) shell.rm("-rf", forkName + "/" + item);
  });
}

export function commitAndPush(forkName, username) {
  console.log("Criando commit de revisão de código...");

  shell.cd(forkName);

  shell.exec("git add .");
  const commitResponse = shell.exec(
    'git commit -m "Preparando revisão de código"',
    { silent : true }
  );
  const pushResponse = shell.exec("git push");

  shell.cd("..");
  shell.cd("..");

  if(commitResponse.code !== 0 || pushResponse.code !== 0) {
    throw new CanNotCommitAndPush(forkName, username);
  }
}

export function createPullRequest(repoName, username) {
  console.log(`Criando pull request em "${repoName}"...`);

  const body = {
    title: "Preparando revisão do código",
    head: `${process.env.GIT_NAME}:master`,
    base: "master",
  };

  const config = {
    headers: {
      Authorization: `token ${process.env.GIT_TOKEN}`,
    },
  };

  return axios.post(
    `https://api.github.com/repos/${username}/${repoName}/pulls`,
    body,
    config
  ).catch(({ response }) => {
    throw new CanNotPullRequest(repoName, username, response.status);
  });;
}

export function clear() {
  console.log("Removendo diretórios temporários...");
  const pathDirectoryList = (shell.pwd()).split("/");
  const actualDirectory   = pathDirectoryList[pathDirectoryList.length - 1] ;
  if (actualDirectory === "temp"){
    shell.rm("-rf", "*");
  }
}
