import "./setup.js";

import axios from "axios";
import shell from "shelljs";

import { getRepositories, getRepoInfs } from "./repositories.js";

async function main() {
  const repositoriesList = getRepositories();

  const body = {};

  const config = {
    headers: {
      Authorization: process.env.GIT_TOKEN,
    },
  };

  await Promise.all(repositoriesList.map(async (repoURL) => {
    const { username, repoName } = getRepoInfs(repoURL);

    console.log(
      `Iniciando Fork do repositório ${repoName} do usuário ${username}...`
    );

    try {
      const fork = await axios.post(
        `https://api.github.com/repos/${username}/${repoName}/forks`,
        body,
        config
      );

      const forkName = fork.data.name;
      const folderName = username + "-" + forkName;

      shell.cd("temp")
      shell.mkdir(folderName);
      shell.cd(folderName);

      console.log(`Iniciando Clone do repositório ${forkName}...`);

      shell.exec(
        `git clone https://github.com/${process.env.GIT_NAME}/${forkName}`
      );

      const deleteIgnore = ["node_modules", "package.lock.json"];

      console.log(`Iniciando remoção dos arquivos...`);

      shell.ls(forkName).forEach((item) => {
        if (!deleteIgnore.includes(item))
          shell.rm("-rf", forkName + "/" + item);
      });

      shell.cd(forkName);

      shell.exec("git add .");
      shell.exec("git commit -m 'Preparando revisão de código'");
      shell.exec("git push");

      shell.cd("..");
      shell.cd("..");
    } catch (err) {
      console.log(err);
    }
  }));
  
  console.log("Removendo diretórios temporários...")
  shell.rm("-rf", "*");
}

main();
