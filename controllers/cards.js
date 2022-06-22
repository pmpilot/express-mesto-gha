const mongoose = require('mongoose');
const Card = require('../models/card');
const ErrorNotFound = require('../errors/ErrorNotFound');

// карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      res.send({ message: 'Произошла ошибка с получением карточек' });
    });
};

// создание карточек
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Данные введены неверно' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// удаление карточек
const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new ErrorNotFound(`Нет карточки с id ${req.params.cardId}`);
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (res.status(404)) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      if (err instanceof mongoose.CastError) {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// лайк
const putCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Нет карточки с id ${req.params.cardId}`);
    }).then((like) => res.status(200).send({ data: like }))
    .catch((err) => {
      if (err.message === `Нет карточки с id ${req.params.cardId}`) {
        return res.status(404).send({ message: 'Карточка с таким id не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// удаление лайка
const deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Нет карточки с id ${req.params.cardId}`);
    })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.message === `Нет карточки с id ${req.params.cardId}`) {
        return res.status(404).send({ message: 'Карточка с таким id не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

module.exports = {
  getCards,
  createCard,
  putCardLike,
  deleteCardById,
  deleteCardLike,
};
