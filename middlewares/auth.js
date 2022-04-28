const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;
  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    console.info('Токен не найден');
  } else {
    let payload;
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {
      next(new UnauthorizedError('Необходима авторизация'));
      console.error('Не валидный токен авторизации');
    }
    req.user = payload;
    next();
  }
};
