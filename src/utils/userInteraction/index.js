import readlineSync from 'readline-sync'
import chalk from 'chalk'

import userInputValidation from '../userInputValidation/index.js'
import classData from '../../data/index.js'

import * as gitHubAuth from '../../auth/gitHubTokenAuth.js'
import * as codeReviewController from '../../controllers/codeReview.js'
import * as communicationController from '../../controllers/communication.js'
import * as deliveryReviewController from '../../controllers/deliveryReview.js'
import * as hooks from '../hooks/index.js'

export function askClass() {
  const classNames = classData.map(
    (classInfo) => `Turma ${classInfo.className}`
  )

  const index = readlineSync.keyInSelect(
    classNames,
    chalk.bold(
      'Olá! Bem-vindo ao Tutor-Tools! Em qual turma você trabalha atualmente?'
    )
  )

  userInputValidation(index)

  return classData[index]
}

export function askModule(classInfo) {
  const moduleNames = classInfo.modules.map((m) => `Modulo ${m.id}: ${m.name}`)

  const index = readlineSync.keyInSelect(
    moduleNames,
    chalk.bold('O projeto que você deseja avaliar faz parte de qual módulo?')
  )

  userInputValidation(index)

  return classInfo.modules[index]
}

export function askProject(module) {
  const projectNames = module.projects.map((p) => p.name)

  const index = readlineSync.keyInSelect(
    projectNames,
    chalk.bold('E por fim, qual projeto você deseja avaliar?')
  )

  userInputValidation(index)

  return module.projects[index]
}

export async function askOperation(projectInfo) {
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
      await deliveryReviewController.prepareReview(projectInfo)
      break

    case 2:
      try {
        await gitHubAuth.authenticate()
        await codeReviewController.prepareReview(projectInfo)
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
