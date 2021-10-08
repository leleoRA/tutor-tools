import * as gitHubRepositoriesService from '../services/github/repositories'
import * as googleService from '../services/google/spreadsheet'

import NotFoundError from '../errors/NotFound'

export async function removeForkedRepositories(projectInfo) {
  const projectRepositories = await googleService.getRepoLinks(
    projectInfo.module.link,
    projectInfo.module.project
  )

  if (projectRepositories.length === 0) {
    throw new NotFoundError('repositórios')
  }

  const forkedRepoNames = projectRepositories.map((project) => {
    const { repoName } = gitHubRepositoriesService.getRepoInfs(project)
    return repoName
  })

  await Promise.all(
    forkedRepoNames.map(async (forkRepoName) => {
      try {
        await gitHubRepositoriesService.remove(forkRepoName)
      } catch (err) {
        console.log(err)
      }
    })
  )
}
