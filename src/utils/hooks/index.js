import shell from 'shelljs'
import osName from 'os-name'

export function getConfig(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export function clear(directoryToClear = null) {
  console.log('Removendo diretórios temporários...')

  // const system = osName()
  // const separator = system.includes('Windows') ? '\\' : '/'

  shell.cd(global.root)
  // const pathDirectoryList = shell.pwd().split(separator)
  // const actualDirectory = pathDirectoryList.pop()

  // if (actualDirectory === 'tutor-tools') {
  shell.cd('temp')
  if (directoryToClear) {
    shell.cd(directoryToClear)
  }
  shell.rm('-rf', '*')
  // }
}
