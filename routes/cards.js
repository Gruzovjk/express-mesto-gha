const router = require('express').Router();
const {
  createCard,
  removeCardById,
  getCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateCardCreate,
  validateCardId,
} = require('../middlewares/validator');

router.get('/', getCards);
router.post('/', validateCardCreate, createCard);
router.delete('/:id', validateCardId, removeCardById);
router.put('/:id/likes', validateCardId, likeCard);
router.delete('/:id/likes', validateCardId, dislikeCard);

module.exports = router;
