import shell from "shelljs";

import * as googleService from "../services/google/spreadsheet.js";
import * as gitHubService from "../services/github/repositories.js";

export async function prepareReview() {
  const projectRepositories = googleService.getRepoLinks();

  if (projectRepositories.length === 0) {
    throw new NotFoundError("repositórios");
  }

  shell.mkdir("./temp/code-review");

  await Promise.all(
    projectRepositories.map(async (repoURL) => {
      const { username, repoName } = getRepoInfs(repoURL);

      const isDeliveryReview = false;

      try {
        const forkName = gitHubService.fork(username, repoName);

        shell.cd(root);
        gitHubService.clone(username, forkName, isDeliveryReview);
        gitHubService.deleteFiles(forkName);
        gitHubService.commitAndPush(forkName);
        gitHubService.createPullRequest(username, repoName);
      } catch (err) {
        console.log(err);
      }
    })
  );
}
