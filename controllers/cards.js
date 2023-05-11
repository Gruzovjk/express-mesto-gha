/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const Card = require('../models/card');

const {
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} = require('../errors/index');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        const error = new BadRequestError(
          `Переданы некорректные данные - ${err.name - err.message}`,
        );
        return next(error);
      }
      return next(err);
    });
};

module.exports.removeCardById = (req, res, next) => {
  const cardId = req.params.id;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        const error = new NotFoundError('Карточка с таким id не найдена');
        return next(error);
      }
      if (!card.owner.equals(req.user._id)) {
        const error = new ForbiddenError('Нельзя удалить чужую карточку');
        return next(error);
      }
      return card
        .deleteOne()
        .then(() =>
          res.status(200).send({ message: 'Карточка успешно удалена' }),
        );
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError('Некорректный id');
        return next(error);
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const error = new NotFoundError('Карточка с таким id не найдена');
        return next(error);
      }
      return res.status(200).send({ card, message: 'Лайк поставлен' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError('Некорректный id');
        return next(error);
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const error = new NotFoundError('Карточка с таким id не найдена');
        return next(error);
      }
      return res.status(200).send({ card, message: 'Лайк убран' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequestError('Некорректный id');
        return next(error);
      }
      return next(err);
    });
};
