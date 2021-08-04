import fs from "fs";

function getRepositories() {
  const fileData = fs.readFileSync("src/data/repositories.txt", "utf-8")
  const repositoriesList = fileData.split("\n")
  return repositoriesList.slice(0, repositoriesList.length)
}

function getRepoInfs(repoURL) {
  const urlInfs = repoURL.split("/")

  return {
    username: urlInfs[3],
    repoName: urlInfs[4]
  }
}

export { getRepositories, getRepoInfs }