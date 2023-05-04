const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');
// eslint-disable-next-line import/no-extraneous-dependencies
const { compare } = require('bcrypt');

const regex = require('../utils/regex');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(data) {
        return regex.test(data);
      },
      message: 'Некорректная ссылка',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password, res) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Неправильные почта или пароль' });
      }

      return compare(password, user.password).then((matched) => {
        if (!matched) {
          res.status(404).send({ message: 'Неправильные почта или пароль' });
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
