import shell from 'shelljs'

import * as googleService from '../services/google/spreadsheet'
import * as gitHubService from '../services/github/repositories'
import NotFoundError from '../errors/NotFound'
import { ImoduleInfo } from '../interfaces'
import { clear } from '../utils/hooks/index'

export async function prepareReview(projectInfo: ImoduleInfo): Promise<void> {
  const projectRepositories = await googleService.getRepoLinks(
    projectInfo.module.link,
    projectInfo.module.project
  )

  if (projectRepositories.length === 0) {
    throw new NotFoundError('repositórios')
  }

  shell.mkdir('./temp/code-review')

  await Promise.all(
    projectRepositories.map(async (repoURL) => {
      const { username, repoName } = gitHubService.getRepoInfs(repoURL)

      const isDeliveryReview = false

      try {
        const forkName = await gitHubService.fork(username, repoName)

        shell.cd(global.root)
        gitHubService.clone(username, forkName, isDeliveryReview)
        gitHubService.deleteFiles(forkName)
        gitHubService.commitAndPush(username, forkName)
        gitHubService.createPullRequest(username, repoName)
      } catch (err) {
        console.log(err)
      }
    })
  )
  clear('code-review')
}
