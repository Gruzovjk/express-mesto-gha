const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() =>
      res.status(500).send({ message: 'На сервере произошла ошибка' }),
    );
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  if (!name || !link) {
    return res.status(400).send({ message: 'Не заполнено обязательное поле' });
  }

  Card.create({ name, link })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Некорректный id или не правильно заполнено поле' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });

  return null;
};

module.exports.removeCardById = (req, res) => {
  const cardId = req.params.id;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.status(200).send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.status(200).send({ card, message: 'Лайк поставлен' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с таким id не найдена' });
      } else {
        res.status(200).send({ card, message: 'Лайк убран' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
