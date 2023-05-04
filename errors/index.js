const UnauthorizedError = require('./unauth');
const BadRequestError = require('./bad-req');
const NotFoundError = require('./not-found');
const InternalServerError = require('./internal-server');
const ConflictingRequestError = require('./conflicting-req');
const ForbiddenError = require('./forbidden');

module.exports = {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
  InternalServerError,
  ConflictingRequestError,
  ForbiddenError,
};
