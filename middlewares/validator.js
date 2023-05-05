const { celebrate, Joi } = require('celebrate');
// const validator = require('validator');
const { regex } = require('../utils/regex');
// const { BadRequestError } = require('../errors/index');

// const validateUrl = (url) => {
//   const result = validator.isURL(url);
//   if (result) {
//     return url;
//   }
//   throw new BadRequestError('Неккоректная ссылка на изображение');
// };

const validateSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regex),
  }),
});

const validateCardCreate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateSignUp,
  validateSignIn,
  validateUpdateProfile,
  validateUpdateAvatar,
  validateCardCreate,
  validateId,
};
