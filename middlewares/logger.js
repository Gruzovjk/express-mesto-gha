/* eslint-disable import/no-extraneous-dependencies */
const winston = require('winston');
const expressWinston = require('express-winston');

const requestsLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: './logs/request.log' })],
  format: winston.format.json(),
});

const errorsLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: './logs/error.log' })],
  format: winston.format.json(),
});

module.exports = {
  requestsLogger,
  errorsLogger,
};
