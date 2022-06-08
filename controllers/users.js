const User = require('../models/user');
const ErrorNotFound = require('../errors/ErrorNotFound');

// всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.log(err.stack || err);
    });
};

// получение данных пользователя
const getUserById = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь ${req.params._id} не найден`);
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.message === `Пользователь ${req.params._id} не найден`) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      } if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Пользователя с таким id нет. Данные введены неверно' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// создание пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Неверные данные пользователя' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// обновление пользователя
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь ${req.params._id} не найден`);
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === `Пользователь ${req.params._id} не найден`) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// обновление аватара
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { avatar }, { runValidators: true, new: true })
    .orFail(() => {
      throw new ErrorNotFound(`Пользователь ${req.params.id} не найден`);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 400) {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      } if (err.statusCode === 404) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserInfo,
  updateAvatar,
};
