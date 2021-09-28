export default class UnauthorizedError extends Error {
    constructor() {
      super("Unauthorized github token");
      }
  }