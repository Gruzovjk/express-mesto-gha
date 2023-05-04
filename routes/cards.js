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
  // validateCardId,
} = require('../middlewares/validator');

router.get('/', getCards);
router.post('/', validateCardCreate, createCard);
router.delete('/:id', removeCardById);
router.put('/:id/likes', likeCard);
router.delete('/:id/likes', dislikeCard);

module.exports = router;
