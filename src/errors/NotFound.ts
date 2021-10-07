export default class NotFoundError extends Error {
  constructor(name: string) {
    super(`Sem resultados para a busca de ${name}!`)
  }
}
