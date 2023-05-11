const router = require('express').Router();
const {
  createCard,
  removeCardById,
  getCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const { validateCardCreate, validateId } = require('../middlewares/validator');

router.get('/', getCards);
router.post('/', validateCardCreate, createCard);
router.delete('/:id', validateId, removeCardById);
router.put('/:id/likes', validateId, likeCard);
router.delete('/:id/likes', validateId, dislikeCard);

module.exports = router;
