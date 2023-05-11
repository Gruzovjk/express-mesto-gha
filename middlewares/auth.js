const jwt = require('jsonwebtoken');
require('dotenv').config();
const { UnauthorizedError } = require('../errors/index');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    const error = new UnauthorizedError('Требуется авторизация');
    return next(error);
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
    );
  } catch (err) {
    const error = new UnauthorizedError('Требуется авторизация');
    return next(error);
  }

  req.user = payload;
  return next();
};
