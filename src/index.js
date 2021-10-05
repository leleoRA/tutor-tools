import './setup.js'

import chalk from 'chalk'
import readlineSync from 'readline-sync'
import shell from 'shelljs'

import * as gitHubAuth from './auth/gitHubTokenAuth.js'
import * as codeReviewController from './controllers/codeReview.js'
import * as communicationController from './controllers/communication.js'
import * as deliveryReviewController from './controllers/deliveryReview.js'

import * as hooks from './utils/hooks/index.js'
import * as userInteraction from './utils/userInteraction/index.js'

global.root = shell.pwd().stdout

async function main() {
  const classInfo = userInteraction.askClass()
  const module = userInteraction.askModule(classInfo)
  const project = userInteraction.askProject(module)

  const data = {
    className: classInfo.className,
    module: {
      id: module.id,
      name: module.name,
      link: module.link,
      project,
    },
  }

  askOperation(data)
}

async function askOperation(projectInfo) {
  const operations = [
    'Revisão de Entrega',
    'Revisão de Código',
    'Gerar Comunicação',
    'Finalizar Avaliação',
  ]

  const index = readlineSync.keyInSelect(
    operations,
    chalk.bold('Qual operação deseja realizar?')
  )
  const spreadsheetId = '1WggtFYE6R7OY0kFMIAv-IjY-PN4OZ3EJSqmsveWqTjM'
  const sheetTitle = 'teste'
  const nSemana = '17'
  switch (index + 1) {
    case 1:
      await deliveryReviewController.prepareReview(spreadsheetId, sheetTitle)
      break

    case 2:
      try {
        await gitHubAuth.authenticate()
        await codeReviewController.prepareReview(spreadsheetId, sheetTitle)
      } catch (err) {
        console.log(err)
      }
      break

    case 3:
      await communicationController.prepareCommunication(
        spreadsheetId,
        sheetTitle,
        nSemana
      )
      break

    case 4:
      hooks.clear()
      break
    default:
      break
  }
}

main()
