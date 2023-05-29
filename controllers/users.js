/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable object-curly-newline */
/* eslint-disable import/order */
const { hash } = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
  ConflictingRequestError,
  NotFoundError,
  BadRequestError,
} = require('../errors/index');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
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
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError('Некорректный id');
        return next(error);
      }
      return next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        const error = new NotFoundError('Пользователь с таким id не найден');
        return next(error);
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
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
        .then((user) =>
          res.status(201).send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
          }),
        )
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const error = new BadRequestError(
              `Переданы некорректные данные - ${err.name - err.message}`,
            );
            return next(error);
          }
          if (err.code === 11000) {
            const error = new ConflictingRequestError(
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
        .send(user.toJSON());
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
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new BadRequestError(
          `Некорректный id или неправильно заполнены поля - ${
            err.name - err.message
          }`,
        );
        return next(error);
      }
      return next(err);
    });
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
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new BadRequestError(
          `Некорректная ссылка на картинку или некорректный id - ${
            err.name - err.message
          }`,
        );
        return next(error);
      }
      return next(err);
    });
};
