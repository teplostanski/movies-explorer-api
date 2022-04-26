class InternalError extends Error {
  constructor() {
    super('На сервере произошла ошибка');
    this.statusCode = 500;
  }
}

module.exports = InternalError;
