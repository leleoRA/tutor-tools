import shell from 'shelljs'

import * as googleService from '../services/google/spreadsheet'
import * as gitHubService from '../services/github/repositories'
import NotFoundError from '../errors/NotFound'

export async function prepareReview(projectInfo) {
  const projectRepositories = await googleService.getRepoLinks(
    projectInfo.module.link,
    projectInfo.module.project
  )

  if (projectRepositories.length === 0) {
    throw new NotFoundError('repositórios')
  }

  shell.mkdir('./temp/delivery-review')

  await Promise.all(
    // eslint-disable-next-line array-callback-return
    projectRepositories.map((repoURL) => {
      const { username, repoName } = gitHubService.getRepoInfs(repoURL)

      const isDeliveryReview = true

      try {
        shell.cd(global.root)
        gitHubService.clone(username, repoName, isDeliveryReview)
      } catch (err) {
        console.log(err)
      }
    })
  )
}
