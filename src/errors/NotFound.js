export default class NotFoundError extends Error {
  constructor(name) {
    super(`Sem resultados para a busca de ${name}!`);
  }
}
