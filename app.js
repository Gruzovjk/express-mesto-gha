const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6445618b1c013e21db4843a5',
  };

  next();
});

app.use(require('./routes/index'));

app.listen(PORT);
