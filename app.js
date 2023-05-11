/* eslint-disable import/order */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const errorsHandler = require('./middlewares/errorsHandler');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Слишком много запросов с этого IP, попробуйте позже',
});

const { requestsLogger, errorsLogger } = require('./middlewares/logger');

const app = express();
const { PORT, DB_CONN } = process.env;
mongoose.connect(DB_CONN);

app.use(requestsLogger);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(limiter);

app.use(require('./routes'));

app.use(errorsLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT);
