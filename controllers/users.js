const user = require("../models/user");
const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: "Ошибка сервера" }));
};

module.exports.getUserById = (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Пользователь с таким id не найден" });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res.status(400).send({ message: "Некорректный id" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(400).send({
      message: "Не заполнено обязательное поле/данные введены некорректно",
    });
  }
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError" || err instanceof CastError) {
        res
          .status(400)
          .send({ message: "Некорректный id или неправильно заполнены поля" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  if (!name || !about) {
    return res.status(400).send({
      message: "Не заполнено обязательное поле/данные введены некорректно",
    });
  }
  User.findByIdAndUpdate({ _id: req.user._id }, { name, about })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Пользователь с таким id не найден" });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err instanceof CastError) {
        res
          .status(400)
          .send({ message: "Некорректный id или неправильно заполнены поля" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).send({
      message: "Не заполнено обязательное поле/данные введены некорректно",
    });
  }
  User.findByIdAndUpdate({ _id: req.user._id }, { avatar })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: "Пользователь с таким id не найден" });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err instanceof CastError) {
        res
          .status(400)
          .send({ message: "Некорректный id или неправильно заполнены поля" });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};
