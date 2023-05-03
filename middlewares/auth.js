// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { AuthError } = require('../errors/index');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AuthError('Требуется авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
    );
  } catch (err) {
    return next(err);
  }

  req.user = payload;
  return next();
};
