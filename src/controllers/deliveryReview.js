import shell from "shelljs";

import * as googleService from "../services/google/spreadsheet.js";
import * as gitHubService from "../services/github/repositories.js";

export async function prepareReview() {
  const projectRepositories = googleService.getRepoLinks();

  if (projectRepositories.length === 0) {
    throw new NotFoundError("repositórios");
  }

  shell.mkdir("./temp/delivery-review");

  await Promise.all(
    projectRepositories.map((repoURL) => {
      const { username, repoName } = gitHubService.getRepoInfs(repoURL);

      const isDeliveryReview = true;

      try {
        shell.cd(root);
        gitHubService.clone(username, repoName, isDeliveryReview);
      } catch (err) {
        console.log(err);
      }
    })
  );
}
