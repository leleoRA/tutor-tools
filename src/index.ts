/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import './setup'
import shell from 'shelljs'

import * as userInteraction from './utils/userInteraction/index'

declare global {
  var root: string
}
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

  userInteraction.askOperation(data)
}

main()
