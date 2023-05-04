// eslint-disable-next-line import/no-extraneous-dependencies
const { hash } = require('bcrypt');
const User = require('../models/user');
// eslint-disable-next-line import/order
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

module.exports.getUserById = (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.createUser = (req, res) => {
  // eslint-disable-next-line object-curly-newline
  const { name, about, avatar, email } = req.body;
  if (!name || !about || !avatar || !email) {
    return res.status(400).send({
      message: 'Не заполнено обязательное поле/данные введены некорректно',
    });
  }
  hash(req.body.password, 10).then((dataHash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: dataHash,
    })
      .then((user) => res.status(200).send({ user }))
      .catch((err) => {
        if (err.name === 'ValidationError' || err.name === 'CastError') {
          res.status(400).send({
            message: 'Некорректный id или неправильно заполнены поля',
          });
        } else {
          res.status(500).send({ message: 'Ошибка сервера' });
        }
      });
  });

  return null;
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  if (!name || !about) {
    return res.status(400).send({
      message: 'Не заполнено обязательное поле/данные введены некорректно',
    });
  }
  User.findByIdAndUpdate({ _id: req.user._id }, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Некорректный id или неправильно заполнены поля' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
  return null;
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).send({
      message: 'Не заполнено обязательное поле/данные введены некорректно',
    });
  }
  User.findByIdAndUpdate({ _id: req.user._id }, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      } else {
        res.status(200).send({ user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Некорректный id или неправильно заполнены поля' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
  return null;
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password).then((user) => {
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
      {
        expiresIn: '7d',
      },
    );
    res
      .cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      })
      .send({ token });
  });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id).then((user) => {
    if (!user) {
      res.status(404).send({ message: 'Пользователь с таким id не найден' });
    }
    return res.send({ user });
  });
};
