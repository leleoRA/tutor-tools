import shell from 'shelljs'
// import osName from 'os-name'

export function getConfig(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export function clear() {
  console.log('Removendo diretórios temporários...')

  // const system = osName()
  // const separator = system.includes('Windows') ? '\\' : '/'

  const pathDirectoryList = shell.pwd().split('/')
  const actualDirectory = pathDirectoryList.pop()
  if (actualDirectory === 'temp') {
    shell.rm('-rf', '*')
  } else if (actualDirectory === 'tutor-tools') {
    shell.cd('temp')
    shell.rm('-rf', '*')
  }
}
