const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCardById);
router.delete('/:cardId/likes', deleteCardLike);
router.put('/:cardId/likes', putCardLike);

module.exports = router;
