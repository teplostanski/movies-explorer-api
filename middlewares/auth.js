const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;
  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    console.info('Токен не найден');
  } else {
    let payload;
    try {
      payload = jwt.verify(token, 'dev-secret');
    } catch (err) {
      next(new UnauthorizedError('Необходима авторизация'));
      console.error('Не валидный токен авторизации');
    }
    req.user = payload;
    next();
  }
};
