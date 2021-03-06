import axios from 'axios'
import shell from 'shelljs'

import * as hooks from '../../utils/hooks/index'

import CanNotClone from '../../errors/CanNotClone'
import CanNotCommitAndPush from '../../errors/CanNotCommitAndPush'
import CanNotFork from '../../errors/CanNotFork'
import CanNotPullRequest from '../../errors/CanNotPullRequest'

interface IrepoInfs {
  username: string
  repoName: string
}

export function getRepoInfs(repoURL: string): IrepoInfs {
  const urlInfs = repoURL.split('/')

  return {
    username: urlInfs[3],
    repoName: urlInfs[4],
  }
}

export function fork(username: string, repoName: string): Promise<string> {
  console.log(
    `Iniciando fork do repositório "${repoName}" do usuário "${username}"...`
  )

  const body = {}
  const config = hooks.getConfig(process.env.GIT_TOKEN)

  const forkName = axios
    .post(
      `https://api.github.com/repos/${username}/${repoName}/forks`,
      body,
      config
    )
    .then(({ data }) => data.name)
    .catch(({ response }) => {
      throw new CanNotFork(repoName, username, response.status)
    })

  return forkName
}

export function clone(
  username: string,
  repoName: string,
  isDeliveryReview: boolean
): void {
  console.log(
    `Criando diretório temporário para o repositório "${repoName}"...`
  )

  const folderName = `${username}-${repoName}`
  const formattedFolderName = folderName.replace('_', '-')

  shell.cd(`temp/${isDeliveryReview ? 'delivery-review' : 'code-review'}`)
  shell.mkdir(formattedFolderName)
  shell.cd(formattedFolderName)

  console.log(`Iniciando clone do repositório "${repoName}"...`)

  shell.exec(
    `git clone https://github.com/${
      isDeliveryReview ? username : process.env.GIT_NAME
    }/${repoName}`,
    { silent: true }
  )

  const directoryName = shell.ls()[0]

  if (directoryName !== repoName) {
    throw new CanNotClone(repoName, username)
  }
}

export function deleteFiles(repoName: string): void {
  console.log(`Iniciando remoção dos arquivos da aplicação...`)

  const deleteIgnore = ['node_modules', 'package-lock.json', 'README.md']

  shell.ls(repoName).forEach((item) => {
    if (!deleteIgnore.includes(item)) shell.rm('-rf', `${repoName}/${item}`)
  })
}

export function commitAndPush(username: string, repoName: string): void {
  console.log('Criando commit de revisão de código...')

  shell.cd(repoName)

  shell.exec('git add .')
  const commitResponse = shell.exec(
    'git commit -m "Preparando revisão de código"',
    { silent: true }
  )

  const pushResponse = shell.exec('git push')

  const failCommit = commitResponse.code !== 0
  const failPush = pushResponse.code !== 0
  if (failCommit || failPush) {
    throw new CanNotCommitAndPush(repoName, username)
  }
}

async function getRepoMainBranch(username: string, repoName: string) {
  console.log(`Buscando pela branch principal em "${repoName}"...`)

  async function request() {
    const config = hooks.getConfig(process.env.GIT_TOKEN)

    return axios.get(
      `https://api.github.com/repos/${username}/${repoName}/branches`,
      config
    )
  }

  // eslint-disable-next-line consistent-return
  return request().then(({ data }) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const branch of data) {
      if (branch.name === 'main' || branch.name === 'master') {
        return branch.name
      }
    }
  })
}

export async function createPullRequest(
  username: string,
  repoName: string
): Promise<void> {
  console.log(`Criando pull request em "${repoName}"...`)

  const mainBranch = await getRepoMainBranch(username, repoName)

  const body = {
    title: 'Preparando revisão do código',
    head: `${process.env.GIT_NAME}:${mainBranch}`,
    base: mainBranch,
  }

  const config = hooks.getConfig(process.env.GIT_TOKEN)

  return axios
    .post(
      `https://api.github.com/repos/${username}/${repoName}/pulls`,
      body,
      config
    )
    .then(() => {
      console.log('Pull request criado com sucesso!')
    })
    .catch(({ response }) => {
      throw new CanNotPullRequest(repoName, username, response.status)
    })
}
export async function remove(repoName: string) {
  const config = hooks.getConfig(process.env.GIT_TOKEN)

  axios
    .delete(
      `https://api.github.com/repos/${process.env.GIT_NAME}/${repoName}`,
      config
    )
    .then(() => {
      console.log(`Repositório ${repoName} deletado!`)
    })
    .catch(({ response }) => {
      console.log(`Não foi possível deletar o repositório ${repoName}`)
    })
}
