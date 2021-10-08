import shell from 'shelljs'
// import osName from 'os-name'

export function getConfig(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export function clear(directoryToClear = null) {
  console.log('Removendo diretórios temporários...')
  shell.cd(global.root)
  shell.cd('temp')
  if (directoryToClear) {
    shell.cd(directoryToClear)
  }

  shell.rm('-rf', '*')
}
