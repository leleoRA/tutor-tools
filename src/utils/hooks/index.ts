import shell from 'shelljs'

interface authorization {
  Authorization: string
}

interface header {
  headers: authorization
}

export function getConfig(token: string): header {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export function clear(directoryToClear: any = null) {
  console.log('Removendo diretórios temporários...')
  shell.cd(global.root)
  shell.cd('temp')
  if (directoryToClear) {
    shell.cd(directoryToClear)
  }

  shell.rm('-rf', '*')
}
