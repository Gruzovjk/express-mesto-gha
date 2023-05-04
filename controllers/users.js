// eslint-disable-next-line import/no-extraneous-dependencies
const { hash } = require('bcrypt');
const User = require('../models/user');
// eslint-disable-next-line import/order
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { DuplicateError, NotFoundError, CastError } = require('../errors/index');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new NotFoundError('Пользователь с таким id не найден');
        return next(error);
      }
      return res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new CastError('Некорректный id');
        return next(error);
      }
      return next(err);
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        const error = new NotFoundError('Пользователь с таким id не найден');
        return next(error);
      }
      return res.send({ user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  // eslint-disable-next-line object-curly-newline
  const { name, about, avatar, email } = req.body;
  hash(req.body.password, 10)
    .then((dataHash) => {
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
            const error = new CastError(
              'Некорректный id или неправильно заполнены поля',
            );
            return next(error);
          }
          if (err.code === 11000) {
            const error = new DuplicateError(
              'Пользователь с таким e-mail уже существует',
            );
            return next(error);
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
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
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    { _id: req.user._id },
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        const error = new NotFoundError('Пользователь с таким id не найден');
        return next(error);
      }
      return res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new CastError(
          'Некорректный id или неправильно заполнены поля',
        );
        return next(error);
      }
      return next(err);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        const error = new NotFoundError('Пользователь с таким id не найден');
        return next(error);
      }
      return res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new CastError('Некорректная ссылка на картинку');
        return next(error);
      }
      return next(err);
    })
    .catch(next);
};
