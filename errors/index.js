const AuthError = require('./auth-error');
const CastError = require('./cast-error');
const NotFoundError = require('./not-found-error');
const ServerError = require('./server-error');
const DuplicateError = require('./duplicate-error');

module.exports = {
  AuthError,
  CastError,
  NotFoundError,
  ServerError,
  DuplicateError,
};
