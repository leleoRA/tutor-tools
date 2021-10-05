import readlineSync from 'readline-sync'
import chalk from 'chalk'

import userInputValidation from '../userInputValidation/index.js'
import classData from '../../data/index.js'

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
