const mongoose = require('mongoose');
const validator = require('validator');
const { compare } = require('bcrypt');
const { regex } = require('../utils/regex');
const { UnauthorizedError } = require('../errors/index');

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
      validator(avatar) {
        return regex.test(avatar);
      },
      message: (props) => `${props.value} некорректная ссылка!`,
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

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
        // res.status(404).send({ message: 'Неправильные почта или пароль' });
      }

      return compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неправильные почта или пароль');
          // res.status(404).send({ message: 'Неправильные почта или пароль' });
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
