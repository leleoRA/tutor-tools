import fs from "fs";
import axios from "axios";
import shell from "shelljs";

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

  return axios
    .post(
      `https://api.github.com/repos/${username}/${repoName}/forks`,
      body,
      config
    )
    .then(({ data }) => {
      return data.name;
    });
}

export function clone(forkName, username) {
  console.log("Criando diretórios temporários...");

  const folderName = forkName + "-" + username;

  shell.cd("temp");
  shell.mkdir(folderName);
  shell.cd(folderName);

  console.log(`Iniciando clone do repositório "${forkName}"...`);

  shell.exec(
    `git clone https://github.com/${process.env.GIT_NAME}/${forkName}`
  );
}

export function deleteFiles(forkName) {
  console.log(`Iniciando remoção dos arquivos da aplicação...`);

  const deleteIgnore = ["node_modules", "package-lock.json", "README.md"];

  shell.ls(forkName).forEach((item) => {
    if (!deleteIgnore.includes(item)) shell.rm("-rf", forkName + "/" + item);
  });
}

export function commitAndPush(forkName) {
  console.log("Criando commit de revisão de código...");

  shell.cd(forkName);

  shell.exec("git add .");
  shell.exec('git commit -m "Preparando revisão de código"');
  shell.exec("git push");

  shell.cd("..");
  shell.cd("..");
}

export function clear() {
  console.log("Removendo diretórios temporários...");
  shell.rm("-rf", "*");
}

export function createPullRequest(repoName, username) {
  console.log(`Criando pull request em "${repoName}"...`);

  const body = {
    title: "Preparando revisão do código",
    head: `${process.env.GIT_NAME}:main`,
    base: "main",
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
  );
}
