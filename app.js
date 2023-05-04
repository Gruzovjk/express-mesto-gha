require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const errorsHandler = require('./middlewares/errorsHandler');

const app = express();
const { PORT, DB_CONN } = process.env;
mongoose.connect(DB_CONN);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

app.use(require('./routes'));

app.use(errorsHandler);

app.listen(PORT);
